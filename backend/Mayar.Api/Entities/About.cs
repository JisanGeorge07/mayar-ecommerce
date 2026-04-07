using System;
using System.Collections.Generic;

namespace Mayar.Api.Entities;

public class About
{
    public Guid Id { get; set; }

    // Hero Banner Header
    public string HeroTitleEnglish { get; set; } = string.Empty;
    public string HeroTitleArabic { get; set; } = string.Empty;
    public string HeroSubtitleEnglish { get; set; } = string.Empty;
    public string HeroSubtitleArabic { get; set; } = string.Empty;
    public string HeroBgColor { get; set; } = "#1B2A4A";

    // Who We Are Section
    public string WhoWeAreTitleEnglish { get; set; } = string.Empty;
    public string WhoWeAreTitleArabic { get; set; } = string.Empty;

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

    // SEO
    public string MetaTitleEnglish { get; set; } = string.Empty;
    public string MetaTitleArabic { get; set; } = string.Empty;
    public string MetaDescriptionEnglish { get; set; } = string.Empty;
    public string MetaDescriptionArabic { get; set; } = string.Empty;

    // Settings
    public string Status { get; set; } = "draft"; // published, draft
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<AboutParagraph> Paragraphs { get; set; } = new List<AboutParagraph>();
    public ICollection<AboutContactItem> ContactItems { get; set; } = new List<AboutContactItem>();
}
