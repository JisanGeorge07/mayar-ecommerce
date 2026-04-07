using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class ContentSectionMapper
{
    public static ContentSectionDto ToContentSectionDto(this ContentSection entity)
    {
        return new ContentSectionDto
        {
            Id = entity.Id,
            ContentPageId = entity.ContentPageId,
            TitleEn = entity.TitleEn,
            TitleAr = entity.TitleAr,
            BodyEn = entity.BodyEn,
            BodyAr = entity.BodyAr,
            DisplayOrder = entity.DisplayOrder,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt
        };
    }

    public static ContentSection ToContentSectionEntity(this ContentSectionDto dto)
    {
        return new ContentSection
        {
            Id = dto.Id,
            ContentPageId = dto.ContentPageId,
            TitleEn = dto.TitleEn,
            TitleAr = dto.TitleAr,
            BodyEn = dto.BodyEn,
            BodyAr = dto.BodyAr,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            CreatedAt = dto.CreatedAt
        };
    }
}