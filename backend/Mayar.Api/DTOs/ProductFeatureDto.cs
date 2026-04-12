using System;

namespace Mayar.Api.DTOs;

public class ProductFeatureDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid TrustBadgeId { get; set; }
    public bool IsActive { get; set; }

    // Trust Badge details (populated from navigation property)
    public string? Key { get; set; }
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionArabic { get; set; }
    public string? IconName { get; set; }
}
