using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class SettingsService(AppDbContext context) : ISettingsService
{
    // Feature Settings
    public async Task<FeatureSettingsDto> GetSettingsAsync()
    {
        var settings = await context.FeatureSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            // Create default settings if none exist
            settings = new FeatureSettings
            {
                Id = Guid.NewGuid(),
                EnableEnglish = true,
                EnableArabic = true,
                EnableKwd = true,
                EnableInr = true,
                EnableWishlist = true,
                EnableReviews = true,
                EnableOrderTracking = false,
                EnableNewsletter = false,
                EnableMyAccount = true,
                EnableGuestCheckout = true,
                BrandName = "Mayar Shop",
                Tagline = "Premium E-commerce",
                DefaultMetaTitle = "Mayar Shop - Premium E-commerce",
                DefaultMetaDescription = "Shop premium products at Mayar Shop. Fashion, beauty, accessories, and more.",
                CreatedAt = DateTimeHelper.GetLocalTime(),
                UpdatedAt = DateTimeHelper.GetLocalTime()
            };
            context.FeatureSettings.Add(settings);
            await context.SaveChangesAsync();
        }
        return settings.ToDto();
    }

    public async Task<FeatureSettingsDto> UpdateSettingsAsync(UpdateFeatureSettingsDto dto)
    {
        var settings = await context.FeatureSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            // Create if not exists
            settings = new FeatureSettings
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTimeHelper.GetLocalTime()
            };
            context.FeatureSettings.Add(settings);
        }

        // Update only provided fields
        if (dto.EnableEnglish.HasValue) settings.EnableEnglish = dto.EnableEnglish.Value;
        if (dto.EnableArabic.HasValue) settings.EnableArabic = dto.EnableArabic.Value;
        if (dto.EnableKwd.HasValue) settings.EnableKwd = dto.EnableKwd.Value;
        if (dto.EnableInr.HasValue) settings.EnableInr = dto.EnableInr.Value;
        if (dto.EnableWishlist.HasValue) settings.EnableWishlist = dto.EnableWishlist.Value;
        if (dto.EnableReviews.HasValue) settings.EnableReviews = dto.EnableReviews.Value;
        if (dto.EnableOrderTracking.HasValue) settings.EnableOrderTracking = dto.EnableOrderTracking.Value;
        if (dto.EnableNewsletter.HasValue) settings.EnableNewsletter = dto.EnableNewsletter.Value;
        if (dto.EnableMyAccount.HasValue) settings.EnableMyAccount = dto.EnableMyAccount.Value;
        if (dto.EnableGuestCheckout.HasValue) settings.EnableGuestCheckout = dto.EnableGuestCheckout.Value;
        if (dto.BrandName != null) settings.BrandName = dto.BrandName;
        if (dto.Tagline != null) settings.Tagline = dto.Tagline;
        if (dto.LogoUrl != null) settings.LogoUrl = dto.LogoUrl;
        if (dto.DefaultMetaTitle != null) settings.DefaultMetaTitle = dto.DefaultMetaTitle;
        if (dto.DefaultMetaDescription != null) settings.DefaultMetaDescription = dto.DefaultMetaDescription;

        settings.UpdatedAt = DateTimeHelper.GetLocalTime();
        await context.SaveChangesAsync();

        return settings.ToDto();
    }

    // Checkout Countries
    public async Task<List<CheckoutCountryDto>> GetCountriesAsync()
    {
        var countries = await context.CheckoutCountries
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        // Seed default countries if none exist
        if (countries.Count == 0)
        {
            await SeedDefaultCountriesAsync();
            countries = await context.CheckoutCountries
                .OrderBy(c => c.SortOrder)
                .ToListAsync();
        }

        return countries.Select(c => c.ToDto()).ToList();
    }

    public async Task<CheckoutCountryDto?> GetCountryByIdAsync(Guid id)
    {
        var country = await context.CheckoutCountries.FindAsync(id);
        return country?.ToDto();
    }

    public async Task<CheckoutCountryDto> CreateCountryAsync(CreateCheckoutCountryDto dto)
    {
        var country = dto.ToEntity();

        // If this is marked as default, unset other defaults
        if (dto.IsDefault)
        {
            await context.CheckoutCountries
                .Where(c => c.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsDefault, false));
        }

        // Set sort order if not specified
        if (dto.SortOrder == 0)
        {
            var maxOrder = await context.CheckoutCountries.MaxAsync(c => (int?)c.SortOrder) ?? 0;
            country.SortOrder = maxOrder + 1;
        }

        context.CheckoutCountries.Add(country);
        await context.SaveChangesAsync();

        return country.ToDto();
    }

    public async Task<CheckoutCountryDto?> UpdateCountryAsync(Guid id, UpdateCheckoutCountryDto dto)
    {
        var country = await context.CheckoutCountries.FindAsync(id);
        if (country == null) return null;

        // If setting this as default, unset others
        if (dto.IsDefault == true)
        {
            await context.CheckoutCountries
                .Where(c => c.Id != id && c.IsDefault)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsDefault, false));
        }

        if (dto.CountryName != null) country.CountryName = dto.CountryName;
        if (dto.CountryCode != null) country.CountryCode = dto.CountryCode;
        if (dto.IsEnabled.HasValue) country.IsEnabled = dto.IsEnabled.Value;
        if (dto.IsDefault.HasValue) country.IsDefault = dto.IsDefault.Value;
        if (dto.SortOrder.HasValue) country.SortOrder = dto.SortOrder.Value;

        country.UpdatedAt = DateTimeHelper.GetLocalTime();
        await context.SaveChangesAsync();

        return country.ToDto();
    }

    public async Task<bool> DeleteCountryAsync(Guid id)
    {
        var country = await context.CheckoutCountries.FindAsync(id);
        if (country == null) return false;

        context.CheckoutCountries.Remove(country);
        await context.SaveChangesAsync();
        return true;
    }

    // Checkout Address Fields
    public async Task<List<CheckoutAddressFieldDto>> GetAddressFieldsAsync(Guid countryId)
    {
        var fields = await context.CheckoutAddressFields
            .Where(f => f.CountryId == countryId)
            .OrderBy(f => f.SortOrder)
            .ToListAsync();

        // Seed default fields if none exist for this country
        if (fields.Count == 0)
        {
            var country = await context.CheckoutCountries.FindAsync(countryId);
            if (country != null)
            {
                await SeedDefaultAddressFieldsAsync(country);
                fields = await context.CheckoutAddressFields
                    .Where(f => f.CountryId == countryId)
                    .OrderBy(f => f.SortOrder)
                    .ToListAsync();
            }
        }

        return fields.Select(f => f.ToDto()).ToList();
    }

    public async Task<CheckoutAddressFieldDto?> GetAddressFieldByIdAsync(Guid id)
    {
        var field = await context.CheckoutAddressFields.FindAsync(id);
        return field?.ToDto();
    }

    public async Task<CheckoutAddressFieldDto> CreateAddressFieldAsync(CreateCheckoutAddressFieldDto dto)
    {
        var field = dto.ToEntity();

        // Set sort order if not specified
        if (dto.SortOrder == 0)
        {
            var maxOrder = await context.CheckoutAddressFields
                .Where(f => f.CountryId == dto.CountryId)
                .MaxAsync(f => (int?)f.SortOrder) ?? 0;
            field.SortOrder = maxOrder + 1;
        }

        context.CheckoutAddressFields.Add(field);
        await context.SaveChangesAsync();

        return field.ToDto();
    }

    public async Task<CheckoutAddressFieldDto?> UpdateAddressFieldAsync(Guid id, UpdateCheckoutAddressFieldDto dto)
    {
        var field = await context.CheckoutAddressFields.FindAsync(id);
        if (field == null) return null;

        if (dto.FieldKey != null) field.FieldKey = dto.FieldKey;
        if (dto.FieldLabel != null) field.FieldLabel = dto.FieldLabel;
        if (dto.FieldLabelArabic != null) field.FieldLabelArabic = dto.FieldLabelArabic;
        if (dto.IsVisible.HasValue) field.IsVisible = dto.IsVisible.Value;
        if (dto.IsRequired.HasValue) field.IsRequired = dto.IsRequired.Value;
        if (dto.SortOrder.HasValue) field.SortOrder = dto.SortOrder.Value;

        field.UpdatedAt = DateTimeHelper.GetLocalTime();
        await context.SaveChangesAsync();

        return field.ToDto();
    }

    public async Task<bool> DeleteAddressFieldAsync(Guid id)
    {
        var field = await context.CheckoutAddressFields.FindAsync(id);
        if (field == null) return false;

        context.CheckoutAddressFields.Remove(field);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<Dictionary<string, string>> GetPageVisibilityAsync()
    {
        var visibility = new Dictionary<string, string>();

        var about = await context.About.Select(a => a.Status).FirstOrDefaultAsync();
        visibility["about"] = about ?? "draft";

        var contact = await context.Contact.Select(c => c.Status).FirstOrDefaultAsync();
        visibility["contact"] = contact ?? "draft";

        var contentPages = await context.ContentPages
            .Select(p => new { p.PageType, p.Status })
            .ToListAsync();

        foreach (var page in contentPages)
        {
            visibility[page.PageType] = page.Status;
        }

        return visibility;
    }

    // Seed Methods
    private async Task SeedDefaultCountriesAsync()
    {
        var kuwait = new CheckoutCountry
        {
            Id = Guid.NewGuid(),
            CountryName = "Kuwait",
            CountryCode = "KW",
            IsEnabled = true,
            IsDefault = true,
            SortOrder = 1,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };

        var india = new CheckoutCountry
        {
            Id = Guid.NewGuid(),
            CountryName = "India",
            CountryCode = "IN",
            IsEnabled = true,
            IsDefault = false,
            SortOrder = 2,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };

        context.CheckoutCountries.AddRange(kuwait, india);
        await context.SaveChangesAsync();

        // Seed address fields for both countries
        await SeedDefaultAddressFieldsAsync(kuwait);
        await SeedDefaultAddressFieldsAsync(india);
    }

    private async Task SeedDefaultAddressFieldsAsync(CheckoutCountry country)
    {
        var fields = new List<CheckoutAddressField>();

        if (country.CountryCode == "KW")
        {
            fields = new List<CheckoutAddressField>
            {
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "first_name", FieldLabel = "First Name", FieldLabelArabic = "الاسم الأول", IsVisible = true, IsRequired = true, SortOrder = 1 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "last_name", FieldLabel = "Last Name", FieldLabelArabic = "اسم العائلة", IsVisible = true, IsRequired = true, SortOrder = 2 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "email", FieldLabel = "Email", FieldLabelArabic = "البريد الإلكتروني", IsVisible = true, IsRequired = true, SortOrder = 3 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "phone", FieldLabel = "Phone", FieldLabelArabic = "رقم الهاتف", IsVisible = true, IsRequired = true, SortOrder = 4 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "area", FieldLabel = "Area", FieldLabelArabic = "المنطقة", IsVisible = true, IsRequired = true, SortOrder = 5 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "block", FieldLabel = "Block", FieldLabelArabic = "القطعة", IsVisible = true, IsRequired = true, SortOrder = 6 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "street", FieldLabel = "Street", FieldLabelArabic = "الشارع", IsVisible = true, IsRequired = true, SortOrder = 7 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "building", FieldLabel = "Building / House No", FieldLabelArabic = "رقم المبنى / المنزل", IsVisible = true, IsRequired = true, SortOrder = 8 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "floor", FieldLabel = "Floor", FieldLabelArabic = "الطابق", IsVisible = true, IsRequired = false, SortOrder = 9 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "flat", FieldLabel = "Flat / Apartment / Office", FieldLabelArabic = "الشقة / المكتب", IsVisible = true, IsRequired = false, SortOrder = 10 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "notes", FieldLabel = "Additional Notes", FieldLabelArabic = "ملاحظات إضافية", IsVisible = true, IsRequired = false, SortOrder = 11 }
            };
        }
        else if (country.CountryCode == "IN")
        {
            fields = new List<CheckoutAddressField>
            {
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "first_name", FieldLabel = "First Name", FieldLabelArabic = "الاسم الأول", IsVisible = true, IsRequired = true, SortOrder = 1 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "last_name", FieldLabel = "Last Name", FieldLabelArabic = "اسم العائلة", IsVisible = true, IsRequired = true, SortOrder = 2 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "email", FieldLabel = "Email", FieldLabelArabic = "البريد الإلكتروني", IsVisible = true, IsRequired = true, SortOrder = 3 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "phone", FieldLabel = "Phone", FieldLabelArabic = "رقم الهاتف", IsVisible = true, IsRequired = true, SortOrder = 4 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "state", FieldLabel = "State", FieldLabelArabic = "الولاية", IsVisible = true, IsRequired = true, SortOrder = 5 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "city", FieldLabel = "City", FieldLabelArabic = "المدينة", IsVisible = true, IsRequired = true, SortOrder = 6 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "street_address", FieldLabel = "Street / Address", FieldLabelArabic = "العنوان", IsVisible = true, IsRequired = true, SortOrder = 7 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "landmark", FieldLabel = "Landmark", FieldLabelArabic = "معلم قريب", IsVisible = true, IsRequired = false, SortOrder = 8 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "pincode", FieldLabel = "Pin Code", FieldLabelArabic = "الرمز البريدي", IsVisible = true, IsRequired = true, SortOrder = 9 },
                new() { Id = Guid.NewGuid(), CountryId = country.Id, FieldKey = "notes", FieldLabel = "Additional Notes", FieldLabelArabic = "ملاحظات إضافية", IsVisible = true, IsRequired = false, SortOrder = 10 }
            };
        }

        foreach (var field in fields)
        {
            field.CreatedAt = DateTimeHelper.GetLocalTime();
            field.UpdatedAt = DateTimeHelper.GetLocalTime();
        }

        context.CheckoutAddressFields.AddRange(fields);
        await context.SaveChangesAsync();
    }
}
