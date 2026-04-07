using System;

namespace Mayar.Api.DTOs;

public class ProductSizeDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? Label { get; set; }
    public bool IsActive { get; set; }
}
