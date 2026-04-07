using System;

namespace Mayar.Api.DTOs;

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid ProductColorId { get; set; }
    public Guid ProductSizeId { get; set; }

    public decimal? BasePriceKWD { get; set; }
    public decimal? CompareAtPriceKWD { get; set; }
    public decimal? BasePriceINR { get; set; }
    public decimal? CompareAtPriceINR { get; set; }

    public int? StockQuantity { get; set; }
    public bool InStock { get; set; }
    public bool IsDefault { get; set; }

    // Nested objects for easier frontend consumption
    public ProductColorDto? Color { get; set; }
    public ProductSizeDto? Size { get; set; }
}
