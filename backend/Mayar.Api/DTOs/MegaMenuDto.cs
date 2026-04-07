using System;
using System.Collections.Generic;

namespace Mayar.Api.DTOs;

public class TranslatedTextDto
{
    public string? En { get; set; }
    public string? Ar { get; set; }
}

public class MegaMenuLinkDto
{
    public string Id { get; set; } = string.Empty;
    public TranslatedTextDto Label { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
}

public class MegaMenuSectionDto
{
    public string Id { get; set; } = string.Empty;
    public TranslatedTextDto Title { get; set; } = new();
    public List<MegaMenuLinkDto> Links { get; set; } = new();
}

public class NavMenuItemDto
{
    public string Id { get; set; } = string.Empty;
    public TranslatedTextDto Label { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public string Type { get; set; } = "link"; // "link" or "mega"
    public TranslatedTextDto? Badge { get; set; }
    public List<MegaMenuSectionDto>? Sections { get; set; }
    public string? FeaturedImage { get; set; }
    public TranslatedTextDto? FeaturedTitle { get; set; }
    public TranslatedTextDto? FeaturedCta { get; set; }
}
