using System;
using Mayar.Api.Enums;

namespace Mayar.Api.Entities;

public class Order
{
    public Guid Id { get; set; }
    public string? OrderNumber { get; set; }
    public string? TrackingId { get; set; }

    // User ID - nullable for guest checkout
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    // Session ID for guest orders (similar to CartItem)
    public string? SessionId { get; set; }

    // Customer details snapshot
    public string? CustomerFirstName { get; set; }
    public string? CustomerLastName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }

    // Reference to saved address (nullable - only if user selected saved address)
    public Guid? ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; } = null!;

    // Snapshot fields (always populated regardless of source)
    public string? ShippingArea { get; set; }
    public string? ShippingBlock { get; set; }
    public string? ShippingStreet { get; set; }
    public string? ShippingBuilding { get; set; }
    public string? ShippingFloor { get; set; }
    public string? ShippingFlatOffice { get; set; }
    public string? ShippingNotes { get; set; }

    // Shipping method
    public string? ShippingMethodId { get; set; }
    public string? ShippingMethodNameEn { get; set; }
    public string? ShippingMethodNameAr { get; set; }
    public string? ShippingEstimateEn { get; set; }
    public string? ShippingEstimateAr { get; set; }

    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public decimal? SubTotal { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? ShippingCost { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal? TotalAmount { get; set; }
    // INR or KWD
    public string? Currency { get; set; }
    public string? PromoCode { get; set; }
    public Guid? CouponCodeId { get; set; }
    public CouponCode? CouponCode { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
