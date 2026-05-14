using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Enums;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrderService> _logger;
    private readonly INotificationService _notificationService;

    public OrderService(AppDbContext context, ILogger<OrderService> logger, INotificationService notificationService)
    {
        _context = context;
        _logger = logger;
        _notificationService = notificationService;
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
        
        // Security: Override status for storefront checkouts to ensure they start as Pending
        order.Status = OrderStatus.Pending;
        order.PaymentStatus = PaymentStatus.Pending;

        // Fetch products and variants to ensure accurate images
        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        // Add order items
        foreach (var itemDto in dto.Items)
        {
            var orderItem = itemDto.ToEntity(order.Id);
            
            // Re-evaluate image robustly from database
            if (products.TryGetValue(itemDto.ProductId, out var product))
            {
                var primaryImage = product.Images
                    .Where(i => i.IsActive)
                    .OrderByDescending(i => i.IsPrimary)
                    .ThenBy(i => i.Id)
                    .FirstOrDefault()?.ImageUrl;

                string? variantImage = null;
                if (itemDto.VariantId.HasValue)
                {
                    var variant = product.Variants.FirstOrDefault(v => v.Id == itemDto.VariantId.Value);
                    variantImage = variant?.ImageUrl;
                }

                orderItem.ProductImageUrl = !string.IsNullOrEmpty(variantImage) 
                    ? variantImage 
                    : (!string.IsNullOrEmpty(primaryImage) ? primaryImage : itemDto.Image);
            }

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
            UpdatedByName = "System",
            Source = "system",
            ChangedBy = null,
            CreatedAt = DateTimeHelper.GetLocalTime()
        };
        order.StatusHistory.Add(statusHistory);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderNumber} created for {UserType}: {Identifier}",
            orderNumber,
            userId.HasValue ? "user" : "guest",
            userId?.ToString() ?? sessionId);

        // Notify Admin
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            TitleEnglish = "New Order Placed",
            TitleArabic = "تم تقديم طلب جديد",
            MessageEnglish = $"Order #{orderNumber} has been placed.",
            MessageArabic = $"تم تقديم الطلب رقم {orderNumber}.",
            Type = "new_order",
            Priority = "high",
            IsAdminNotification = true,
            ReferenceType = "Order",
            ReferenceId = order.Id.ToString()
        });

        // Notify User if registered
        if (userId.HasValue)
        {
            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = userId,
                TitleEnglish = "Order Placed",
                TitleArabic = "تم تقديم الطلب",
                MessageEnglish = $"Your order #{orderNumber} has been successfully placed.",
                MessageArabic = $"تم تقديم طلبك رقم {orderNumber} بنجاح.",
                Type = "order",
                Priority = "medium",
                IsAdminNotification = false,
                ReferenceType = "Order",
                ReferenceId = order.Id.ToString()
            });
        }

        return order.ToDto();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid orderId, Guid? userId = null, string? sessionId = null)
    {
        var query = _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .Where(o => o.Id == orderId && !o.IsDeleted);

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
            .Where(o => o.OrderNumber == orderNumber && !o.IsDeleted);

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
            .Where(o => o.UserId == userId && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => o.ToDto());
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto dto, Guid? changedBy = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

        if (order == null) return null;

        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
        {
            _logger.LogWarning("Invalid order status: {Status}", dto.Status);
            return null;
        }

        var previousStatus = order.Status;
        order.Status = newStatus;
        order.UpdatedAt = DateTimeHelper.GetLocalTime();

        // Update specific timestamps based on status
        if (newStatus == OrderStatus.InTransit || newStatus == OrderStatus.PickedUp)
        {
            order.ShippedAt = DateTimeHelper.GetLocalTime();
        }
        else if (newStatus == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTimeHelper.GetLocalTime();
        }

        // Add status history
        var statusHistory = new OrderStatusHistory
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            FromStatus = previousStatus,
            ToStatus = newStatus,
            Note = dto.Note,
            UpdatedByName = dto.UpdatedByName ?? "Admin",
            Source = dto.Source ?? "admin",
            ChangedBy = changedBy,
            CreatedAt = DateTimeHelper.GetLocalTime()
        };
        _context.OrderStatusHistory.Add(statusHistory);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} status updated from {From} to {To}", orderId, previousStatus, newStatus);

        // Notify User of status change
        if (order.UserId.HasValue)
        {
            string titleEn = "Order Updated";
            string titleAr = "تحديث الطلب";
            string msgEn = $"Your order #{order.OrderNumber} status is now {newStatus}.";
            string msgAr = $"حالة طلبك رقم {order.OrderNumber} هي الآن {newStatus}.";
            string type = "order";

            if (newStatus == OrderStatus.OutForDelivery)
            {
                titleEn = "Out for Delivery";
                titleAr = "في الطريق إليك";
                msgEn = $"Your order #{order.OrderNumber} is out for delivery today.";
                msgAr = $"طلبك رقم {order.OrderNumber} في الطريق إليك اليوم.";
                type = "delivery";
            }
            else if (newStatus == OrderStatus.Delivered)
            {
                titleEn = "Order Delivered";
                titleAr = "تم التوصيل";
                msgEn = $"Your order #{order.OrderNumber} has been delivered. Enjoy!";
                msgAr = $"تم توصيل طلبك رقم {order.OrderNumber}. استمتع به!";
                type = "delivery";
            }

            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = order.UserId,
                TitleEnglish = titleEn,
                TitleArabic = titleAr,
                MessageEnglish = msgEn,
                MessageArabic = msgAr,
                Type = type,
                Priority = "medium",
                IsAdminNotification = false,
                ReferenceType = "Order",
                ReferenceId = order.Id.ToString()
            });
        }

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
        order.UpdatedAt = DateTimeHelper.GetLocalTime();

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
                UpdatedByName = "System",
                Source = "system",
                CreatedAt = DateTimeHelper.GetLocalTime()
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
                cartItem.UpdatedAt = DateTimeHelper.GetLocalTime();
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
                TransactionDate = DateTimeHelper.GetLocalTime()
            };
            _context.Transactions.Add(transaction);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} payment status updated to {Status}", orderId, newPaymentStatus);
        
        if (newPaymentStatus == PaymentStatus.Paid)
        {
            // Notify Admin
            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                TitleEnglish = "Payment Success",
                TitleArabic = "نجاح الدفع",
                MessageEnglish = $"Payment of {order.TotalAmount} received for order #{order.OrderNumber}.",
                MessageArabic = $"تم استلام مبلغ {order.TotalAmount} للطلب رقم {order.OrderNumber}.",
                Type = "payment_success",
                Priority = "medium",
                IsAdminNotification = true,
                ReferenceType = "Order",
                ReferenceId = order.Id.ToString()
            });

            // Notify User
            if (order.UserId.HasValue)
            {
                await _notificationService.CreateNotificationAsync(new CreateNotificationDto
                {
                    UserId = order.UserId,
                    TitleEnglish = "Payment Received",
                    TitleArabic = "تم استلام الدفع",
                    MessageEnglish = $"Your payment for order #{order.OrderNumber} has been received.",
                    MessageArabic = $"تم استلام دفعتك للطلب رقم {order.OrderNumber}.",
                    Type = "order",
                    Priority = "medium",
                    IsAdminNotification = false,
                    ReferenceType = "Order",
                    ReferenceId = order.Id.ToString()
                });
            }
        }

        return order.ToDto();
    }

    public async Task<bool> CancelOrderAsync(Guid orderId, Guid userId, string? reason = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && !o.IsDeleted);

        if (order == null) return false;

        // Can only cancel orders that are not yet shipped
        if (order.Status >= OrderStatus.PickedUp)
        {
            _logger.LogWarning("Cannot cancel order {OrderId} - already shipped", orderId);
            return false;
        }

        var previousStatus = order.Status;
        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTimeHelper.GetLocalTime();

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
            UpdatedByName = "Customer",
            Source = "system",
            ChangedBy = userId,
            CreatedAt = DateTimeHelper.GetLocalTime()
        };
        _context.OrderStatusHistory.Add(statusHistory);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} cancelled by user {UserId}", orderId, userId);

        return true;
    }

    // ─── Admin-specific methods ────────────────────────────────────────────────

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .Where(o => !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => o.ToDto());
    }

    public async Task<OrderDto?> GetOrderByIdAdminAsync(Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

        return order?.ToDto();
    }

    public async Task<bool> SoftDeleteOrderAsync(Guid orderId)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);
        if (order == null) return false;

        order.IsDeleted = true;
        order.DeletedAt = DateTimeHelper.GetLocalTime();
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} soft-deleted", orderId);
        return true;
    }

    public async Task<bool> SoftDeleteOrdersAsync(List<Guid> orderIds)
    {
        var orders = await _context.Orders
            .Where(o => orderIds.Contains(o.Id) && !o.IsDeleted)
            .ToListAsync();

        if (orders.Count == 0) return false;

        foreach (var order in orders)
        {
            order.IsDeleted = true;
            order.DeletedAt = DateTimeHelper.GetLocalTime();
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Soft-deleted {Count} orders", orders.Count);
        return true;
    }

    public async Task<OrderDto?> UpdateAdminNoteAsync(Guid orderId, string? note)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

        if (order == null) return null;

        order.AdminNote = note;
        order.UpdatedAt = DateTimeHelper.GetLocalTime();
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin note updated for order {OrderId}", orderId);
        return order.ToDto();
    }

    public async Task<OrderDto?> GetOrderByTrackingIdAsync(string trackingId, string? phoneNumber = null)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.TrackingId == trackingId && !o.IsDeleted);

        if (order == null) return null;

        // Validate phone number if provided (security: prevent random tracking)
        if (!string.IsNullOrEmpty(phoneNumber))
        {
            // Strip non-digit characters for comparison
            var inputDigits = new string(phoneNumber.Where(char.IsDigit).ToArray());
            var orderDigits = new string((order.CustomerPhone ?? "").Where(char.IsDigit).ToArray());

            // Match if the last 8 digits match (handles +965, 00965, etc.)
            var inputSuffix = inputDigits.Length >= 8 ? inputDigits[^8..] : inputDigits;
            var orderSuffix = orderDigits.Length >= 8 ? orderDigits[^8..] : orderDigits;

            if (inputSuffix != orderSuffix)
            {
                _logger.LogWarning("Tracking lookup phone mismatch for {TrackingId}", trackingId);
                return null;
            }
        }

        return order.ToDto();
    }

    public async Task<OrderDto> CreateAdminOrderAsync(CreateOrderDto dto)
    {
        var orderNumber = GenerateOrderNumber();
        var trackingId = GenerateTrackingId();

        // Pass null for userId and sessionId for admin-created orders
        var order = dto.ToEntity(null, null, orderNumber, trackingId);

        // Fetch products and variants to ensure accurate images
        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        // Add order items
        foreach (var itemDto in dto.Items)
        {
            var orderItem = itemDto.ToEntity(order.Id);
            
            // Re-evaluate image robustly from database
            if (products.TryGetValue(itemDto.ProductId, out var product))
            {
                var primaryImage = product.Images
                    .Where(i => i.IsActive)
                    .OrderByDescending(i => i.IsPrimary)
                    .ThenBy(i => i.Id)
                    .FirstOrDefault()?.ImageUrl;

                string? variantImage = null;
                if (itemDto.VariantId.HasValue)
                {
                    var variant = product.Variants.FirstOrDefault(v => v.Id == itemDto.VariantId.Value);
                    variantImage = variant?.ImageUrl;
                }

                orderItem.ProductImageUrl = !string.IsNullOrEmpty(variantImage) 
                    ? variantImage 
                    : (!string.IsNullOrEmpty(primaryImage) ? primaryImage : itemDto.Image);
            }

            order.OrderItems.Add(orderItem);
        }

        // Add initial status history
        var statusHistory = new OrderStatusHistory
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            FromStatus = null,
            ToStatus = order.Status,
            Note = "Order created manually by admin",
            UpdatedByName = "Admin",
            Source = "admin",
            ChangedBy = null,
            CreatedAt = DateTimeHelper.GetLocalTime()
        };
        order.StatusHistory.Add(statusHistory);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin manually created order {OrderNumber}", orderNumber);

        // Notify Admin (Other admins might want to know)
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            TitleEnglish = "Manual Order Created",
            TitleArabic = "تم إنشاء طلب يدوي",
            MessageEnglish = $"Admin created a manual order #{orderNumber}.",
            MessageArabic = $"قام المسؤول بإنشاء طلب يدوي رقم {orderNumber}.",
            Type = "admin_announcement",
            Priority = "low",
            IsAdminNotification = true,
            ReferenceType = "Order",
            ReferenceId = order.Id.ToString()
        });

        return order.ToDto();
    }

    private static string GenerateOrderNumber()
    {
        var prefix = "MYR";
        var timestamp = DateTimeHelper.GetLocalTime().Ticks.ToString("X").Substring(0, 6).ToUpper();
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
