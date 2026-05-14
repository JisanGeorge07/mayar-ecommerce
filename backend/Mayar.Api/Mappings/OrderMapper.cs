using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Enums;
using Mayar.Api.Helpers;

namespace Mayar.Api.Mappings;

public static class OrderMapper
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber ?? string.Empty,
            TrackingId = order.TrackingId ?? string.Empty,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Customer = new CustomerDetailsDto
            {
                FirstName = order.CustomerFirstName ?? string.Empty,
                LastName = order.CustomerLastName ?? string.Empty,
                Email = order.CustomerEmail ?? string.Empty,
                Phone = order.CustomerPhone ?? string.Empty
            },
            Address = new OrderAddressDto
            {
                Area = order.ShippingArea ?? string.Empty,
                Block = order.ShippingBlock ?? string.Empty,
                Street = order.ShippingStreet ?? string.Empty,
                Building = order.ShippingBuilding ?? string.Empty,
                Floor = order.ShippingFloor,
                FlatOffice = order.ShippingFlatOffice,
                Notes = order.ShippingNotes
            },
            Shipping = new OrderShippingDto
            {
                Id = order.ShippingMethodId ?? string.Empty,
                Name = new TranslatedTextDto
                {
                    En = order.ShippingMethodNameEn ?? string.Empty,
                    Ar = order.ShippingMethodNameAr ?? string.Empty
                },
                Fee = order.ShippingCost ?? 0,
                Estimate = new TranslatedTextDto
                {
                    En = order.ShippingEstimateEn ?? string.Empty,
                    Ar = order.ShippingEstimateAr ?? string.Empty
                }
            },
            Payment = new OrderPaymentDto
            {
                Id = order.PaymentMethod.ToString().ToLower(),
                Name = new TranslatedTextDto
                {
                    En = GetPaymentMethodNameEn(order.PaymentMethod),
                    Ar = GetPaymentMethodNameAr(order.PaymentMethod)
                }
            },
            Items = order.OrderItems.Select(item => item.ToDto()).ToList(),
            Subtotal = order.SubTotal ?? 0,
            ShippingTotal = order.ShippingCost ?? 0,
            DiscountTotal = order.DiscountAmount ?? 0,
            PromoCode = order.PromoCode,
            Total = order.TotalAmount ?? 0,
            Status = order.Status.ToString().ToLower(),
            PaymentStatus = order.PaymentStatus.ToString().ToLower(),
            Notes = order.Notes,
            AdminNote = order.AdminNote,
            StatusHistory = order.StatusHistory
                .OrderBy(h => h.CreatedAt)
                .Select(h => h.ToDto())
                .ToList()
        };
    }

    public static OrderStatusHistoryDto ToDto(this OrderStatusHistory history)
    {
        return new OrderStatusHistoryDto
        {
            Id = history.Id,
            FromStatus = history.FromStatus?.ToString().ToLower(),
            ToStatus = history.ToStatus?.ToString().ToLower(),
            Note = history.Note,
            UpdatedByName = history.UpdatedByName,
            Source = history.Source,
            ChangedBy = history.ChangedBy,
            CreatedAt = history.CreatedAt
        };
    }

    public static OrderItemDto ToDto(this OrderItem item)
    {
        return new OrderItemDto
        {
            ProductId = item.ProductId,
            VariantId = item.ProductVariantId,
            Name = new TranslatedTextDto
            {
                En = item.ProductNameEnglish ?? string.Empty,
                Ar = item.ProductNameArabic ?? string.Empty
            },
            Image = item.ProductImageUrl ?? string.Empty,
            Color = item.ProductColor,
            Size = item.ProductSize,
            Sku = null,
            Quantity = item.Quantity ?? 0,
            UnitPrice = item.UnitPrice ?? 0,
            LineTotal = item.TotalPrice ?? 0
        };
    }

    public static Order ToEntity(this CreateOrderDto dto, Guid? userId, string? sessionId, string orderNumber, string trackingId)
    {
        var paymentMethod = dto.PaymentMethodId.ToLower() switch
        {
            "myfatoorah" => PaymentMethod.MyFatoorah,
            "cod" or "cashondelivery" => PaymentMethod.CashOnDelivery,
            _ => PaymentMethod.MyFatoorah
        };

        var status = OrderStatus.Pending;
        if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<OrderStatus>(dto.Status, true, out var parsedStatus))
        {
            status = parsedStatus;
        }

        var paymentStatus = Enums.PaymentStatus.Pending;
        if (!string.IsNullOrEmpty(dto.PaymentStatus) && Enum.TryParse<Enums.PaymentStatus>(dto.PaymentStatus, true, out var parsedPaymentStatus))
        {
            paymentStatus = parsedPaymentStatus;
        }

        return new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = orderNumber,
            TrackingId = trackingId,
            UserId = userId,
            SessionId = sessionId,
            CustomerFirstName = dto.Customer.FirstName,
            CustomerLastName = dto.Customer.LastName,
            CustomerEmail = dto.Customer.Email,
            CustomerPhone = dto.Customer.Phone,
            ShippingAddressId = dto.SavedAddressId,
            ShippingArea = dto.Address.Area,
            ShippingBlock = dto.Address.Block,
            ShippingStreet = dto.Address.Street,
            ShippingBuilding = dto.Address.Building,
            ShippingFloor = dto.Address.Floor,
            ShippingFlatOffice = dto.Address.FlatOffice,
            ShippingNotes = dto.Address.Notes,
            ShippingMethodId = dto.ShippingMethod.Id,
            ShippingMethodNameEn = dto.ShippingMethod.Name.En,
            ShippingMethodNameAr = dto.ShippingMethod.Name.Ar,
            ShippingEstimateEn = dto.ShippingMethod.Estimate.En,
            ShippingEstimateAr = dto.ShippingMethod.Estimate.Ar,
            Status = status,
            PaymentStatus = paymentStatus,
            PaymentMethod = paymentMethod,
            SubTotal = dto.Totals.Subtotal,
            DiscountAmount = dto.Totals.Discount,
            ShippingCost = dto.Totals.ShippingCost,
            TotalAmount = dto.Totals.Total,
            Currency = dto.Currency ?? "KWD",
            PromoCode = dto.PromoCode,
            CouponCodeId = dto.CouponCodeId,
            CreatedAt = DateTimeHelper.GetLocalTime()
        };
    }

    public static OrderItem ToEntity(this CreateOrderItemDto dto, Guid orderId)
    {
        return new OrderItem
        {
            Id = Guid.NewGuid(),
            OrderId = orderId,
            ProductId = dto.ProductId,
            ProductVariantId = dto.VariantId,
            ProductNameEnglish = dto.NameEn,
            ProductNameArabic = dto.NameAr,
            ProductImageUrl = dto.Image,
            ProductColor = dto.Color,
            ProductSize = dto.Size,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            TotalPrice = dto.UnitPrice * dto.Quantity
        };
    }

    private static string GetPaymentMethodNameEn(PaymentMethod method) => method switch
    {
        PaymentMethod.MyFatoorah => "MyFatoorah",
        PaymentMethod.CashOnDelivery => "Cash on Delivery",
        _ => "Unknown"
    };

    private static string GetPaymentMethodNameAr(PaymentMethod method) => method switch
    {
        PaymentMethod.MyFatoorah => "ماي فاتورة",
        PaymentMethod.CashOnDelivery => "الدفع عند الاستلام",
        _ => "غير معروف"
    };
}
