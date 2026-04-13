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

    public async Task<WishlistDto> CreateAsync(Guid userId, Guid productId, Guid? productVariantId)
    {
        Product? product = null;
        ProductVariant? variant = null;

        if (productVariantId.HasValue)
        {
            // Fetch variant details with related data
            variant = await context.ProductVariants
                .Include(v => v.ProductColor)
                .Include(v => v.ProductSize)
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.Id == productVariantId.Value);

            if (variant == null)
            {
                throw new InvalidOperationException("Product variant not found.");
            }
            product = variant.Product;
        }
        else
        {
            // Case: Add simple product (or no specific variant selected)
            product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                throw new InvalidOperationException("Product not found.");
            }

            // Optional: If product HAS variants but none selected, maybe we want to pick the default anyway?
            // For now, let's keep it null if not explicitly passed, as requested.
        }

        // Check if this (product + optional variant) is already in wishlist
        var existing = await context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId && w.ProductVariantId == productVariantId);

        if (existing != null)
        {
            return existing.ToWishlistDto();
        }

        // Get the primary image for this product
        var primaryImage = product.Images?.FirstOrDefault(img => img.IsPrimary) 
            ?? product.Images?.FirstOrDefault();

        // Create wishlist entry
        var wishlist = new Wishlist
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = productId,
            ProductVariantId = productVariantId,
            ProductNameEnglish = product.NameEnglish,
            ProductNameArabic = product.NameArabic,
            Brand = product.BrandEnglish,
            ProductSlug = product.Slug,
            ColorNameEnglish = variant?.ProductColor?.NameEnglish,
            ColorNameArabic = variant?.ProductColor?.NameArabic,
            ColorHex = variant?.ProductColor?.Hex,
            SizeLabel = variant?.ProductSize?.Label,
            PriceKWD = variant?.BasePriceKWD ?? product.BasePriceKWD,
            PriceINR = variant?.BasePriceINR ?? product.BasePriceINR,
            CompareAtPriceKWD = variant?.CompareAtPriceKWD ?? product.CompareAtPriceKWD,
            CompareAtPriceINR = variant?.CompareAtPriceINR ?? product.CompareAtPriceINR,
            ImageUrl = variant?.ImageUrl ?? primaryImage?.ImageUrl
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
        var wishlists = await context.Wishlists
            .Where(w => w.UserId == userId && w.ProductId == productId)
            .ToListAsync();

        if (wishlists.Count == 0)
        {
            return false;
        }

        context.Wishlists.RemoveRange(wishlists);
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
