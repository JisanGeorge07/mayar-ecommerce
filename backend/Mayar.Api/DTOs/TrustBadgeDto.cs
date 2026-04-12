using System;

namespace Mayar.Api.DTOs;

public class TrustBadgeDto
{
    public Guid Id { get; set; }
    public string? Key { get; set; }
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionArabic { get; set; }
    public string? IconName { get; set; }
}
