using System;
using Mayar.Api.Enums;

namespace Mayar.Api.DTOs;

public class CouponCodeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string NameEnglish { get; set; } = string.Empty;
    public string NameArabic { get; set; } = string.Empty;
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionArabic { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MaxDiscountCap { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int? UsageLimit { get; set; }
    public int? UsageLimitPerCustomer { get; set; }
    public int UsedCount { get; set; }
    public bool FirstOrderOnly { get; set; }
    public CouponScope Scope { get; set; }
    public List<string>? ScopeCategories { get; set; }
    public List<string>? ScopeProducts { get; set; }
    public CouponStatus Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool ShowInCartSuggestions { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CouponValidationRequest
{
    public string Code { get; set; } = string.Empty;
    public decimal CartTotal { get; set; }
    public Guid? CustomerId { get; set; }
}

public class CouponValidationResponse
{
    public bool Valid { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? CouponCodeId { get; set; }
    public DiscountType? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }
    public decimal? MaxCap { get; set; }
    public decimal? CalculatedDiscount { get; set; }
}
