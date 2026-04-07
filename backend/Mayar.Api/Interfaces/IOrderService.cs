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
}
