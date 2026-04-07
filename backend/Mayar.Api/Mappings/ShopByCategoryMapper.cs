using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class ShopByCategoryMapper
{
    public static ShopByCategoryDto ToDto(this ShopByCategory entity)
    {
        return new ShopByCategoryDto
        {
            Id = entity.Id,
            InternalName = entity.InternalName,
            TitleEnglish = entity.TitleEnglish,
            TitleArabic = entity.TitleArabic,
            ImageUrl = entity.ImageUrl,
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

    public static ShopByCategory ToEntity(this ShopByCategoryDto dto)
    {
        return new ShopByCategory
        {
            Id = dto.Id,
            InternalName = dto.InternalName,
            TitleEnglish = dto.TitleEnglish,
            TitleArabic = dto.TitleArabic,
            ImageUrl = dto.ImageUrl ?? string.Empty,
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
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt
        };
    }
}
