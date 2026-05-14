using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Mayar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrderController> _logger;

    public OrderController(IOrderService orderService, ILogger<OrderController> logger)
    {
        _orderService = orderService;
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
        // Get session ID from header (for guest checkout)
        return Request.Headers["X-Session-Id"].FirstOrDefault();
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        try
        {
            var userId = TryGetUserId();
            var sessionId = GetSessionId();

            // Ensure either userId or sessionId is provided
            if (userId == null && string.IsNullOrEmpty(sessionId))
            {
                return BadRequest(new { message = "Authentication or session ID required" });
            }

            _logger.LogInformation("Creating order for {UserType}: {Identifier}",
                userId.HasValue ? "user" : "guest",
                userId?.ToString() ?? sessionId);

            var order = await _orderService.CreateOrderAsync(userId, sessionId, dto);

            _logger.LogInformation("Order created successfully. ID: {OrderId}, OrderNumber: {OrderNumber}",
                order.Id, order.OrderNumber);

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create order");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        try
        {
            var userId = TryGetUserId();
            var sessionId = GetSessionId();

            var order = await _orderService.GetOrderByIdAsync(id, userId, sessionId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get order {OrderId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("by-number/{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber)
    {
        try
        {
            var userId = TryGetUserId();
            var sessionId = GetSessionId();

            var order = await _orderService.GetOrderByNumberAsync(orderNumber, userId, sessionId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get order by number {OrderNumber}", orderNumber);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("by-tracking/{trackingId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderByTrackingId(string trackingId, [FromQuery] string? phone = null)
    {
        try
        {
            var order = await _orderService.GetOrderByTrackingIdAsync(trackingId, phone);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get order by tracking ID {TrackingId}", trackingId);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetUserOrders()
    {
        try
        {
            var userId = GetUserId();
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get user orders");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        try
        {
            Guid? changedBy = null;
            try
            {
                changedBy = GetUserId();
            }
            catch { }

            var order = await _orderService.UpdateOrderStatusAsync(id, dto, changedBy);

            if (order == null)
            {
                return NotFound(new { message = "Order not found or invalid status" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update order status {OrderId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id, [FromBody] CancelOrderDto? dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _orderService.CancelOrderAsync(id, userId, dto?.Reason);

            if (!result)
            {
                return BadRequest(new { message = "Order cannot be cancelled. It may not exist or has already been shipped." });
            }

            return Ok(new { message = "Order cancelled successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to cancel order {OrderId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    // ─── Admin endpoints ──────────────────────────────────────────────────────

    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAllOrders()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get all orders");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("admin/{id:guid}")]
    public async Task<IActionResult> GetOrderByIdAdmin(Guid id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAdminAsync(id);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get order {OrderId} (admin)", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("admin/{id:guid}")]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        try
        {
            var result = await _orderService.SoftDeleteOrderAsync(id);

            if (!result)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(new { message = "Order deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete order {OrderId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("admin/bulk-delete")]
    public async Task<IActionResult> BulkDeleteOrders([FromBody] BulkDeleteOrdersDto dto)
    {
        try
        {
            var result = await _orderService.SoftDeleteOrdersAsync(dto.Ids);

            if (!result)
            {
                return NotFound(new { message = "No orders found to delete" });
            }

            return Ok(new { message = $"Deleted {dto.Ids.Count} orders successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to bulk delete orders");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("admin/{id:guid}/admin-note")]
    public async Task<IActionResult> UpdateAdminNote(Guid id, [FromBody] UpdateAdminNoteDto dto)
    {
        try
        {
            var order = await _orderService.UpdateAdminNoteAsync(id, dto.Note);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update admin note for order {OrderId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("admin/create")]
    public async Task<IActionResult> CreateOrderAdmin([FromBody] CreateOrderDto dto)
    {
        try
        {
            _logger.LogInformation("Admin creating manual order");

            var order = await _orderService.CreateAdminOrderAsync(dto);

            _logger.LogInformation("Admin order created successfully. ID: {OrderId}, OrderNumber: {OrderNumber}",
                order.Id, order.OrderNumber);

            return CreatedAtAction(nameof(GetOrderByIdAdmin), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create order by admin");
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class CancelOrderDto
{
    public string? Reason { get; set; }
}
