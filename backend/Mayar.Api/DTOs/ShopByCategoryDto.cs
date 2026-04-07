using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mayar.Api.DTOs;

public class ShopByCategoryDto
{
    public Guid Id { get; set; }

    [Required]
    [StringLength(200)]
    public string InternalName { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string TitleEnglish { get; set; } = string.Empty;

    [StringLength(200)]
    public string? TitleArabic { get; set; }

    public string? ImageUrl { get; set; }

    [StringLength(200)]
    public string? AltText { get; set; }

    public IFormFile? ImageFile { get; set; }

    [Required]
    public string LinkType { get; set; } = "category";

    public Guid? CategoryId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public Guid? ProductTypeId { get; set; }
    public Guid? ProductId { get; set; }

    [StringLength(500)]
    public string? CustomUrl { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool IsPublished { get; set; } = false;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ReorderShopByCategoryDto
{
    public List<Guid> OrderedIds { get; set; } = new();
}
