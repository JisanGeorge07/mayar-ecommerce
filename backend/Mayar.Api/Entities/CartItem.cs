using System;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class CartItem
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid? UserId { get; set; }  // Null for guest carts
    public string? SessionId { get; set; }  // Guest identification

    // Variant tracking (nullable - not all products have variants)
    public Guid? ProductColorId { get; set; }
    public Guid? ProductSizeId { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }  // Price snapshot for validation

    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
    public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Product Product { get; set; } = null!;
    public User? User { get; set; }
    public ProductColor? ProductColor { get; set; }
    public ProductSize? ProductSize { get; set; }
}
