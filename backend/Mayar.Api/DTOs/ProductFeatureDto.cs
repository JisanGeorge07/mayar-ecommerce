using System;

namespace Mayar.Api.DTOs;

public class ProductFeatureDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }
    public string? IconName { get; set; }
    public bool IsActive { get; set; }
}
