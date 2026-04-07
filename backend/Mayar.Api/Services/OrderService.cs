using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Enums;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Mayar.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrderService> _logger;

    public OrderService(AppDbContext context, ILogger<OrderService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid? userId, string? sessionId, CreateOrderDto dto)
    {
        // Ensure either userId or sessionId is provided
        if (userId == null && string.IsNullOrEmpty(sessionId))
        {
            throw new ArgumentException("Either userId or sessionId must be provided");
        }

        var orderNumber = GenerateOrderNumber();
        var trackingId = GenerateTrackingId();

        var order = dto.ToEntity(userId, sessionId, orderNumber, trackingId);

        // Add order items
        foreach (var itemDto in dto.Items)
        {
            var orderItem = itemDto.ToEntity(order.Id);
            order.OrderItems.Add(orderItem);
        }

        // Add initial status history
        var statusHistory = new OrderStatusHistory
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            FromStatus = null,
            ToStatus = OrderStatus.Pending,
            Note = userId.HasValue ? "Order created" : "Guest order created",
            ChangedBy = null,
            CreatedAt = DateTime.UtcNow
        };
        order.StatusHistory.Add(statusHistory);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderNumber} created for {UserType}: {Identifier}",
            orderNumber,
            userId.HasValue ? "user" : "guest",
            userId?.ToString() ?? sessionId);

        return order.ToDto();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid orderId, Guid? userId = null, string? sessionId = null)
    {
        var query = _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .Where(o => o.Id == orderId);

        // Filter by userId if provided, otherwise by sessionId
        if (userId.HasValue)
        {
            query = query.Where(o => o.UserId == userId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(o => o.SessionId == sessionId);
        }

        var order = await query.FirstOrDefaultAsync();
        return order?.ToDto();
    }

    public async Task<OrderDto?> GetOrderByNumberAsync(string orderNumber, Guid? userId = null, string? sessionId = null)
    {
        var query = _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .Where(o => o.OrderNumber == orderNumber);

        // Filter by userId if provided, otherwise by sessionId
        if (userId.HasValue)
        {
            query = query.Where(o => o.UserId == userId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(o => o.SessionId == sessionId);
        }

        var order = await query.FirstOrDefaultAsync();
        return order?.ToDto();
    }

    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => o.ToDto());
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto dto, Guid? changedBy = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return null;

        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
        {
            _logger.LogWarning("Invalid order status: {Status}", dto.Status);
            return null;
        }

        var previousStatus = order.Status;
        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        // Update specific timestamps based on status
        if (newStatus == OrderStatus.InTransit || newStatus == OrderStatus.PickedUp)
        {
            order.ShippedAt = DateTime.UtcNow;
        }
        else if (newStatus == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTime.UtcNow;
        }

        // Add status history
        var statusHistory = new OrderStatusHistory
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            FromStatus = previousStatus,
            ToStatus = newStatus,
            Note = dto.Note,
            ChangedBy = changedBy,
            CreatedAt = DateTime.UtcNow
        };
        _context.OrderStatusHistory.Add(statusHistory);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} status updated from {From} to {To}", orderId, previousStatus, newStatus);

        return order.ToDto();
    }

    public async Task<OrderDto?> UpdatePaymentStatusAsync(Guid orderId, string paymentStatus, string? transactionId = null, string? gatewayResponse = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return null;

        if (!Enum.TryParse<PaymentStatus>(paymentStatus, true, out var newPaymentStatus))
        {
            _logger.LogWarning("Invalid payment status: {Status}", paymentStatus);
            return null;
        }

        order.PaymentStatus = newPaymentStatus;
        order.UpdatedAt = DateTime.UtcNow;

        // If payment is successful, update order status to Confirmed and decrement stock
        if (newPaymentStatus == PaymentStatus.Paid)
        {
            var previousStatus = order.Status;
            order.Status = OrderStatus.Confirmed;

            // Add status history
            var statusHistory = new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                FromStatus = previousStatus,
                ToStatus = OrderStatus.Confirmed,
                Note = "Payment confirmed",
                CreatedAt = DateTime.UtcNow
            };
            _context.OrderStatusHistory.Add(statusHistory);

            // Decrement stock for each order item
            foreach (var item in order.OrderItems)
            {
                if (item.ProductVariantId.HasValue && item.Quantity.HasValue)
                {
                    var variant = await _context.ProductVariants
                        .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId.Value);

                    if (variant != null && variant.StockQuantity.HasValue)
                    {
                        variant.StockQuantity -= item.Quantity.Value;

                        // Set InStock to false if stock is depleted
                        if (variant.StockQuantity <= 0)
                        {
                            variant.StockQuantity = 0;
                            variant.InStock = false;
                        }

                        _logger.LogInformation(
                            "Stock updated for variant {VariantId}: Quantity reduced by {Qty}, New stock: {Stock}, InStock: {InStock}",
                            variant.Id, item.Quantity.Value, variant.StockQuantity, variant.InStock);
                    }
                }
            }

            // Clear cart items for the user/session after successful payment
            var cartItemsQuery = _context.CartItems.Where(c => c.IsActive);
            if (order.UserId.HasValue)
            {
                cartItemsQuery = cartItemsQuery.Where(c => c.UserId == order.UserId);
            }
            else if (!string.IsNullOrEmpty(order.SessionId))
            {
                cartItemsQuery = cartItemsQuery.Where(c => c.SessionId == order.SessionId);
            }

            var cartItems = await cartItemsQuery.ToListAsync();
            foreach (var cartItem in cartItems)
            {
                cartItem.IsActive = false;
                cartItem.UpdatedAt = DateTime.UtcNow;
            }

            _logger.LogInformation("Cleared {Count} cart items after successful payment for order {OrderId}",
                cartItems.Count, orderId);
        }

        // Add transaction record
        if (!string.IsNullOrEmpty(transactionId))
        {
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                TransactionNumber = transactionId,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = newPaymentStatus,
                Amount = order.TotalAmount,
                GatewayResponse = gatewayResponse,
                TransactionDate = DateTime.UtcNow
            };
            _context.Transactions.Add(transaction);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} payment status updated to {Status}", orderId, newPaymentStatus);

        return order.ToDto();
    }

    public async Task<bool> CancelOrderAsync(Guid orderId, Guid userId, string? reason = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null) return false;

        // Can only cancel orders that are not yet shipped
        if (order.Status >= OrderStatus.PickedUp)
        {
            _logger.LogWarning("Cannot cancel order {OrderId} - already shipped", orderId);
            return false;
        }

        var previousStatus = order.Status;
        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        // Restore stock if payment was already made
        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            foreach (var item in order.OrderItems)
            {
                if (item.ProductVariantId.HasValue && item.Quantity.HasValue)
                {
                    var variant = await _context.ProductVariants
                        .FirstOrDefaultAsync(v => v.Id == item.ProductVariantId.Value);

                    if (variant != null)
                    {
                        variant.StockQuantity = (variant.StockQuantity ?? 0) + item.Quantity.Value;
                        variant.InStock = true;

                        _logger.LogInformation(
                            "Stock restored for variant {VariantId}: Quantity increased by {Qty}, New stock: {Stock}",
                            variant.Id, item.Quantity.Value, variant.StockQuantity);
                    }
                }
            }
        }

        // Add status history
        var statusHistory = new OrderStatusHistory
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            FromStatus = previousStatus,
            ToStatus = OrderStatus.Cancelled,
            Note = reason ?? "Cancelled by user",
            ChangedBy = userId,
            CreatedAt = DateTime.UtcNow
        };
        _context.OrderStatusHistory.Add(statusHistory);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} cancelled by user {UserId}", orderId, userId);

        return true;
    }

    private static string GenerateOrderNumber()
    {
        var prefix = "MYR";
        var timestamp = DateTime.UtcNow.Ticks.ToString("X").Substring(0, 6).ToUpper();
        var random = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();
        return $"{prefix}-{timestamp}-{random}";
    }

    private static string GenerateTrackingId()
    {
        var prefix = "TRK";
        var random = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
        return $"{prefix}{random}";
    }
}
