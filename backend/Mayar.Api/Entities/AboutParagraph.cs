using System;

namespace Mayar.Api.Entities;

public class AboutParagraph
{
    public Guid Id { get; set; }
    public Guid AboutId { get; set; }
    public string ContentEnglish { get; set; } = string.Empty;
    public string ContentArabic { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    // Navigation property
    public About About { get; set; } = null!;
}
