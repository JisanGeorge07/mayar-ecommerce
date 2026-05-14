using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface ISettingsService
{
    // Feature Settings
    Task<FeatureSettingsDto> GetSettingsAsync();
    Task<FeatureSettingsDto> UpdateSettingsAsync(UpdateFeatureSettingsDto dto);

    // Checkout Countries
    Task<List<CheckoutCountryDto>> GetCountriesAsync();
    Task<CheckoutCountryDto?> GetCountryByIdAsync(Guid id);
    Task<CheckoutCountryDto> CreateCountryAsync(CreateCheckoutCountryDto dto);
    Task<CheckoutCountryDto?> UpdateCountryAsync(Guid id, UpdateCheckoutCountryDto dto);
    Task<bool> DeleteCountryAsync(Guid id);

    // Checkout Address Fields
    Task<List<CheckoutAddressFieldDto>> GetAddressFieldsAsync(Guid countryId);
    Task<CheckoutAddressFieldDto?> GetAddressFieldByIdAsync(Guid id);
    Task<CheckoutAddressFieldDto> CreateAddressFieldAsync(CreateCheckoutAddressFieldDto dto);
    Task<CheckoutAddressFieldDto?> UpdateAddressFieldAsync(Guid id, UpdateCheckoutAddressFieldDto dto);
    Task<bool> DeleteAddressFieldAsync(Guid id);

    // Page Visibility
    Task<Dictionary<string, string>> GetPageVisibilityAsync();
}
