using System;

namespace Mayar.Api.DTOs;

public class CartItemDetailDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductSlug { get; set; }
    public string? ProductNameEnglish { get; set; }
    public string? ProductNameArabic { get; set; }
    public string? BrandEnglish { get; set; }
    public string? BrandArabic { get; set; }
    public string? ImageUrl { get; set; }

    // Variant details
    public Guid? ProductVariantId { get; set; }
    public Guid? ProductColorId { get; set; }
    public string? ColorNameEnglish { get; set; }
    public string? ColorNameArabic { get; set; }
    public string? ColorHex { get; set; }
    public Guid? ProductSizeId { get; set; }
    public string? SizeLabel { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public decimal UnitPriceINR { get; set; }
    public decimal? CompareAtPriceINR { get; set; }

    // Real-time availability
    public bool InStock { get; set; }
    public int? MaxQuantity { get; set; }

    // Price validation
    public decimal CurrentPrice { get; set; }
    public decimal CurrentPriceINR { get; set; }
    public bool PriceChanged { get; set; }

    public DateTime UpdatedAt { get; set; }
}
