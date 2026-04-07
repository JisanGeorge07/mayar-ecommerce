using System;

namespace Mayar.Api.Entities;

public class FeatureSettings
{
    public Guid Id { get; set; }

    // Language Settings
    public bool EnableEnglish { get; set; } = true;
    public bool EnableArabic { get; set; } = true;

    // Currency Settings
    public bool EnableKwd { get; set; } = true;
    public bool EnableInr { get; set; } = true;

    // Feature Toggles
    public bool EnableWishlist { get; set; } = true;
    public bool EnableReviews { get; set; } = true;
    public bool EnableOrderTracking { get; set; } = false;
    public bool EnableNewsletter { get; set; } = false;
    public bool EnableMyAccount { get; set; } = true;
    public bool EnableGuestCheckout { get; set; } = true;

    // Brand Settings
    public string? BrandName { get; set; }
    public string? Tagline { get; set; }
    public string? LogoUrl { get; set; }

    // Default SEO
    public string? DefaultMetaTitle { get; set; }
    public string? DefaultMetaDescription { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
