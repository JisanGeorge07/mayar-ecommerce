using System;

namespace Mayar.Api.DTOs;

public class HeroSlideDto
{
    public Guid Id { get; set; }

    // Internal name for admin identification
    public string? BannerName { get; set; }
    public string? Slug { get; set; }

    // Bilingual labels (small text above title)
    public string? LabelEnglish { get; set; }
    public string? LabelArabic { get; set; }

    // Bilingual titles
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }

    // Bilingual descriptions
    public string? DescriptionEnglish { get; set; }
    public string? DescriptionArabic { get; set; }

    // Bilingual CTA button text
    public string? CtaTextEnglish { get; set; }
    public string? CtaTextArabic { get; set; }

    // Multi-currency pricing - KWD
    public decimal? CurrentPriceKWD { get; set; }
    public decimal? OldPriceKWD { get; set; }

    // Multi-currency pricing - INR
    public decimal? CurrentPriceINR { get; set; }
    public decimal? OldPriceINR { get; set; }

    // Link targeting
    public string? LinkType { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public Guid? ProductTypeId { get; set; }
    public Guid? ProductId { get; set; }
    public string? CustomUrl { get; set; }

    // Slugs for URL building (read-only, populated from related entities)
    public string? CategorySlug { get; set; }
    public string? SubcategorySlug { get; set; }
    public string? ProductTypeSlug { get; set; }
    public string? ProductSlug { get; set; }

    // Media - responsive images
    public IFormFile? DesktopImageFile { get; set; }
    public IFormFile? MobileImageFile { get; set; }
    public string? DesktopImageUrl { get; set; }
    public string? MobileImageUrl { get; set; }
    public string? AltText { get; set; }

    // Admin controls
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public bool IsPublished { get; set; }

    // Timestamps (read-only in responses)
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ReorderHeroSlidesDto
{
    public List<Guid> OrderedIds { get; set; } = new();
}
