using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Helpers;

namespace Mayar.Api.Mappings;

public static class SettingsMapper
{
    // FeatureSettings Mappings
    public static FeatureSettingsDto ToDto(this FeatureSettings entity)
    {
        return new FeatureSettingsDto
        {
            Id = entity.Id,
            EnableEnglish = entity.EnableEnglish,
            EnableArabic = entity.EnableArabic,
            EnableKwd = entity.EnableKwd,
            EnableInr = entity.EnableInr,
            EnableWishlist = entity.EnableWishlist,
            EnableReviews = entity.EnableReviews,
            EnableOrderTracking = entity.EnableOrderTracking,
            EnableNewsletter = entity.EnableNewsletter,
            EnableMyAccount = entity.EnableMyAccount,
            EnableGuestCheckout = entity.EnableGuestCheckout,
            BrandName = entity.BrandName,
            Tagline = entity.Tagline,
            LogoUrl = entity.LogoUrl,
            DefaultMetaTitle = entity.DefaultMetaTitle,
            DefaultMetaDescription = entity.DefaultMetaDescription,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static FeatureSettings ToEntity(this FeatureSettingsDto dto)
    {
        return new FeatureSettings
        {
            Id = dto.Id ?? Guid.NewGuid(),
            EnableEnglish = dto.EnableEnglish,
            EnableArabic = dto.EnableArabic,
            EnableKwd = dto.EnableKwd,
            EnableInr = dto.EnableInr,
            EnableWishlist = dto.EnableWishlist,
            EnableReviews = dto.EnableReviews,
            EnableOrderTracking = dto.EnableOrderTracking,
            EnableNewsletter = dto.EnableNewsletter,
            EnableMyAccount = dto.EnableMyAccount,
            EnableGuestCheckout = dto.EnableGuestCheckout,
            BrandName = dto.BrandName,
            Tagline = dto.Tagline,
            LogoUrl = dto.LogoUrl,
            DefaultMetaTitle = dto.DefaultMetaTitle,
            DefaultMetaDescription = dto.DefaultMetaDescription,
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };
    }

    // CheckoutCountry Mappings
    public static CheckoutCountryDto ToDto(this CheckoutCountry entity)
    {
        return new CheckoutCountryDto
        {
            Id = entity.Id,
            CountryName = entity.CountryName,
            CountryCode = entity.CountryCode,
            IsEnabled = entity.IsEnabled,
            IsDefault = entity.IsDefault,
            SortOrder = entity.SortOrder,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static CheckoutCountry ToEntity(this CheckoutCountryDto dto)
    {
        return new CheckoutCountry
        {
            Id = dto.Id ?? Guid.NewGuid(),
            CountryName = dto.CountryName,
            CountryCode = dto.CountryCode,
            IsEnabled = dto.IsEnabled,
            IsDefault = dto.IsDefault,
            SortOrder = dto.SortOrder,
            CreatedAt = dto.CreatedAt ?? DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };
    }

    public static CheckoutCountry ToEntity(this CreateCheckoutCountryDto dto)
    {
        return new CheckoutCountry
        {
            Id = Guid.NewGuid(),
            CountryName = dto.CountryName,
            CountryCode = dto.CountryCode,
            IsEnabled = dto.IsEnabled,
            IsDefault = dto.IsDefault,
            SortOrder = dto.SortOrder,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };
    }

    // CheckoutAddressField Mappings
    public static CheckoutAddressFieldDto ToDto(this CheckoutAddressField entity)
    {
        return new CheckoutAddressFieldDto
        {
            Id = entity.Id,
            CountryId = entity.CountryId,
            FieldKey = entity.FieldKey,
            FieldLabel = entity.FieldLabel,
            FieldLabelArabic = entity.FieldLabelArabic,
            IsVisible = entity.IsVisible,
            IsRequired = entity.IsRequired,
            SortOrder = entity.SortOrder,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static CheckoutAddressField ToEntity(this CheckoutAddressFieldDto dto)
    {
        return new CheckoutAddressField
        {
            Id = dto.Id ?? Guid.NewGuid(),
            CountryId = dto.CountryId,
            FieldKey = dto.FieldKey,
            FieldLabel = dto.FieldLabel,
            FieldLabelArabic = dto.FieldLabelArabic,
            IsVisible = dto.IsVisible,
            IsRequired = dto.IsRequired,
            SortOrder = dto.SortOrder,
            CreatedAt = dto.CreatedAt ?? DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };
    }

    public static CheckoutAddressField ToEntity(this CreateCheckoutAddressFieldDto dto)
    {
        return new CheckoutAddressField
        {
            Id = Guid.NewGuid(),
            CountryId = dto.CountryId,
            FieldKey = dto.FieldKey,
            FieldLabel = dto.FieldLabel,
            FieldLabelArabic = dto.FieldLabelArabic,
            IsVisible = dto.IsVisible,
            IsRequired = dto.IsRequired,
            SortOrder = dto.SortOrder,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };
    }
}
