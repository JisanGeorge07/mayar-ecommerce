using System;
using System.Collections.Generic;
using Mayar.Api.Helpers;

namespace Mayar.Api.DTOs;

public class AboutParagraphDto
{
    public Guid Id { get; set; }
    public string ContentEnglish { get; set; } = string.Empty;
    public string ContentArabic { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class AboutContactItemDto
{
    public Guid Id { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string LabelEnglish { get; set; } = string.Empty;
    public string LabelArabic { get; set; } = string.Empty;
    public string ActionType { get; set; } = "none";
    public string ActionValue { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class AboutDto
{
    public Guid? Id { get; set; }

    // Hero Banner Header
    public string HeroTitleEnglish { get; set; } = string.Empty;
    public string HeroTitleArabic { get; set; } = string.Empty;
    public string HeroSubtitleEnglish { get; set; } = string.Empty;
    public string HeroSubtitleArabic { get; set; } = string.Empty;
    public string HeroBgColor { get; set; } = "#1B2A4A";

    // Who We Are Section
    public string WhoWeAreTitleEnglish { get; set; } = string.Empty;
    public string WhoWeAreTitleArabic { get; set; } = string.Empty;
    public List<AboutParagraphDto> Paragraphs { get; set; } = new();

    // Vision
    public string VisionTitleEnglish { get; set; } = string.Empty;
    public string VisionTitleArabic { get; set; } = string.Empty;
    public string VisionDescriptionEnglish { get; set; } = string.Empty;
    public string VisionDescriptionArabic { get; set; } = string.Empty;
    public string VisionIcon { get; set; } = "Eye";

    // Mission
    public string MissionTitleEnglish { get; set; } = string.Empty;
    public string MissionTitleArabic { get; set; } = string.Empty;
    public string MissionDescriptionEnglish { get; set; } = string.Empty;
    public string MissionDescriptionArabic { get; set; } = string.Empty;
    public string MissionIcon { get; set; } = "Target";

    // Contact Items
    public List<AboutContactItemDto> ContactItems { get; set; } = new();

    // SEO
    public string MetaTitleEnglish { get; set; } = string.Empty;
    public string MetaTitleArabic { get; set; } = string.Empty;
    public string MetaDescriptionEnglish { get; set; } = string.Empty;
    public string MetaDescriptionArabic { get; set; } = string.Empty;

    // Settings
    public string Status { get; set; } = "draft";
    public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
