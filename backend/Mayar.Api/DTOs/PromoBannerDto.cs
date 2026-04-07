using System;

namespace Mayar.Api.DTOs;

public class PromoBannerDto
{
    public Guid Id { get; set; }

    // Admin identification
    public string InternalName { get; set; } = string.Empty;

    // Layout type: "small" or "large"
    public string LayoutType { get; set; } = "small";

    // Label/Eyebrow text (bilingual)
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }

    // Main title (bilingual)
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }

    // CTA/Button text (bilingual)
    public string? CtaTextEnglish { get; set; }
    public string? CtaTextArabic { get; set; }

    // Media - File uploads and URLs
    public IFormFile? DesktopImageFile { get; set; }
    public IFormFile? MobileImageFile { get; set; }
    public string? DesktopImageUrl { get; set; }
    public string? MobileImageUrl { get; set; }
    public string? AltText { get; set; }

    // Link configuration
    public string LinkType { get; set; } = "category"; // category, subcategory, product_type, product, custom_url
    public Guid? CategoryId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public Guid? ProductTypeId { get; set; }
    public Guid? ProductId { get; set; }
    public string? CustomUrl { get; set; }

    // Ordering and status
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool IsPublished { get; set; } = false;

    // Timestamps (read-only for response)
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
