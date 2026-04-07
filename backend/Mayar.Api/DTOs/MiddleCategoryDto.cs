using System;

namespace Mayar.Api.DTOs;

public class MiddleCategoryDto
{
    public Guid Id { get; set; }
    public Guid TopCategoryId { get; set; }
    public string? Slug { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public string? SubtitleEnglish { get; set; }
    public string? SubtitleArabic { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }
    public string? ButtonTextEnglish { get; set; }
    public string? ButtonTextArabic { get; set; }
    public string? ButtonLink { get; set; }
    public bool IsActive { get; set; }
    public long? DisplayOrder { get; set; }
}
