using System;
using System.Linq;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class AboutMapper
{
    public static AboutParagraphDto ToDto(this AboutParagraph paragraph)
    {
        return new AboutParagraphDto
        {
            Id = paragraph.Id,
            ContentEnglish = paragraph.ContentEnglish,
            ContentArabic = paragraph.ContentArabic,
            SortOrder = paragraph.SortOrder
        };
    }

    public static AboutParagraph ToEntity(this AboutParagraphDto dto, Guid aboutId)
    {
        return new AboutParagraph
        {
            Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
            AboutId = aboutId,
            ContentEnglish = dto.ContentEnglish ?? string.Empty,
            ContentArabic = dto.ContentArabic ?? string.Empty,
            SortOrder = dto.SortOrder
        };
    }

    public static AboutContactItemDto ToDto(this AboutContactItem contactItem)
    {
        return new AboutContactItemDto
        {
            Id = contactItem.Id,
            Icon = contactItem.Icon,
            LabelEnglish = contactItem.LabelEnglish,
            LabelArabic = contactItem.LabelArabic,
            ActionType = contactItem.ActionType,
            ActionValue = contactItem.ActionValue,
            SortOrder = contactItem.SortOrder
        };
    }

    public static AboutContactItem ToEntity(this AboutContactItemDto dto, Guid aboutId)
    {
        return new AboutContactItem
        {
            Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
            AboutId = aboutId,
            Icon = dto.Icon ?? string.Empty,
            LabelEnglish = dto.LabelEnglish ?? string.Empty,
            LabelArabic = dto.LabelArabic ?? string.Empty,
            ActionType = dto.ActionType ?? "none",
            ActionValue = dto.ActionValue ?? string.Empty,
            SortOrder = dto.SortOrder
        };
    }

    public static AboutDto ToAboutDto(this About about)
    {
        return new AboutDto
        {
            Id = about.Id,
            // Hero
            HeroTitleEnglish = about.HeroTitleEnglish,
            HeroTitleArabic = about.HeroTitleArabic,
            HeroSubtitleEnglish = about.HeroSubtitleEnglish,
            HeroSubtitleArabic = about.HeroSubtitleArabic,
            HeroBgColor = about.HeroBgColor,
            // Who We Are
            WhoWeAreTitleEnglish = about.WhoWeAreTitleEnglish,
            WhoWeAreTitleArabic = about.WhoWeAreTitleArabic,
            Paragraphs = about.Paragraphs?.OrderBy(p => p.SortOrder).Select(p => p.ToDto()).ToList() ?? new(),
            // Vision
            VisionTitleEnglish = about.VisionTitleEnglish,
            VisionTitleArabic = about.VisionTitleArabic,
            VisionDescriptionEnglish = about.VisionDescriptionEnglish,
            VisionDescriptionArabic = about.VisionDescriptionArabic,
            VisionIcon = about.VisionIcon,
            // Mission
            MissionTitleEnglish = about.MissionTitleEnglish,
            MissionTitleArabic = about.MissionTitleArabic,
            MissionDescriptionEnglish = about.MissionDescriptionEnglish,
            MissionDescriptionArabic = about.MissionDescriptionArabic,
            MissionIcon = about.MissionIcon,
            // Contact
            ContactItems = about.ContactItems?.OrderBy(c => c.SortOrder).Select(c => c.ToDto()).ToList() ?? new(),
            // SEO
            MetaTitleEnglish = about.MetaTitleEnglish,
            MetaTitleArabic = about.MetaTitleArabic,
            MetaDescriptionEnglish = about.MetaDescriptionEnglish,
            MetaDescriptionArabic = about.MetaDescriptionArabic,
            // Settings
            Status = about.Status,
            UpdatedAt = about.UpdatedAt
        };
    }

    public static About ToAboutEntity(this AboutDto aboutDto)
    {
        var about = new About
        {
            Id = aboutDto.Id == null || aboutDto.Id == Guid.Empty ? Guid.NewGuid() : aboutDto.Id.Value,
            // Hero
            HeroTitleEnglish = aboutDto.HeroTitleEnglish ?? string.Empty,
            HeroTitleArabic = aboutDto.HeroTitleArabic ?? string.Empty,
            HeroSubtitleEnglish = aboutDto.HeroSubtitleEnglish ?? string.Empty,
            HeroSubtitleArabic = aboutDto.HeroSubtitleArabic ?? string.Empty,
            HeroBgColor = aboutDto.HeroBgColor ?? "#1B2A4A",
            // Who We Are
            WhoWeAreTitleEnglish = aboutDto.WhoWeAreTitleEnglish ?? string.Empty,
            WhoWeAreTitleArabic = aboutDto.WhoWeAreTitleArabic ?? string.Empty,
            // Vision
            VisionTitleEnglish = aboutDto.VisionTitleEnglish ?? string.Empty,
            VisionTitleArabic = aboutDto.VisionTitleArabic ?? string.Empty,
            VisionDescriptionEnglish = aboutDto.VisionDescriptionEnglish ?? string.Empty,
            VisionDescriptionArabic = aboutDto.VisionDescriptionArabic ?? string.Empty,
            VisionIcon = aboutDto.VisionIcon ?? "Eye",
            // Mission
            MissionTitleEnglish = aboutDto.MissionTitleEnglish ?? string.Empty,
            MissionTitleArabic = aboutDto.MissionTitleArabic ?? string.Empty,
            MissionDescriptionEnglish = aboutDto.MissionDescriptionEnglish ?? string.Empty,
            MissionDescriptionArabic = aboutDto.MissionDescriptionArabic ?? string.Empty,
            MissionIcon = aboutDto.MissionIcon ?? "Target",
            // SEO
            MetaTitleEnglish = aboutDto.MetaTitleEnglish ?? string.Empty,
            MetaTitleArabic = aboutDto.MetaTitleArabic ?? string.Empty,
            MetaDescriptionEnglish = aboutDto.MetaDescriptionEnglish ?? string.Empty,
            MetaDescriptionArabic = aboutDto.MetaDescriptionArabic ?? string.Empty,
            // Settings
            Status = aboutDto.Status ?? "draft",
            UpdatedAt = DateTime.UtcNow
        };

        return about;
    }
}
