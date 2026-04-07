using System;
using System.Collections.Generic;

namespace Mayar.Api.Entities;

public class CheckoutCountry
{
    public Guid Id { get; set; }

    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;

    public bool IsEnabled { get; set; } = true;
    public bool IsDefault { get; set; } = false;
    public int SortOrder { get; set; } = 0;

    // Navigation property
    public ICollection<CheckoutAddressField> AddressFields { get; set; } = new List<CheckoutAddressField>();

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
