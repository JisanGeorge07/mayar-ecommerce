using System.Collections.Generic;

namespace Mayar.Api.DTOs;

public class CartSummaryDto
{
    public List<CartItemDetailDto> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int TotalQuantity { get; set; }
    public decimal Subtotal { get; set; }
    public bool HasPriceChanges { get; set; }
    public bool HasStockIssues { get; set; }
}
