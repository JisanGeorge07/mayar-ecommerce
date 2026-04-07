using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mayar.Api.Entities;

public class ShopByCategory
{
    public Guid Id { get; set; }

    // Internal name for admin identification
    public string InternalName { get; set; } = string.Empty;

    // Bilingual titles
    public string TitleEnglish { get; set; } = string.Empty;
    public string? TitleArabic { get; set; }

    // Image
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }

    // Link targeting
    public string LinkType { get; set; } = "category"; // category, subcategory, product_type, product, custom_url
    public Guid? CategoryId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public Guid? ProductTypeId { get; set; }
    public Guid? ProductId { get; set; }
    public string? CustomUrl { get; set; }

    // Navigation properties for related entities
    public TopCategory? Category { get; set; }
    public MiddleCategory? Subcategory { get; set; }
    public BottomCategory? ProductType { get; set; }
    public Product? Product { get; set; }

    // Admin controls
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool IsPublished { get; set; } = false;

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
