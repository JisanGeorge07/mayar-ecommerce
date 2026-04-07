using System;

namespace Mayar.Api.DTOs;

public class TopCategoryDto
{
    public Guid Id { get; set; }
    public string? Slug { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public string? BadgeEnglish { get; set; }
    public string? BadgeArabic { get; set; }
    public bool IsActive { get; set; }
    public long? DisplayOrder { get; set; }
}
