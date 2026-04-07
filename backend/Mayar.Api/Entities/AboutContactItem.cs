using System;

namespace Mayar.Api.Entities;

public class AboutContactItem
{
    public Guid Id { get; set; }
    public Guid AboutId { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string LabelEnglish { get; set; } = string.Empty;
    public string LabelArabic { get; set; } = string.Empty;
    public string ActionType { get; set; } = "none"; // none, phone, email, link, map
    public string ActionValue { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    // Navigation property
    public About About { get; set; } = null!;
}
