using System;

namespace Mayar.Api.DTOs;

public class ProductDto
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
    public decimal? BasePriceKWD { get; set; }
    public decimal? CompareAtPriceKWD { get; set; }
    public decimal? BasePriceINR { get; set; }
    public decimal? CompareAtPriceINR { get; set; }
    public decimal? Rating { get; set; }
    public int? ReviewCount { get; set; }

    public bool IsNew { get; set; }
    // public string? DiscountPercentage { get; set; }

    public bool? IsBestSeller { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsOnSale { get; set; }
    public bool InStock { get; set; } = true;

    public string? ShippingInfoEnglish { get; set; }
    public string? ShippingInfoArabic { get; set; }
    public string? ReturnInfoEnglish { get; set; }
    public string? ReturnInfoArabic { get; set; }

    public List<ProductImageDto> Images { get; set; } = [];
    public List<ProductColorDto> Colors { get; set; } = [];
    public List<ProductSizeDto> Sizes { get; set; } = [];
    public List<ProductVariantDto> Variants { get; set; } = [];
    public List<ProductFeatureDto> Features { get; set; } = [];
    public List<ProductSpecificationDto> Specifications { get; set; } = [];
    public List<ProductCareInstructionDto> CareInstructions { get; set; } = [];
    public bool IsActive { get; set; }
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
