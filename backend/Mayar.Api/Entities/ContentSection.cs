using System;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class ContentSection
{
    public Guid Id { get; set; }
    public Guid ContentPageId { get; set; }
    public string TitleEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string BodyEn { get; set; } = string.Empty;
    public string BodyAr { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();

    // Navigation property
    public ContentPage ContentPage { get; set; } = null!;
}