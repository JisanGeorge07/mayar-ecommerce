using System;
using System.Collections.Generic;

namespace Mayar.Api.Entities;

public class MiddleCategory
{
    public Guid Id { get; set; }
    public Guid TopCategoryId { get; set; }
    public string? Slug { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public string? SubtitleEnglish { get; set; }
    public string? SubtitleArabic { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? ButtonTextEnglish { get; set; }
    public string? ButtonTextArabic { get; set; }
    public string? ButtonLink { get; set; }
    public bool IsActive { get; set; } = true;
    public long? DisplayOrder { get; set; }

    // Navigation properties
    public TopCategory? TopCategory { get; set; }
    public ICollection<BottomCategory> BottomCategories { get; set; } = new List<BottomCategory>();
}
