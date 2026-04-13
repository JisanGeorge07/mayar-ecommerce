using System;

namespace Mayar.Api.DTOs;

public class WishlistDto
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
    public string? ColorNameEnglish { get; set; }
    public string? ColorNameArabic { get; set; }
    public string? ColorHex { get; set; }
    public string? SizeLabel { get; set; }
    public decimal? PriceKWD { get; set; }
    public decimal? PriceINR { get; set; }
    public decimal? CompareAtPriceKWD { get; set; }
    public decimal? CompareAtPriceINR { get; set; }
    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }
}
