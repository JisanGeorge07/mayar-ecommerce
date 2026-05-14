using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(Guid? userId, string? sessionId, CreateOrderDto dto);
    Task<OrderDto?> GetOrderByIdAsync(Guid orderId, Guid? userId = null, string? sessionId = null);
    Task<OrderDto?> GetOrderByNumberAsync(string orderNumber, Guid? userId = null, string? sessionId = null);
    Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId);
    Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto dto, Guid? changedBy = null);
    Task<OrderDto?> UpdatePaymentStatusAsync(Guid orderId, string paymentStatus, string? transactionId = null, string? gatewayResponse = null);
    Task<bool> CancelOrderAsync(Guid orderId, Guid userId, string? reason = null);

    // Admin-specific methods
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> GetOrderByIdAdminAsync(Guid orderId);
    Task<bool> SoftDeleteOrderAsync(Guid orderId);
    Task<bool> SoftDeleteOrdersAsync(List<Guid> orderIds);
    Task<OrderDto?> UpdateAdminNoteAsync(Guid orderId, string? note);
    Task<OrderDto?> GetOrderByTrackingIdAsync(string trackingId, string? phoneNumber = null);
    Task<OrderDto> CreateAdminOrderAsync(CreateOrderDto dto);
}
