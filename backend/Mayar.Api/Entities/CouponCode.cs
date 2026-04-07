using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Mayar.Api.Enums;

namespace Mayar.Api.Entities;

public class CouponCode
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string NameEnglish { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string NameArabic { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? DescriptionEnglish { get; set; }

    [MaxLength(500)]
    public string? DescriptionArabic { get; set; }

    public DiscountType DiscountType { get; set; } = DiscountType.Percentage;

    [Column(TypeName = "decimal(18,3)")]
    public decimal DiscountValue { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? MaxDiscountCap { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal MinOrderAmount { get; set; } = 0;

    public int? UsageLimit { get; set; }

    public int? UsageLimitPerCustomer { get; set; }

    public int UsedCount { get; set; } = 0;

    public bool FirstOrderOnly { get; set; } = false;

    public CouponScope Scope { get; set; } = CouponScope.All;

    [MaxLength(1000)]
    public string? ScopeCategories { get; set; } // JSON array of category IDs

    [MaxLength(1000)]
    public string? ScopeProducts { get; set; } // JSON array of product IDs

    public CouponStatus Status { get; set; } = CouponStatus.Active;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool ShowInCartSuggestions { get; set; } = false;

    public int DisplayOrder { get; set; } = 1;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
