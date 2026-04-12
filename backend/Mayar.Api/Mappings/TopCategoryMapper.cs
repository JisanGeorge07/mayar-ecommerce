using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class TopCategoryMapper
{
    public static TopCategoryDto ToTopCategoryDto(this TopCategory topCategory)
    {
        return new TopCategoryDto
        {
            Id = topCategory.Id,
            Slug = topCategory.Slug,
            ImageUrl = topCategory.ImageUrl ?? string.Empty,
            ImageAlt = topCategory.ImageAlt,
            TitleEnglish = topCategory.TitleEnglish,
            TitleArabic = topCategory.TitleArabic,
            BadgeEnglish = topCategory.BadgeEnglish,
            BadgeArabic = topCategory.BadgeArabic,
            IsActive = topCategory.IsActive,
            DisplayOrder = topCategory.DisplayOrder
        };
    }

    public static TopCategory ToTopCategoryEntity(this TopCategoryDto topCategoryDto)
    {
        return new TopCategory
        {
            Id = topCategoryDto.Id,
            Slug = topCategoryDto.Slug,
            ImageUrl = topCategoryDto.ImageUrl ?? string.Empty,
            ImageAlt = topCategoryDto.ImageAlt,
            TitleEnglish = topCategoryDto.TitleEnglish,
            TitleArabic = topCategoryDto.TitleArabic,
            BadgeEnglish = topCategoryDto.BadgeEnglish,
            BadgeArabic = topCategoryDto.BadgeArabic,
            DisplayOrder=topCategoryDto.DisplayOrder,
            IsActive = topCategoryDto.IsActive
        };
    }
}
