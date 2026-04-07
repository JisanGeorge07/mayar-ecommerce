using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mayar.Api.Entities;

public class ProductVariant
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    [ForeignKey(nameof(ProductId))]
    public Product Product { get; set; } = null!;

    public Guid ProductColorId { get; set; }
    public ProductColor ProductColor { get; set; } = null!;

    public Guid ProductSizeId { get; set; }
    public ProductSize ProductSize { get; set; } = null!;

    [Column(TypeName = "decimal(18,3)")]
    public decimal? BasePriceKWD { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? CompareAtPriceKWD { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? BasePriceINR { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? CompareAtPriceINR { get; set; }

    public int? StockQuantity { get; set; }
    public bool InStock { get; set; } = true;
    public bool IsDefault { get; set; }
}
