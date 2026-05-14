using System;
using System.ComponentModel.DataAnnotations.Schema;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class Wishlist
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }

    // Product details
    public string? ProductNameEnglish { get; set; }
    public string? ProductNameArabic { get; set; }
    public string? Brand { get; set; }
    public string? ProductSlug { get; set; }

    // Variant specific details
    public Guid? ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }

    // Stored variant details for performance
    public string? ColorNameEnglish { get; set; }
    public string? ColorNameArabic { get; set; }
    public string? ColorHex { get; set; }
    public string? SizeLabel { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? PriceKWD { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? PriceINR { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? CompareAtPriceKWD { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? CompareAtPriceINR { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
