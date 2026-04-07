using System;

namespace Mayar.Api.Entities;

public class OrderItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public Guid? ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    public string? ProductNameEnglish { get; set; }
    public string? ProductNameArabic { get; set; }
    public string? ProductImageUrl { get; set; }
    public string? ProductSize { get; set; }
    public string? ProductColor { get; set; }
    public int? Quantity { get; set; }
    public decimal? UnitPrice { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? TotalPrice { get; set; }
}
