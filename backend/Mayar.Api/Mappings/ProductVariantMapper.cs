using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class ProductVariantMapper
{
    public static ProductVariantDto ToProductVariantDto(this ProductVariant entity)
    {
        return new ProductVariantDto
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            ProductColorId = entity.ProductColorId,
            ProductSizeId = entity.ProductSizeId,
            BasePriceKWD = entity.BasePriceKWD,
            CompareAtPriceKWD = entity.CompareAtPriceKWD,
            BasePriceINR = entity.BasePriceINR,
            CompareAtPriceINR = entity.CompareAtPriceINR,
            StockQuantity = entity.StockQuantity,
            InStock = entity.InStock,
            IsDefault = entity.IsDefault,
            Color = entity.ProductColor?.ToProductColorDto(),
            Size = entity.ProductSize?.ToProductSizeDto()
        };
    }

    public static ProductVariant ToProductVariantEntity(this ProductVariantDto dto)
    {
        return new ProductVariant
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            ProductColorId = dto.ProductColorId,
            ProductSizeId = dto.ProductSizeId,
            BasePriceKWD = dto.BasePriceKWD,
            CompareAtPriceKWD = dto.CompareAtPriceKWD,
            BasePriceINR = dto.BasePriceINR,
            CompareAtPriceINR = dto.CompareAtPriceINR,
            StockQuantity = dto.StockQuantity,
            InStock = dto.InStock,
            IsDefault = dto.IsDefault
        };
    }
}
