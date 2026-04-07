using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mayar.Api.Entities;

public class HeroSlide
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
    [Column(TypeName = "decimal(18,3)")]
    public decimal? CurrentPriceKWD { get; set; }
    [Column(TypeName = "decimal(18,3)")]
    public decimal? OldPriceKWD { get; set; }

    // Multi-currency pricing - INR
    [Column(TypeName = "decimal(18,2)")]
    public decimal? CurrentPriceINR { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal? OldPriceINR { get; set; }

    // Link targeting
    public string? LinkType { get; set; } // category, subcategory, product_type, product, custom_url
    public Guid? CategoryId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public Guid? ProductTypeId { get; set; }
    public Guid? ProductId { get; set; }
    public string? CustomUrl { get; set; }

    // Navigation properties for related entities
    public TopCategory? Category { get; set; }
    public MiddleCategory? Subcategory { get; set; }
    public BottomCategory? ProductType { get; set; }
    public Product? Product { get; set; }

    // Media - responsive images
    public string? DesktopImageUrl { get; set; }
    public string? MobileImageUrl { get; set; }
    public string? AltText { get; set; }

    // Admin controls
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool IsPublished { get; set; } = false;

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
