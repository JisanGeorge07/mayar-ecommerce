using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class PromoBannerService(AppDbContext context, ICloudinaryService cloudinaryService) : IPromoBannerService
{
    public async Task<List<PromoBannerDto>> GetAllAsync()
    {
        var promoBanners = await context.PromoBanners
            .OrderBy(p => p.SortOrder)
            .ToListAsync();
        return promoBanners.Select(p => p.ToPromoBannerDto()).ToList();
    }

    public async Task<List<PromoBannerDto>> GetActiveAsync()
    {
        var promoBanners = await context.PromoBanners
            .Where(p => p.IsActive && p.IsPublished)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();
        return promoBanners.Select(p => p.ToPromoBannerDto()).ToList();
    }

    public async Task<PromoBannerDto?> GetByIdAsync(Guid id)
    {
        var promoBanner = await context.PromoBanners.FindAsync(id);
        if (promoBanner == null)
        {
            return null;
        }
        return promoBanner.ToPromoBannerDto();
    }

    public async Task<PromoBannerDto> CreateAsync(PromoBannerDto dto)
    {
        // Upload desktop image if provided
        if (dto.DesktopImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.DesktopImageFile, "mayar-promo-banners");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.DesktopImageUrl = imageUrl;
            }
        }

        // Upload mobile image if provided
        if (dto.MobileImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.MobileImageFile, "mayar-promo-banners");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.MobileImageUrl = imageUrl;
            }
        }

        var promoBanner = dto.ToPromoBannerEntity();
        promoBanner.Id = Guid.NewGuid();
        promoBanner.CreatedAt = DateTimeHelper.GetLocalTime();
        promoBanner.UpdatedAt = DateTimeHelper.GetLocalTime();

        context.PromoBanners.Add(promoBanner);
        await context.SaveChangesAsync();

        return promoBanner.ToPromoBannerDto();
    }

    public async Task<PromoBannerDto?> UpdateAsync(Guid id, PromoBannerDto dto)
    {
        var existingPromoBanner = await context.PromoBanners.FindAsync(id);
        if (existingPromoBanner == null)
        {
            return null;
        }

        // Upload desktop image if provided
        if (dto.DesktopImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.DesktopImageFile, "mayar-promo-banners");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.DesktopImageUrl = imageUrl;
            }
        }

        // Upload mobile image if provided
        if (dto.MobileImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.MobileImageFile, "mayar-promo-banners");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.MobileImageUrl = imageUrl;
            }
        }

        // Update all fields
        existingPromoBanner.InternalName = dto.InternalName ?? existingPromoBanner.InternalName;
        existingPromoBanner.LayoutType = dto.LayoutType ?? existingPromoBanner.LayoutType;
        existingPromoBanner.LabelEnglish = dto.LabelEnglish;
        existingPromoBanner.LabelArabic = dto.LabelArabic;
        existingPromoBanner.TitleEnglish = dto.TitleEnglish;
        existingPromoBanner.TitleArabic = dto.TitleArabic;
        existingPromoBanner.CtaTextEnglish = dto.CtaTextEnglish;
        existingPromoBanner.CtaTextArabic = dto.CtaTextArabic;
        existingPromoBanner.AltText = dto.AltText;
        existingPromoBanner.LinkType = dto.LinkType ?? existingPromoBanner.LinkType;
        existingPromoBanner.CategoryId = dto.CategoryId;
        existingPromoBanner.SubcategoryId = dto.SubcategoryId;
        existingPromoBanner.ProductTypeId = dto.ProductTypeId;
        existingPromoBanner.ProductId = dto.ProductId;
        existingPromoBanner.CustomUrl = dto.CustomUrl;
        existingPromoBanner.SortOrder = dto.SortOrder;
        existingPromoBanner.IsActive = dto.IsActive;
        existingPromoBanner.IsPublished = dto.IsPublished;
        existingPromoBanner.UpdatedAt = DateTimeHelper.GetLocalTime();

        // Update images only if new ones provided
        if (!string.IsNullOrEmpty(dto.DesktopImageUrl))
        {
            existingPromoBanner.DesktopImageUrl = dto.DesktopImageUrl;
        }

        if (!string.IsNullOrEmpty(dto.MobileImageUrl))
        {
            existingPromoBanner.MobileImageUrl = dto.MobileImageUrl;
        }

        await context.SaveChangesAsync();

        return existingPromoBanner.ToPromoBannerDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingPromoBanner = await context.PromoBanners.FindAsync(id);
        if (existingPromoBanner == null)
        {
            return false;
        }

        context.PromoBanners.Remove(existingPromoBanner);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ReorderAsync(List<Guid> orderedIds)
    {
        for (int i = 0; i < orderedIds.Count; i++)
        {
            var banner = await context.PromoBanners.FindAsync(orderedIds[i]);
            if (banner != null)
            {
                banner.SortOrder = i + 1;
                banner.UpdatedAt = DateTimeHelper.GetLocalTime();
            }
        }

        await context.SaveChangesAsync();
        return true;
    }
}
