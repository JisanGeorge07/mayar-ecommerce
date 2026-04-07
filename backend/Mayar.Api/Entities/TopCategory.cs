using System;
using System.Collections.Generic;

namespace Mayar.Api.Entities;

public class TopCategory
{
    public Guid Id { get; set; }
    public string? Slug { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public string? BadgeEnglish { get; set; }
    public string? BadgeArabic { get; set; }
    public bool IsActive { get; set; } = true;
    public long? DisplayOrder { get; set; }

    // Navigation property
    public ICollection<MiddleCategory> MiddleCategories { get; set; } = new List<MiddleCategory>();
}
