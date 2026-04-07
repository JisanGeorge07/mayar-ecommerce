using System;


namespace Mayar.Api.DTOs;

public class ProductImageDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public bool IsActive { get; set; }
    public bool IsPrimary { get; set; }
}
