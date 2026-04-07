using System;


namespace Mayar.Api.Entities;

public class ProductImage
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsPrimary { get; set; }
}
