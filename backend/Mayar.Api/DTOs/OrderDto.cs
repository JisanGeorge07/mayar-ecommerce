using Mayar.Api.Enums;

namespace Mayar.Api.DTOs;

// DTO for creating an order
public class CreateOrderDto
{
    public required CustomerDetailsDto Customer { get; set; }
    public required ShippingAddressDto Address { get; set; }
    public Guid? SavedAddressId { get; set; }
    public required ShippingMethodDto ShippingMethod { get; set; }
    public required string PaymentMethodId { get; set; }
    public required List<CreateOrderItemDto> Items { get; set; }
    public required OrderTotalsDto Totals { get; set; }
    public string? PromoCode { get; set; }
    public Guid? CouponCodeId { get; set; }
    public string? Currency { get; set; } = "KWD";
}

public class CustomerDetailsDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class ShippingAddressDto
{
    public required string Area { get; set; }
    public required string Block { get; set; }
    public required string Street { get; set; }
    public required string Building { get; set; }
    public string? Floor { get; set; }
    public string? FlatOffice { get; set; }
    public string? Notes { get; set; }
}

public class ShippingMethodDto
{
    public required string Id { get; set; }
    public required TranslatedTextDto Name { get; set; }
    public required TranslatedTextDto Estimate { get; set; }
    public decimal Price { get; set; }
}

public class CreateOrderItemDto
{
    public required Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public required string NameEn { get; set; }
    public required string NameAr { get; set; }
    public required string Image { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class OrderTotalsDto
{
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
}

// Response DTOs
public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string TrackingId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public CustomerDetailsDto Customer { get; set; } = new();
    public OrderAddressDto Address { get; set; } = new();
    public OrderShippingDto Shipping { get; set; } = new();
    public OrderPaymentDto Payment { get; set; } = new();
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal ShippingTotal { get; set; }
    public decimal DiscountTotal { get; set; }
    public string? PromoCode { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
}

public class OrderAddressDto
{
    public string Area { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Building { get; set; } = string.Empty;
    public string? Floor { get; set; }
    public string? FlatOffice { get; set; }
    public string? Notes { get; set; }
}

public class OrderShippingDto
{
    public string Id { get; set; } = string.Empty;
    public TranslatedTextDto Name { get; set; } = new();
    public decimal Fee { get; set; }
    public TranslatedTextDto Estimate { get; set; } = new();
}

public class OrderPaymentDto
{
    public string Id { get; set; } = string.Empty;
    public TranslatedTextDto Name { get; set; } = new();
}

public class OrderItemDto
{
    public Guid ProductId { get; set; }
    public TranslatedTextDto Name { get; set; } = new();
    public string Image { get; set; } = string.Empty;
    public string? Color { get; set; }
    public string? Size { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

// Payment DTOs
public class InitiatePaymentDto
{
    public required Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "KWD";
    /// <summary>
    /// Mobile country code without + prefix (e.g., "965" for Kuwait, "91" for India).
    /// If not provided, will be inferred from Currency (KWD=965, INR=91).
    /// </summary>
    public string? CountryCode { get; set; }
    public required string CustomerName { get; set; }
    public required string CustomerEmail { get; set; }
    public required string CustomerPhone { get; set; }
    public required string CallbackUrl { get; set; }
    public required string ErrorUrl { get; set; }
}

public class PaymentResponseDto
{
    public string PaymentUrl { get; set; } = string.Empty;
    public string InvoiceId { get; set; } = string.Empty;
    public decimal InvoiceValue { get; set; }
}

public class VerifyPaymentDto
{
    public required string PaymentId { get; set; }
}

public class PaymentVerificationDto
{
    public string PaymentId { get; set; } = string.Empty;
    public string InvoiceStatus { get; set; } = string.Empty;
    public string TransactionStatus { get; set; } = string.Empty;
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string InvoiceId { get; set; } = string.Empty;
    public decimal PaidAmount { get; set; }
    public string PaidCurrency { get; set; } = string.Empty;
    /// <summary>
    /// Error message from the payment gateway (e.g., AUTHENTICATION_UNSUCCESSFUL)
    /// </summary>
    public string? ErrorMessage { get; set; }
    /// <summary>
    /// Error code from the payment gateway (e.g., MF001)
    /// </summary>
    public string? ErrorCode { get; set; }
}

// Order status update DTO
public class UpdateOrderStatusDto
{
    public required string Status { get; set; }
    public string? Note { get; set; }
}
