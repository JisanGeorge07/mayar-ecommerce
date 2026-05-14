using Mayar.Api.Enums;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class OrderStatusHistory
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public OrderStatus? FromStatus { get; set; }
    public OrderStatus? ToStatus { get; set; }
    public string? Note { get; set; }
    public string? UpdatedByName { get; set; }
    public string? Source { get; set; }
    public Guid? ChangedBy { get; set; }
    public User? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
