using System;

namespace Mayar.Api.Entities;

public class ShippingInfo
{
    public Guid Id { get; set; }
    public string? TitleEnglish { get; set; }
    public string? TitleArabic { get; set; }
    public string? IntroEnglish { get; set; }
    public string? IntroArabic { get; set; }
    public string? SectionsJson { get; set; } // JSON array of sections [{titleEn, titleAr, bodyEn, bodyAr}]
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
