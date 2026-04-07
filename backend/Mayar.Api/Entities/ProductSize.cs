using System;

namespace Mayar.Api.Entities;

public class ProductSize
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string? Label { get; set; }
    public bool IsActive { get; set; } = true;
}