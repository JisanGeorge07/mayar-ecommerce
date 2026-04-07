using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mayar.Api.Entities;

public class Product
{
    public Guid Id { get; set; }
    public Guid TopCategoryId { get; set; }
    public Guid? MiddleCategoryId { get; set; }
    public Guid? BottomCategoryId { get; set; }
    public string? Slug { get; set; }
    public string? BrandEnglish { get; set; }
    public string? BrandArabic { get; set; }
    public string? NameEnglish { get; set; }
    public string? NameArabic { get; set; }
    public string? ShortDescriptionEnglish { get; set; }
    public string? ShortDescriptionArabic { get; set; }
    public string? FullDescriptionEnglish { get; set; }
    public string? FullDescriptionArabic { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? BasePriceKWD { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal? CompareAtPriceKWD { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? BasePriceINR { get; set; }

    [Column(TypeName = "decimal(18,0)")]
    public decimal? CompareAtPriceINR { get; set; }

    [Column(TypeName = "decimal(18,1)")]
    public decimal? Rating { get; set; }
    public int? ReviewCount { get; set; }

    public bool IsNew { get; set; }
    public bool? IsBestSeller { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsOnSale { get; set; }
    public bool InStock { get; set; } = true;

    public string? ShippingInfoEnglish { get; set; }
    public string? ShippingInfoArabic { get; set; }
    public string? ReturnInfoEnglish { get; set; }
    public string? ReturnInfoArabic { get; set; }

    public List<ProductImage> Images { get; set; } = [];
    public List<ProductColor> Colors { get; set; } = [];
    public List<ProductSize> Sizes { get; set; } = [];
    public List<ProductVariant> Variants { get; set; } = [];
    public List<ProductFeature> Features { get; set; } = [];
    public List<ProductSpecification> Specifications { get; set; } = [];
    public List<ProductCareInstruction> CareInstructions { get; set; } = [];
    public bool IsActive { get; set; } = true;
    public string? Status { get; set; }


    //Metadata
    public string? MetaTitle { get; set; }
    public string? CanonicalUrl { get; set; }
    public string? MetaKeywords { get; set; }
    public string? MetaDescription { get; set; }
    public string? OGTitle { get; set; }
    public string? OGDescription { get; set; }
    public string? OGImageUrl { get; set; }
    public string? TwitterTitle { get; set; }
    public string? TwitterDescription { get; set; }
}
