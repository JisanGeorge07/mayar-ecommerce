using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Mayar.Api.Helpers;

namespace Mayar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IOrderService _orderService;
    private readonly IEmailService _emailService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IPaymentService paymentService,
        IOrderService orderService,
        IEmailService emailService,
        ILogger<PaymentController> logger)
    {
        _paymentService = paymentService;
        _orderService = orderService;
        _emailService = emailService;
        _logger = logger;
    }

    private Guid? TryGetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }

    private Guid GetUserId()
    {
        var userId = TryGetUserId();
        if (!userId.HasValue)
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }
        return userId.Value;
    }

    private string? GetSessionId()
    {
        return Request.Headers["X-Session-Id"].FirstOrDefault();
    }

    /// <summary>
    /// Initiate a payment session with MyFatoorah
    /// </summary>
    [HttpPost("initiate")]
    [AllowAnonymous]
    public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentDto dto)
    {
        try
        {
            _logger.LogInformation("Initiating payment for order {OrderId}", dto.OrderId);
            var result = await _paymentService.InitiatePaymentAsync(dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid payment request");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initiate payment for order {OrderId}", dto.OrderId);
            // Return detailed error in development for debugging
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            return StatusCode(500, new
            {
                message = isDevelopment ? ex.Message : "Failed to initiate payment. Please try again.",
                details = isDevelopment ? ex.InnerException?.Message : null,
                stack = isDevelopment ? ex.StackTrace : null
            });
        }
    }

    /// <summary>
    /// Verify payment status after callback
    /// </summary>
    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentDto dto)
    {
        try
        {
            _logger.LogInformation("Verifying payment {PaymentId}", dto.PaymentId);
            var result = await _paymentService.VerifyPaymentAsync(dto.PaymentId);

            // Update order payment status based on verification result
            if (result.OrderId != Guid.Empty)
            {
                var paymentStatus = result.InvoiceStatus switch
                {
                    "PAID" => "Paid",
                    "PENDING" => "Pending",
                    "FAILED" => "Failed",
                    "CANCELED" or "CANCELLED" => "Failed",
                    _ => "Pending"
                };

                var transactionId = $"MF-{dto.PaymentId}";
                await _orderService.UpdatePaymentStatusAsync(result.OrderId, paymentStatus, transactionId, result.InvoiceStatus);

                // Send payment receipt email if payment was successful
                if (paymentStatus == "Paid")
                {
                    await SendPaymentReceiptAsync(result.OrderId);
                }
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to verify payment {PaymentId}", dto.PaymentId);
            return StatusCode(500, new { message = "Failed to verify payment. Please try again." });
        }
    }

    /// <summary>
    /// Send payment receipt email for an order
    /// </summary>
    private async Task SendPaymentReceiptAsync(Guid orderId)
    {
        try
        {
            var context = HttpContext.RequestServices.GetRequiredService<Data.AppDbContext>();
            var order = await context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order != null)
            {
                var emailSent = await _emailService.SendPaymentReceiptAsync(order);
                if (emailSent)
                {
                    _logger.LogInformation("Payment receipt sent for order {OrderNumber}", order.OrderNumber);
                }
                else
                {
                    _logger.LogWarning("Failed to send payment receipt for order {OrderNumber}", order.OrderNumber);
                }
            }
        }
        catch (Exception ex)
        {
            // Don't fail the payment verification if email fails
            _logger.LogError(ex, "Error sending payment receipt for order {OrderId}", orderId);
        }
    }

    /// <summary>
    /// Complete mock payment (development only)
    /// </summary>
    [HttpPost("mock-complete")]
    [AllowAnonymous]
    public async Task<IActionResult> CompleteMockPayment([FromBody] CompleteMockPaymentDto dto)
    {
        try
        {
            _logger.LogInformation("Completing mock payment for order {OrderId}", dto.OrderId);

            var userId = TryGetUserId();
            var sessionId = GetSessionId();

            var order = await _orderService.GetOrderByIdAsync(dto.OrderId, userId, sessionId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            var context = HttpContext.RequestServices.GetRequiredService<Data.AppDbContext>();

            // Check if a payment record already exists for this order (from failed real API attempt)
            var existingPayment = await context.Payments
                .Where(p => p.OrderId == dto.OrderId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            Entities.Payment payment;

            if (existingPayment != null)
            {
                // Update existing payment record instead of creating a new one
                _logger.LogInformation("Updating existing payment record {PaymentId} for order {OrderId}",
                    existingPayment.Id, dto.OrderId);

                existingPayment.GatewayEnvironment = "MOCK";
                existingPayment.InvoiceId = dto.InvoiceId;
                existingPayment.PaymentId = dto.PaymentId ?? $"MOCK-{Guid.NewGuid().ToString()[..8].ToUpper()}";
                existingPayment.PaymentStatus = dto.Status.ToUpper();
                existingPayment.GatewayResponse = System.Text.Json.JsonSerializer.Serialize(new
                {
                    mock = true,
                    status = dto.Status,
                    timestamp = DateTimeHelper.GetLocalTime()
                });
                existingPayment.CallbackResponse = System.Text.Json.JsonSerializer.Serialize(new
                {
                    paymentId = existingPayment.PaymentId,
                    invoiceStatus = dto.Status.ToUpper(),
                    transactionStatus = dto.Status.ToUpper() == "PAID" ? "SUCCESS" : "FAILED",
                    orderId = dto.OrderId,
                    orderNumber = dto.OrderNumber,
                    invoiceId = dto.InvoiceId,
                    paidAmount = dto.Amount,
                    paidCurrency = dto.Currency,
                    completedAt = DateTimeHelper.GetLocalTime()
                });
                existingPayment.ErrorResponse = dto.Status.ToUpper() == "FAILED" ? "Mock payment failed" : null;
                existingPayment.UpdatedAt = DateTimeHelper.GetLocalTime();

                payment = existingPayment;
            }
            else
            {
                // Create new payment record if none exists
                payment = new Entities.Payment
                {
                    Id = Guid.NewGuid(),
                    OrderId = dto.OrderId,
                    UserId = userId,
                    SessionId = sessionId,
                    PaymentGateway = "MyFatoorah",
                    GatewayEnvironment = "MOCK",
                    PaymentMethodId = "MyFatoorah",
                    InvoiceId = dto.InvoiceId,
                    PaymentId = dto.PaymentId ?? $"MOCK-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                    TransactionReference = dto.OrderNumber,
                    InvoiceAmount = dto.Amount,
                    CurrencyIso = dto.Currency,
                    PaymentStatus = dto.Status.ToUpper(),
                    GatewayResponse = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        mock = true,
                        status = dto.Status,
                        timestamp = DateTimeHelper.GetLocalTime()
                    }),
                    CallbackResponse = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        paymentId = dto.PaymentId ?? $"MOCK-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                        invoiceStatus = dto.Status.ToUpper(),
                        transactionStatus = dto.Status.ToUpper() == "PAID" ? "SUCCESS" : "FAILED",
                        orderId = dto.OrderId,
                        orderNumber = dto.OrderNumber,
                        invoiceId = dto.InvoiceId,
                        paidAmount = dto.Amount,
                        paidCurrency = dto.Currency,
                        completedAt = DateTimeHelper.GetLocalTime()
                    }),
                    ErrorResponse = dto.Status.ToUpper() == "FAILED" ? "Mock payment failed" : null,
                    CreatedAt = DateTimeHelper.GetLocalTime(),
                    UpdatedAt = DateTimeHelper.GetLocalTime()
                };

                context.Payments.Add(payment);
            }

            await context.SaveChangesAsync();

            // Update order payment status
            var paymentStatus = dto.Status.ToUpper() switch
            {
                "PAID" => "Paid",
                "PENDING" => "Pending",
                "FAILED" => "Failed",
                _ => "Pending"
            };

            await _orderService.UpdatePaymentStatusAsync(dto.OrderId, paymentStatus, payment.PaymentId, dto.Status);

            // Send payment receipt email if payment was successful
            if (paymentStatus == "Paid")
            {
                await SendPaymentReceiptAsync(dto.OrderId);
            }

            _logger.LogInformation("Mock payment completed: {PaymentId}, Status: {Status}", payment.Id, payment.PaymentStatus);

            return Ok(new
            {
                paymentId = payment.PaymentId,
                invoiceStatus = payment.PaymentStatus,
                transactionStatus = dto.Status.ToUpper() == "PAID" ? "SUCCESS" : "FAILED",
                orderId = dto.OrderId,
                orderNumber = dto.OrderNumber,
                invoiceId = payment.InvoiceId,
                paidAmount = dto.Amount,
                paidCurrency = dto.Currency
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to complete mock payment for order {OrderId}", dto.OrderId);
            return StatusCode(500, new { message = "Failed to complete mock payment" });
        }
    }

    /// <summary>
    /// Webhook endpoint for MyFatoorah payment notifications
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook([FromBody] object payload)
    {
        try
        {
            _logger.LogInformation("Received webhook from MyFatoorah: {Payload}", payload?.ToString());

            // TODO: Implement webhook signature verification
            // TODO: Parse webhook payload and update order status accordingly

            return Ok(new { message = "Webhook received" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process webhook");
            return StatusCode(500, new { message = "Failed to process webhook" });
        }
    }
}

// DTO for mock payment completion
public class CompleteMockPaymentDto
{
    public required Guid OrderId { get; set; }
    public required string OrderNumber { get; set; }
    public required string InvoiceId { get; set; }
    public string? PaymentId { get; set; }
    public required decimal Amount { get; set; }
    public required string Currency { get; set; }
    public required string Status { get; set; } // PAID, PENDING, FAILED
}
