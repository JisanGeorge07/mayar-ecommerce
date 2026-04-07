using System;

namespace Mayar.Api.DTOs;

public class BottomCategoryDto
{
    public Guid Id { get; set; }
    public Guid TopCategoryId { get; set; }
    public Guid MiddleCategoryId { get; set; }
    public string? Slug { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public bool IsActive { get; set; }
    public long? DisplayOrder { get; set; }
}
