using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class PromoBannerMapper
{
    public static PromoBannerDto ToPromoBannerDto(this PromoBanner entity)
    {
        return new PromoBannerDto
        {
            Id = entity.Id,
            InternalName = entity.InternalName,
            LayoutType = entity.LayoutType,
            LabelEnglish = entity.LabelEnglish,
            LabelArabic = entity.LabelArabic,
            TitleEnglish = entity.TitleEnglish,
            TitleArabic = entity.TitleArabic,
            CtaTextEnglish = entity.CtaTextEnglish,
            CtaTextArabic = entity.CtaTextArabic,
            DesktopImageUrl = entity.DesktopImageUrl ?? string.Empty,
            MobileImageUrl = entity.MobileImageUrl ?? string.Empty,
            AltText = entity.AltText,
            LinkType = entity.LinkType,
            CategoryId = entity.CategoryId,
            SubcategoryId = entity.SubcategoryId,
            ProductTypeId = entity.ProductTypeId,
            ProductId = entity.ProductId,
            CustomUrl = entity.CustomUrl,
            SortOrder = entity.SortOrder,
            IsActive = entity.IsActive,
            IsPublished = entity.IsPublished,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static PromoBanner ToPromoBannerEntity(this PromoBannerDto dto)
    {
        return new PromoBanner
        {
            Id = dto.Id,
            InternalName = dto.InternalName,
            LayoutType = dto.LayoutType,
            LabelEnglish = dto.LabelEnglish,
            LabelArabic = dto.LabelArabic,
            TitleEnglish = dto.TitleEnglish,
            TitleArabic = dto.TitleArabic,
            CtaTextEnglish = dto.CtaTextEnglish,
            CtaTextArabic = dto.CtaTextArabic,
            DesktopImageUrl = dto.DesktopImageUrl ?? string.Empty,
            MobileImageUrl = dto.MobileImageUrl ?? string.Empty,
            AltText = dto.AltText,
            LinkType = dto.LinkType,
            CategoryId = dto.CategoryId,
            SubcategoryId = dto.SubcategoryId,
            ProductTypeId = dto.ProductTypeId,
            ProductId = dto.ProductId,
            CustomUrl = dto.CustomUrl,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            IsPublished = dto.IsPublished,
            CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
            UpdatedAt = dto.UpdatedAt ?? DateTime.UtcNow
        };
    }
}
