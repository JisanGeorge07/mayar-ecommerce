using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class MiddleCategoryMapper
{
    public static MiddleCategoryDto ToMiddleCategoryDto(this MiddleCategory middleCategory)
    {
        return new MiddleCategoryDto
        {
            Id = middleCategory.Id,
            TopCategoryId = middleCategory.TopCategoryId,
            Slug = middleCategory.Slug,
            TitleEnglish = middleCategory.TitleEnglish,
            TitleArabic = middleCategory.TitleArabic,
            SubtitleEnglish = middleCategory.SubtitleEnglish,
            SubtitleArabic = middleCategory.SubtitleArabic,
            ImageUrl = middleCategory.ImageUrl ?? string.Empty,
            ImageAlt = middleCategory.ImageAlt,
            ButtonTextEnglish = middleCategory.ButtonTextEnglish,
            ButtonTextArabic = middleCategory.ButtonTextArabic,
            ButtonLink = middleCategory.ButtonLink,
            IsActive = middleCategory.IsActive,
            DisplayOrder = middleCategory.DisplayOrder
        };
    }
    public static MiddleCategory ToMiddleCategoryEntity(this MiddleCategoryDto middleCategoryDto)
    {
        return new MiddleCategory
        {
            Id = middleCategoryDto.Id,
            TopCategoryId = middleCategoryDto.TopCategoryId,
            Slug = middleCategoryDto.Slug,
            TitleEnglish = middleCategoryDto.TitleEnglish,
            TitleArabic = middleCategoryDto.TitleArabic,
            SubtitleEnglish = middleCategoryDto.SubtitleEnglish,
            SubtitleArabic = middleCategoryDto.SubtitleArabic,
            ImageUrl = middleCategoryDto.ImageUrl ?? string.Empty,
            ImageAlt = middleCategoryDto.ImageAlt,
            ButtonTextEnglish = middleCategoryDto.ButtonTextEnglish,
            ButtonTextArabic = middleCategoryDto.ButtonTextArabic,
            ButtonLink = middleCategoryDto.ButtonLink,
            DisplayOrder = middleCategoryDto.DisplayOrder,
            IsActive = middleCategoryDto.IsActive
        };
    }
}
