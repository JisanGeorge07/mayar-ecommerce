using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class HeroSlideMapper
{
    public static HeroSlideDto ToHeroSlideDto(this HeroSlide entity)
    {
        return new HeroSlideDto
        {
            Id = entity.Id,
            BannerName = entity.BannerName,
            Slug = entity.Slug,
            LabelEnglish = entity.LabelEnglish,
            LabelArabic = entity.LabelArabic,
            TitleEnglish = entity.TitleEnglish,
            TitleArabic = entity.TitleArabic,
            DescriptionEnglish = entity.DescriptionEnglish,
            DescriptionArabic = entity.DescriptionArabic,
            CtaTextEnglish = entity.CtaTextEnglish,
            CtaTextArabic = entity.CtaTextArabic,
            CurrentPriceKWD = entity.CurrentPriceKWD,
            OldPriceKWD = entity.OldPriceKWD,
            CurrentPriceINR = entity.CurrentPriceINR,
            OldPriceINR = entity.OldPriceINR,
            LinkType = entity.LinkType,
            CategoryId = entity.CategoryId,
            SubcategoryId = entity.SubcategoryId,
            ProductTypeId = entity.ProductTypeId,
            ProductId = entity.ProductId,
            CustomUrl = entity.CustomUrl,
            // Populate slugs from navigation properties
            CategorySlug = entity.Category?.Slug,
            SubcategorySlug = entity.Subcategory?.Slug,
            ProductTypeSlug = entity.ProductType?.Slug,
            ProductSlug = entity.Product?.Slug,
            DesktopImageUrl = entity.DesktopImageUrl ?? string.Empty,
            MobileImageUrl = entity.MobileImageUrl ?? string.Empty,
            AltText = entity.AltText,
            SortOrder = entity.SortOrder,
            IsActive = entity.IsActive,
            IsPublished = entity.IsPublished,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static HeroSlide ToHeroSlideEntity(this HeroSlideDto dto)
    {
        return new HeroSlide
        {
            Id = dto.Id,
            BannerName = dto.BannerName,
            Slug = dto.Slug,
            LabelEnglish = dto.LabelEnglish,
            LabelArabic = dto.LabelArabic,
            TitleEnglish = dto.TitleEnglish,
            TitleArabic = dto.TitleArabic,
            DescriptionEnglish = dto.DescriptionEnglish,
            DescriptionArabic = dto.DescriptionArabic,
            CtaTextEnglish = dto.CtaTextEnglish,
            CtaTextArabic = dto.CtaTextArabic,
            CurrentPriceKWD = dto.CurrentPriceKWD,
            OldPriceKWD = dto.OldPriceKWD,
            CurrentPriceINR = dto.CurrentPriceINR,
            OldPriceINR = dto.OldPriceINR,
            LinkType = dto.LinkType,
            CategoryId = dto.CategoryId,
            SubcategoryId = dto.SubcategoryId,
            ProductTypeId = dto.ProductTypeId,
            ProductId = dto.ProductId,
            CustomUrl = dto.CustomUrl,
            DesktopImageUrl = dto.DesktopImageUrl,
            MobileImageUrl = dto.MobileImageUrl,
            AltText = dto.AltText,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            IsPublished = dto.IsPublished,
            CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
