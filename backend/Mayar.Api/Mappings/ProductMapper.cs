using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class ProductMapper
{
    public static ProductDto ToProductDto(this Product entity)
    {
        return new ProductDto
        {
            Id = entity.Id,
            TopCategoryId = entity.TopCategoryId,
            MiddleCategoryId = entity.MiddleCategoryId,
            BottomCategoryId = entity.BottomCategoryId,
            Slug = entity.Slug,
            BrandEnglish = entity.BrandEnglish,
            BrandArabic = entity.BrandArabic,
            NameEnglish = entity.NameEnglish,
            NameArabic = entity.NameArabic,
            ShortDescriptionEnglish = entity.ShortDescriptionEnglish,
            ShortDescriptionArabic = entity.ShortDescriptionArabic,
            FullDescriptionEnglish = entity.FullDescriptionEnglish,
            FullDescriptionArabic = entity.FullDescriptionArabic,
            BasePriceINR = entity.BasePriceINR,
            CompareAtPriceINR = entity.CompareAtPriceINR,
            BasePriceKWD = entity.BasePriceKWD,
            CompareAtPriceKWD = entity.CompareAtPriceKWD,
            Rating = entity.Rating,
            ReviewCount = entity.ReviewCount,
            IsNew = entity.IsNew,
            IsBestSeller = entity.IsBestSeller,
            IsFeatured = entity.IsFeatured,
            IsOnSale = entity.IsOnSale,
            InStock = entity.InStock,
            ShippingInfoEnglish = entity.ShippingInfoEnglish,
            ShippingInfoArabic = entity.ShippingInfoArabic,
            ReturnInfoEnglish = entity.ReturnInfoEnglish,
            ReturnInfoArabic = entity.ReturnInfoArabic,
            Images = entity.Images.OrderByDescending(i => i.IsPrimary).ThenBy(i => i.Id).Select(i => i.ToProductImageDto()).ToList(),
            Colors = entity.Colors.Select(c => c.ToProductColorDto()).ToList(),
            Sizes = entity.Sizes.Select(s => s.ToProductSizeDto()).ToList(),
            Variants = entity.Variants.OrderByDescending(v => v.IsDefault).ThenBy(v => v.ProductColor.NameEnglish).ThenBy(v => v.ProductSize.Label).Select(v => v.ToProductVariantDto()).ToList(),
            Features = entity.Features.Select(f => f.ToProductFeatureDto()).ToList(),
            Specifications = entity.Specifications.Select(s => s.ToProductSpecificationDto()).ToList(),
            CareInstructions = entity.CareInstructions.Select(c => c.ToProductCareInstructionDto()).ToList(),
            IsActive = entity.IsActive,
            Status = entity.Status,
            MetaTitle = entity.MetaTitle,
            MetaDescription = entity.MetaDescription,
            MetaKeywords = entity.MetaKeywords,
            CanonicalUrl = entity.CanonicalUrl,
            OGTitle = entity.MetaTitle,
            OGDescription = entity.MetaDescription,
            OGImageUrl = entity.OGImageUrl,
            TwitterTitle = entity.TwitterTitle,
            TwitterDescription = entity.TwitterDescription,
        };
    }

    public static Product ToProductEntity(this ProductDto dto)
    {
        return new Product
        {
            Id = dto.Id,
            TopCategoryId = dto.TopCategoryId,
            MiddleCategoryId = dto.MiddleCategoryId,
            BottomCategoryId = dto.BottomCategoryId,
            Slug = dto.Slug,
            BrandEnglish = dto.BrandEnglish,
            BrandArabic = dto.BrandArabic,
            NameEnglish = dto.NameEnglish,
            NameArabic = dto.NameArabic,
            ShortDescriptionEnglish = dto.ShortDescriptionEnglish,
            ShortDescriptionArabic = dto.ShortDescriptionArabic,
            FullDescriptionEnglish = dto.FullDescriptionEnglish,
            FullDescriptionArabic = dto.FullDescriptionArabic,
            BasePriceINR = dto.BasePriceINR,
            CompareAtPriceINR = dto.CompareAtPriceINR,
            BasePriceKWD = dto.BasePriceKWD,
            CompareAtPriceKWD = dto.CompareAtPriceKWD,
            Rating = dto.Rating,
            ReviewCount = dto.ReviewCount,
            IsNew = dto.IsNew,
            IsBestSeller = dto.IsBestSeller,
            IsFeatured = dto.IsFeatured,
            IsOnSale = dto.IsOnSale,
            InStock = dto.InStock,
            ShippingInfoEnglish = dto.ShippingInfoEnglish,
            ShippingInfoArabic = dto.ShippingInfoArabic,
            ReturnInfoEnglish = dto.ReturnInfoEnglish,
            ReturnInfoArabic = dto.ReturnInfoArabic,
            Status = dto.Status,
            MetaTitle = dto.MetaTitle,
            MetaDescription = dto.MetaDescription,
            MetaKeywords = dto.MetaKeywords,
            CanonicalUrl = dto.CanonicalUrl,
            OGTitle = dto.MetaTitle,
            OGDescription = dto.MetaDescription,
            OGImageUrl = dto.OGImageUrl,
            TwitterTitle = dto.TwitterTitle,
            TwitterDescription = dto.TwitterDescription,
        };
    }

    public static ProductImageDto ToProductImageDto(this ProductImage entity)
    {
        return new ProductImageDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            ImageUrl = entity.ImageUrl,
            ImageAlt = entity.ImageAlt,
            IsActive = entity.IsActive,
            IsPrimary = entity.IsPrimary
        };
    }

    public static ProductImage ToProductImageEntity(this ProductImageDto dto)
    {
        return new ProductImage
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            ImageUrl = dto.ImageUrl,
            ImageAlt = dto.ImageAlt,
            IsPrimary = dto.IsPrimary
        };
    }

    public static ProductColorDto ToProductColorDto(this ProductColor entity)
    {
        return new ProductColorDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            NameEnglish = entity.NameEnglish,
            NameArabic = entity.NameArabic,
            Hex = entity.Hex,
            IsActive = entity.IsActive
        };
    }

    public static ProductColor ToProductColorEntity(this ProductColorDto dto)
    {
        return new ProductColor
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            NameEnglish = dto.NameEnglish,
            NameArabic = dto.NameArabic,
            Hex = dto.Hex,
        };
    }

    public static ProductSizeDto ToProductSizeDto(this ProductSize entity)
    {
        return new ProductSizeDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            Label = entity.Label,
            IsActive = entity.IsActive
        };
    }

    public static ProductSize ToProductSizeEntity(this ProductSizeDto dto)
    {
        return new ProductSize
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            Label = dto.Label,
        };
    }

    public static ProductFeatureDto ToProductFeatureDto(this ProductFeature entity)
    {
        return new ProductFeatureDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            IconName = entity.IconName,
            LabelEnglish = entity.LabelEnglish,
            LabelArabic = entity.LabelArabic,
            IsActive = entity.IsActive
        };
    }

    public static ProductFeature ToProductFeatureEntity(this ProductFeatureDto dto)
    {
        return new ProductFeature
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            IconName = dto.IconName,
            LabelEnglish = dto.LabelEnglish,
            LabelArabic = dto.LabelArabic,
        };
    }

    public static ProductSpecificationDto ToProductSpecificationDto(this ProductSpecification entity)
    {
        return new ProductSpecificationDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            LabelEnglish = entity.LabelEnglish,
            LabelArabic = entity.LabelArabic,
            ValueEnglish = entity.ValueEnglish,
            ValueArabic = entity.ValueArabic,
            IsActive = entity.IsActive
        };
    }

    public static ProductSpecification ToProductSpecificationEntity(this ProductSpecificationDto dto)
    {
        return new ProductSpecification
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            LabelEnglish = dto.LabelEnglish,
            LabelArabic = dto.LabelArabic,
            ValueEnglish = dto.ValueEnglish,
            ValueArabic = dto.ValueArabic,
        };
    }

    public static ProductCareInstructionDto ToProductCareInstructionDto(this ProductCareInstruction entity)
    {
        return new ProductCareInstructionDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            InstructionEnglish = entity.InstructionEnglish,
            InstructionArabic = entity.InstructionArabic,
            IsActive = entity.IsActive
        };
    }

    public static ProductCareInstruction ToProductCareInstructionEntity(this ProductCareInstructionDto dto)
    {
        return new ProductCareInstruction
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            InstructionEnglish = dto.InstructionEnglish,
            InstructionArabic = dto.InstructionArabic,
        };
    }
}
