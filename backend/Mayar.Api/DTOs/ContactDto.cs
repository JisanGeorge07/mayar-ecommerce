using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Mayar.Api.DTOs;

public class ContactCardDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("icon")]
    public string Icon { get; set; } = string.Empty;

    [JsonPropertyName("label_en")]
    public string LabelEn { get; set; } = string.Empty;

    [JsonPropertyName("label_ar")]
    public string LabelAr { get; set; } = string.Empty;

    [JsonPropertyName("value_en")]
    public string ValueEn { get; set; } = string.Empty;

    [JsonPropertyName("value_ar")]
    public string ValueAr { get; set; } = string.Empty;

    [JsonPropertyName("sort_order")]
    public int SortOrder { get; set; }
}

public class ContactDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    // Hero Banner
    [JsonPropertyName("hero_heading_en")]
    public string HeroHeadingEn { get; set; } = string.Empty;

    [JsonPropertyName("hero_heading_ar")]
    public string HeroHeadingAr { get; set; } = string.Empty;

    [JsonPropertyName("hero_subheading_en")]
    public string HeroSubheadingEn { get; set; } = string.Empty;

    [JsonPropertyName("hero_subheading_ar")]
    public string HeroSubheadingAr { get; set; } = string.Empty;

    [JsonPropertyName("hero_bg_color")]
    public string HeroBgColor { get; set; } = "#0f172a";

    // Contact Cards
    [JsonPropertyName("contact_cards")]
    public List<ContactCardDto> ContactCards { get; set; } = new();

    // Map Settings
    [JsonPropertyName("show_map")]
    public bool ShowMap { get; set; } = true;

    [JsonPropertyName("map_height")]
    public int MapHeight { get; set; } = 400;

    [JsonPropertyName("map_embed_url")]
    public string MapEmbedUrl { get; set; } = string.Empty;

    // SEO
    [JsonPropertyName("meta_title_en")]
    public string MetaTitleEn { get; set; } = string.Empty;

    [JsonPropertyName("meta_title_ar")]
    public string MetaTitleAr { get; set; } = string.Empty;

    [JsonPropertyName("meta_description_en")]
    public string MetaDescriptionEn { get; set; } = string.Empty;

    [JsonPropertyName("meta_description_ar")]
    public string MetaDescriptionAr { get; set; } = string.Empty;

    // Page Settings
    [JsonPropertyName("status")]
    public string Status { get; set; } = "draft";

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
