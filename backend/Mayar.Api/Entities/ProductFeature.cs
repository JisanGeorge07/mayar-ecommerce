using System;

namespace Mayar.Api.Entities;

public class ProductFeature
{
    public Guid Id { get; set;}
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }
    public string? IconName { get; set; }
    public bool IsActive { get; set; } = true;
}
