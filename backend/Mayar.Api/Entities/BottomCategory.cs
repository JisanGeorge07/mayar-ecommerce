using System;

namespace Mayar.Api.Entities;

public class BottomCategory
{
    public Guid Id { get; set; }
    public Guid TopCategoryId { get; set; }
    public Guid MiddleCategoryId { get; set; }
    public string? Slug { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public bool IsActive { get; set; } = true;
    public long? DisplayOrder { get; set; }

    // Navigation property
    public MiddleCategory? MiddleCategory { get; set; }
}
