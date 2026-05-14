using System;
using System.Collections.Generic;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class Contact
{
    public Guid Id { get; set; }

    // Hero Banner
    public string HeroHeadingEn { get; set; } = string.Empty;
    public string HeroHeadingAr { get; set; } = string.Empty;
    public string HeroSubheadingEn { get; set; } = string.Empty;
    public string HeroSubheadingAr { get; set; } = string.Empty;
    public string HeroBgColor { get; set; } = "#0f172a";

    // Map Settings
    public bool ShowMap { get; set; } = true;
    public int MapHeight { get; set; } = 400;
    public string MapEmbedUrl { get; set; } = string.Empty;

    // SEO
    public string MetaTitleEn { get; set; } = string.Empty;
    public string MetaTitleAr { get; set; } = string.Empty;
    public string MetaDescriptionEn { get; set; } = string.Empty;
    public string MetaDescriptionAr { get; set; } = string.Empty;

    // Page Settings
    public string Status { get; set; } = "draft"; // "draft" or "published"
    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
    public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();

    // Navigation property for contact cards
    public ICollection<ContactCard> ContactCards { get; set; } = new List<ContactCard>();
}
