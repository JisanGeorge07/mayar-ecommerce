using System;

namespace Mayar.Api.Entities;

public class CheckoutAddressField
{
    public Guid Id { get; set; }

    public Guid CountryId { get; set; }

    public string FieldKey { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string? FieldLabelArabic { get; set; }

    public bool IsVisible { get; set; } = true;
    public bool IsRequired { get; set; } = false;
    public int SortOrder { get; set; } = 0;

    // Navigation property
    public CheckoutCountry? Country { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
