using System;
using Mayar.Api.Helpers;

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
    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
    public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
