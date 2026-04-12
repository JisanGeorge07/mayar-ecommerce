using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class WishlistService(AppDbContext context) : IWishlistService
{
    public async Task<List<WishlistDto>> GetAllByUserAsync(Guid userId)
    {
        var wishlists = await context.Wishlists
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return wishlists.Select(w => w.ToWishlistDto()).ToList();
    }

    public async Task<WishlistDto?> GetByIdAsync(Guid id)
    {
        var wishlist = await context.Wishlists.FindAsync(id);
        return wishlist?.ToWishlistDto();
    }

    public async Task<WishlistDto> CreateAsync(Guid userId, Guid productVariantId)
    {
        // Check if this variant is already in wishlist
        var existing = await context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductVariantId == productVariantId);

        if (existing != null)
        {
            return existing.ToWishlistDto();
        }

        // Fetch variant details with related data
        var variant = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.Id == productVariantId);

        if (variant == null)
        {
            throw new InvalidOperationException("Product variant not found.");
        }

        // Get the primary image for this product
        var primaryImage = await context.ProductImages
            .Where(img => img.ProductId == variant.ProductId && img.IsPrimary)
            .FirstOrDefaultAsync();

        // Create wishlist entry with variant details
        var wishlist = new Wishlist
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = variant.ProductId,
            ProductVariantId = productVariantId,
            ProductNameEnglish = variant.Product?.NameEnglish,
            ProductNameArabic = variant.Product?.NameArabic,
            Brand = variant.Product?.BrandEnglish,
            ProductSlug = variant.Product?.Slug,
            ColorNameEnglish = variant.ProductColor?.NameEnglish,
            ColorNameArabic = variant.ProductColor?.NameArabic,
            ColorHex = variant.ProductColor?.Hex,
            SizeLabel = variant.ProductSize?.Label,
            PriceKWD = variant.BasePriceKWD ?? variant.Product?.BasePriceKWD,
            PriceINR = variant.BasePriceINR ?? variant.Product?.BasePriceINR,
            CompareAtPriceKWD = variant.CompareAtPriceKWD ?? variant.Product?.CompareAtPriceKWD,
            CompareAtPriceINR = variant.CompareAtPriceINR ?? variant.Product?.CompareAtPriceINR,
            ImageUrl = !string.IsNullOrEmpty(variant.ImageUrl) ? variant.ImageUrl : primaryImage?.ImageUrl
        };

        context.Wishlists.Add(wishlist);
        await context.SaveChangesAsync();

        return wishlist.ToWishlistDto();
    }

    public async Task<bool> RemoveAsync(Guid id)
    {
        var wishlist = await context.Wishlists.FindAsync(id);
        if (wishlist == null)
        {
            return false;
        }

        context.Wishlists.Remove(wishlist);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveByUserAndProductAsync(Guid userId, Guid productId)
    {
        var wishlist = await context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (wishlist == null)
        {
            return false;
        }

        context.Wishlists.Remove(wishlist);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsInWishlistAsync(Guid userId, Guid productId)
    {
        return await context.Wishlists
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);
    }

    public async Task<bool> IsVariantInWishlistAsync(Guid userId, Guid productVariantId)
    {
        return await context.Wishlists
            .AnyAsync(w => w.UserId == userId && w.ProductVariantId == productVariantId);
    }
}
