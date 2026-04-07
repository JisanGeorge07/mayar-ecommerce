using System;
using System.Collections.Generic;

namespace Mayar.Api.DTOs;

public class ContentPageDto
{
    public Guid Id { get; set; }
    public string PageType { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string IntroEn { get; set; } = string.Empty;
    public string IntroAr { get; set; } = string.Empty;
    public string? HeroBgColor { get; set; }

    // Contact section
    public string? ContactTitleEn { get; set; }
    public string? ContactTitleAr { get; set; }
    public string? ContactNoteEn { get; set; }
    public string? ContactNoteAr { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }

    // SEO fields
    public string? MetaTitleEn { get; set; }
    public string? MetaTitleAr { get; set; }
    public string? MetaDescriptionEn { get; set; }
    public string? MetaDescriptionAr { get; set; }

    // Policy dates
    public DateTime? EffectiveDate { get; set; }
    public DateTime? LastRevisedDate { get; set; }

    // Status: "draft" or "published"
    public string Status { get; set; } = "published";

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public List<ContentSectionDto> Sections { get; set; } = new();
}