using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class BottomCategoryMapper
{
    public static BottomCategoryDto ToBottomCategoryDto(this BottomCategory bottomCategory)
    {
        return new BottomCategoryDto
        {
            Id = bottomCategory.Id,
            TopCategoryId = bottomCategory.TopCategoryId,
            MiddleCategoryId = bottomCategory.MiddleCategoryId,
            Slug = bottomCategory.Slug,
            TitleEnglish = bottomCategory.TitleEnglish,
            TitleArabic = bottomCategory.TitleArabic,
            IsActive = bottomCategory.IsActive,
            DisplayOrder = bottomCategory.DisplayOrder,
            Description = bottomCategory.Description,
            AttributeTemplate = bottomCategory.AttributeTemplate
        };
    }
    public static BottomCategory ToBottomCategoryEntity(this BottomCategoryDto bottomCategoryDto)
    {
        return new BottomCategory
        {
            Id = bottomCategoryDto.Id,
            TopCategoryId = bottomCategoryDto.TopCategoryId,
            MiddleCategoryId = bottomCategoryDto.MiddleCategoryId,
            Slug = bottomCategoryDto.Slug,
            TitleEnglish = bottomCategoryDto.TitleEnglish,
            TitleArabic = bottomCategoryDto.TitleArabic,
            DisplayOrder = bottomCategoryDto.DisplayOrder,
            IsActive = bottomCategoryDto.IsActive,
            Description = bottomCategoryDto.Description,
            AttributeTemplate = bottomCategoryDto.AttributeTemplate
        };
    }
}
