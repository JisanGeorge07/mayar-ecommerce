using System;

namespace Mayar.Api.DTOs;

public class AddToCartRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductColorId { get; set; }
    public Guid? ProductSizeId { get; set; }
    public int Quantity { get; set; } = 1;
    public Guid? UserId { get; set; }
    public string? SessionId { get; set; }
}

public class UpdateCartItemRequest
{
    public int Quantity { get; set; }
}

public class MergeCartRequest
{
    public Guid UserId { get; set; }
    public string SessionId { get; set; } = string.Empty;
}
