using System;
using System.Linq;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class ContentPageMapper
{
    public static ContentPageDto ToContentPageDto(this ContentPage entity)
    {
        return new ContentPageDto
        {
            Id = entity.Id,
            PageType = entity.PageType,
            TitleEn = entity.TitleEn,
            TitleAr = entity.TitleAr,
            IntroEn = entity.IntroEn,
            IntroAr = entity.IntroAr,
            HeroBgColor = entity.HeroBgColor,
            ContactTitleEn = entity.ContactTitleEn,
            ContactTitleAr = entity.ContactTitleAr,
            ContactNoteEn = entity.ContactNoteEn,
            ContactNoteAr = entity.ContactNoteAr,
            ContactEmail = entity.ContactEmail,
            ContactPhone = entity.ContactPhone,
            MetaTitleEn = entity.MetaTitleEn,
            MetaTitleAr = entity.MetaTitleAr,
            MetaDescriptionEn = entity.MetaDescriptionEn,
            MetaDescriptionAr = entity.MetaDescriptionAr,
            EffectiveDate = entity.EffectiveDate,
            LastRevisedDate = entity.LastRevisedDate,
            Status = entity.Status,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsActive = entity.IsActive,
            Sections = entity.Sections?.Select(s => s.ToContentSectionDto()).ToList() ?? new List<ContentSectionDto>()
        };
    }

    public static ContentPage ToContentPageEntity(this ContentPageDto dto)
    {
        return new ContentPage
        {
            Id = dto.Id,
            PageType = dto.PageType,
            TitleEn = dto.TitleEn,
            TitleAr = dto.TitleAr,
            IntroEn = dto.IntroEn,
            IntroAr = dto.IntroAr,
            HeroBgColor = dto.HeroBgColor,
            ContactTitleEn = dto.ContactTitleEn,
            ContactTitleAr = dto.ContactTitleAr,
            ContactNoteEn = dto.ContactNoteEn,
            ContactNoteAr = dto.ContactNoteAr,
            ContactEmail = dto.ContactEmail,
            ContactPhone = dto.ContactPhone,
            MetaTitleEn = dto.MetaTitleEn,
            MetaTitleAr = dto.MetaTitleAr,
            MetaDescriptionEn = dto.MetaDescriptionEn,
            MetaDescriptionAr = dto.MetaDescriptionAr,
            EffectiveDate = dto.EffectiveDate,
            LastRevisedDate = dto.LastRevisedDate,
            Status = dto.Status,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt,
            IsActive = dto.IsActive
        };
    }
}