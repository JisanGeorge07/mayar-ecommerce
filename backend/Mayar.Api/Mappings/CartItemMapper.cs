using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using System.Linq;

namespace Mayar.Api.Mappings;

public static class CartItemMapper
{
    public static CartItemDto ToCartItemDto(this CartItem entity)
    {
        return new CartItemDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            UserId = entity.UserId,
            SessionId = entity.SessionId,
            ProductColorId = entity.ProductColorId,
            ProductSizeId = entity.ProductSizeId,
            Quantity = entity.Quantity,
            UnitPrice = entity.UnitPrice,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsActive = entity.IsActive
        };
    }

    public static CartItemDetailDto ToCartItemDetailDto(this CartItem entity)
    {
        var product = entity.Product;
        var color = entity.ProductColor;
        var size = entity.ProductSize;
        var primaryImage = product.Images
            .Where(i => i.IsActive)
            .OrderByDescending(i => i.IsPrimary)
            .ThenBy(i => i.Id)
            .FirstOrDefault();

        // Find variant if both color and size are selected
        ProductVariant? variant = null;
        if (entity.ProductColorId.HasValue && entity.ProductSizeId.HasValue)
        {
            variant = product.Variants?.FirstOrDefault(v =>
                v.ProductColorId == entity.ProductColorId &&
                v.ProductSizeId == entity.ProductSizeId);
        }

        // Use variant prices if available, otherwise fallback to product prices
        var currentPriceKWD = variant?.BasePriceKWD ?? product.BasePriceKWD ?? 0;
        var currentPriceINR = variant?.BasePriceINR ?? product.BasePriceINR ?? 0;
        var compareAtPriceKWD = variant?.CompareAtPriceKWD ?? product.CompareAtPriceKWD;
        var compareAtPriceINR = variant?.CompareAtPriceINR ?? product.CompareAtPriceINR;

        // Use variant stock if available, otherwise fallback to size or product stock
        bool inStock;
        int? maxQuantity;

        if (variant != null)
        {
            inStock = variant.InStock;
            maxQuantity = variant.StockQuantity ?? 99;
        }
        else
        {
            // For products without variants, use product-level InStock status
            inStock = product.InStock;
            maxQuantity = 99; // Default max quantity for non-variant products
        }

        return new CartItemDetailDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            ProductSlug = product.Slug,
            ProductNameEnglish = product.NameEnglish,
            ProductNameArabic = product.NameArabic,
            BrandEnglish = product.BrandEnglish,
            BrandArabic = product.BrandArabic,
            ImageUrl = !string.IsNullOrEmpty(variant?.ImageUrl) ? variant.ImageUrl : primaryImage?.ImageUrl,

            ProductVariantId = variant?.Id,
            ProductColorId = color?.Id,
            ColorNameEnglish = color?.NameEnglish,
            ColorNameArabic = color?.NameArabic,
            ColorHex = color?.Hex,

            ProductSizeId = size?.Id,
            SizeLabel = size?.Label,

            Quantity = entity.Quantity,
            UnitPrice = entity.UnitPrice,
            CompareAtPrice = compareAtPriceKWD,
            UnitPriceINR = currentPriceINR,
            CompareAtPriceINR = compareAtPriceINR,

            InStock = inStock,
            MaxQuantity = maxQuantity,

            CurrentPrice = currentPriceKWD,
            CurrentPriceINR = currentPriceINR,
            PriceChanged = entity.UnitPrice != currentPriceKWD,

            UpdatedAt = entity.UpdatedAt
        };
    }
}
