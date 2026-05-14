using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class HeroSlideService(AppDbContext context, ICloudinaryService cloudinaryService) : IHeroSlideService
{
    public async Task<List<HeroSlideDto>> GetAllAsync()
    {
        var heroSlides = await context.HeroSlides
            .Include(h => h.Category)
            .Include(h => h.Subcategory)
            .Include(h => h.ProductType)
            .Include(h => h.Product)
            .OrderBy(h => h.SortOrder)
            .ToListAsync();
        return heroSlides.Select(h => h.ToHeroSlideDto()).ToList();
    }

    public async Task<List<HeroSlideDto>> GetActivePublishedAsync()
    {
        var heroSlides = await context.HeroSlides
            .Include(h => h.Category)
            .Include(h => h.Subcategory)
            .Include(h => h.ProductType)
            .Include(h => h.Product)
            .Where(h => h.IsActive && h.IsPublished)
            .OrderBy(h => h.SortOrder)
            .ToListAsync();
        return heroSlides.Select(h => h.ToHeroSlideDto()).ToList();
    }

    public async Task<HeroSlideDto?> GetByIdAsync(Guid id)
    {
        var heroSlide = await context.HeroSlides
            .Include(h => h.Category)
            .Include(h => h.Subcategory)
            .Include(h => h.ProductType)
            .Include(h => h.Product)
            .FirstOrDefaultAsync(h => h.Id == id);
        if (heroSlide == null)
        {
            return null;
        }
        return heroSlide.ToHeroSlideDto();
    }

    public async Task<HeroSlideDto> CreateAsync(HeroSlideDto heroSlideDto)
    {
        // Upload desktop image if provided
        if (heroSlideDto.DesktopImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(heroSlideDto.DesktopImageFile, "mayar-hero-slides");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                heroSlideDto.DesktopImageUrl = imageUrl;
            }
        }

        // Upload mobile image if provided
        if (heroSlideDto.MobileImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(heroSlideDto.MobileImageFile, "mayar-hero-slides-mobile");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                heroSlideDto.MobileImageUrl = imageUrl;
            }
        }

        // Set sort order to be last if not specified
        if (heroSlideDto.SortOrder == 0)
        {
            var maxOrder = await context.HeroSlides.MaxAsync(h => (int?)h.SortOrder) ?? 0;
            heroSlideDto.SortOrder = maxOrder + 1;
        }

        var heroSlide = heroSlideDto.ToHeroSlideEntity();
        heroSlide.CreatedAt = DateTimeHelper.GetLocalTime();
        heroSlide.UpdatedAt = DateTimeHelper.GetLocalTime();

        context.HeroSlides.Add(heroSlide);
        await context.SaveChangesAsync();
        return heroSlide.ToHeroSlideDto();
    }

    public async Task<HeroSlideDto?> UpdateAsync(Guid id, HeroSlideDto heroSlideDto)
    {
        var existingHeroSlide = await context.HeroSlides.FindAsync(id);
        if (existingHeroSlide == null)
        {
            return null;
        }

        // Upload desktop image if provided
        if (heroSlideDto.DesktopImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(heroSlideDto.DesktopImageFile, "mayar-hero-slides");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                heroSlideDto.DesktopImageUrl = imageUrl;
            }
        }

        // Upload mobile image if provided
        if (heroSlideDto.MobileImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(heroSlideDto.MobileImageFile, "mayar-hero-slides-mobile");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                heroSlideDto.MobileImageUrl = imageUrl;
            }
        }

        // Update all fields
        existingHeroSlide.BannerName = heroSlideDto.BannerName;
        existingHeroSlide.Slug = heroSlideDto.Slug;
        existingHeroSlide.LabelEnglish = heroSlideDto.LabelEnglish;
        existingHeroSlide.LabelArabic = heroSlideDto.LabelArabic;
        existingHeroSlide.TitleEnglish = heroSlideDto.TitleEnglish;
        existingHeroSlide.TitleArabic = heroSlideDto.TitleArabic;
        existingHeroSlide.DescriptionEnglish = heroSlideDto.DescriptionEnglish;
        existingHeroSlide.DescriptionArabic = heroSlideDto.DescriptionArabic;
        existingHeroSlide.CtaTextEnglish = heroSlideDto.CtaTextEnglish;
        existingHeroSlide.CtaTextArabic = heroSlideDto.CtaTextArabic;
        existingHeroSlide.CurrentPriceKWD = heroSlideDto.CurrentPriceKWD;
        existingHeroSlide.OldPriceKWD = heroSlideDto.OldPriceKWD;
        existingHeroSlide.CurrentPriceINR = heroSlideDto.CurrentPriceINR;
        existingHeroSlide.OldPriceINR = heroSlideDto.OldPriceINR;
        existingHeroSlide.LinkType = heroSlideDto.LinkType;
        existingHeroSlide.CategoryId = heroSlideDto.CategoryId;
        existingHeroSlide.SubcategoryId = heroSlideDto.SubcategoryId;
        existingHeroSlide.ProductTypeId = heroSlideDto.ProductTypeId;
        existingHeroSlide.ProductId = heroSlideDto.ProductId;
        existingHeroSlide.CustomUrl = heroSlideDto.CustomUrl;
        existingHeroSlide.AltText = heroSlideDto.AltText;
        existingHeroSlide.SortOrder = heroSlideDto.SortOrder;
        existingHeroSlide.IsActive = heroSlideDto.IsActive;
        existingHeroSlide.IsPublished = heroSlideDto.IsPublished;
        existingHeroSlide.UpdatedAt = DateTimeHelper.GetLocalTime();

        // Update images only if new URLs are provided
        if (!string.IsNullOrEmpty(heroSlideDto.DesktopImageUrl))
        {
            existingHeroSlide.DesktopImageUrl = heroSlideDto.DesktopImageUrl;
        }

        if (!string.IsNullOrEmpty(heroSlideDto.MobileImageUrl))
        {
            existingHeroSlide.MobileImageUrl = heroSlideDto.MobileImageUrl;
        }

        await context.SaveChangesAsync();
        return existingHeroSlide.ToHeroSlideDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingHeroSlide = await context.HeroSlides.FindAsync(id);
        if (existingHeroSlide == null)
        {
            return false;
        }

        context.HeroSlides.Remove(existingHeroSlide);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ReorderAsync(List<Guid> orderedIds)
    {
        var heroSlides = await context.HeroSlides
            .Where(h => orderedIds.Contains(h.Id))
            .ToListAsync();

        if (heroSlides.Count != orderedIds.Count)
        {
            return false;
        }

        for (int i = 0; i < orderedIds.Count; i++)
        {
            var slide = heroSlides.FirstOrDefault(h => h.Id == orderedIds[i]);
            if (slide != null)
            {
                slide.SortOrder = i + 1;
                slide.UpdatedAt = DateTimeHelper.GetLocalTime();
            }
        }

        await context.SaveChangesAsync();
        return true;
    }
}
