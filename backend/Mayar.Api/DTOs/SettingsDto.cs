using System;

namespace Mayar.Api.DTOs;

public class FeatureSettingsDto
{
    public Guid? Id { get; set; }

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
    public DateTime? UpdatedAt { get; set; }
}

public class CheckoutCountryDto
{
    public Guid? Id { get; set; }

    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;

    public bool IsEnabled { get; set; } = true;
    public bool IsDefault { get; set; } = false;
    public int SortOrder { get; set; } = 0;

    // Timestamps
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CheckoutAddressFieldDto
{
    public Guid? Id { get; set; }

    public Guid CountryId { get; set; }

    public string FieldKey { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string? FieldLabelArabic { get; set; }

    public bool IsVisible { get; set; } = true;
    public bool IsRequired { get; set; } = false;
    public int SortOrder { get; set; } = 0;

    // Timestamps
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateFeatureSettingsDto
{
    public bool? EnableEnglish { get; set; }
    public bool? EnableArabic { get; set; }
    public bool? EnableKwd { get; set; }
    public bool? EnableInr { get; set; }
    public bool? EnableWishlist { get; set; }
    public bool? EnableReviews { get; set; }
    public bool? EnableOrderTracking { get; set; }
    public bool? EnableNewsletter { get; set; }
    public bool? EnableMyAccount { get; set; }
    public bool? EnableGuestCheckout { get; set; }
    public string? BrandName { get; set; }
    public string? Tagline { get; set; }
    public string? LogoUrl { get; set; }
    public string? DefaultMetaTitle { get; set; }
    public string? DefaultMetaDescription { get; set; }
}

public class UpdateCheckoutCountryDto
{
    public string? CountryName { get; set; }
    public string? CountryCode { get; set; }
    public bool? IsEnabled { get; set; }
    public bool? IsDefault { get; set; }
    public int? SortOrder { get; set; }
}

public class UpdateCheckoutAddressFieldDto
{
    public string? FieldKey { get; set; }
    public string? FieldLabel { get; set; }
    public string? FieldLabelArabic { get; set; }
    public bool? IsVisible { get; set; }
    public bool? IsRequired { get; set; }
    public int? SortOrder { get; set; }
}

public class CreateCheckoutCountryDto
{
    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public bool IsDefault { get; set; } = false;
    public int SortOrder { get; set; } = 0;
}

public class CreateCheckoutAddressFieldDto
{
    public Guid CountryId { get; set; }
    public string FieldKey { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string? FieldLabelArabic { get; set; }
    public bool IsVisible { get; set; } = true;
    public bool IsRequired { get; set; } = false;
    public int SortOrder { get; set; } = 0;
}
