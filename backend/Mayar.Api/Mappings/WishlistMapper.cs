using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class WishlistMapper
{
    public static WishlistDto ToWishlistDto(this Wishlist wishlist)
    {
        return new WishlistDto
        {
            Id = wishlist.Id,
            ProductId = wishlist.ProductId,
            UserId = wishlist.UserId,
            ProductNameEnglish = wishlist.ProductNameEnglish,
            ProductNameArabic = wishlist.ProductNameArabic,
            Brand = wishlist.Brand,
            ProductSlug = wishlist.ProductSlug,
            ProductVariantId = wishlist.ProductVariantId,
            ColorNameEnglish = wishlist.ColorNameEnglish,
            ColorNameArabic = wishlist.ColorNameArabic,
            ColorHex = wishlist.ColorHex,
            SizeLabel = wishlist.SizeLabel,
            PriceKWD = wishlist.PriceKWD,
            PriceINR = wishlist.PriceINR,
            CompareAtPriceKWD = wishlist.CompareAtPriceKWD,
            CompareAtPriceINR = wishlist.CompareAtPriceINR,
            ImageUrl = wishlist.ImageUrl,
            CreatedAt = wishlist.CreatedAt
        };
    }

    public static Wishlist ToWishlistEntity(this WishlistDto dto)
    {
        return new Wishlist
        {
            Id = dto.Id,
            ProductId = dto.ProductId,
            UserId = dto.UserId,
            ProductNameEnglish = dto.ProductNameEnglish,
            ProductNameArabic = dto.ProductNameArabic,
            Brand = dto.Brand,
            ProductSlug = dto.ProductSlug,
            ProductVariantId = dto.ProductVariantId,
            ColorNameEnglish = dto.ColorNameEnglish,
            ColorNameArabic = dto.ColorNameArabic,
            ColorHex = dto.ColorHex,
            SizeLabel = dto.SizeLabel,
            PriceKWD = dto.PriceKWD,
            PriceINR = dto.PriceINR,
            CompareAtPriceKWD = dto.CompareAtPriceKWD,
            CompareAtPriceINR = dto.CompareAtPriceINR,
            ImageUrl = dto.ImageUrl
        };
    }
}
