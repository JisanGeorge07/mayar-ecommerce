using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mayar.Api.Services;

public class ProductVariantService(AppDbContext context,ICloudinaryService cloudinaryService) : IProductVariantService
{
    public async Task<ProductVariantDto?> GetByIdAsync(Guid id)
    {
        var variant = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .FirstOrDefaultAsync(v => v.Id == id);

        return variant?.ToProductVariantDto();
    }

    public async Task<List<ProductVariantDto>> GetByProductIdAsync(Guid productId)
    {
        var variants = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .Where(v => v.ProductId == productId)
            .OrderByDescending(v => v.IsDefault)
            .ThenBy(v => v.ProductColor.NameEnglish)
            .ThenBy(v => v.ProductSize.Label)
            .ToListAsync();

        return variants.Select(v => v.ToProductVariantDto()).ToList();
    }

    public async Task<ProductVariantDto?> GetByColorAndSizeAsync(Guid productId, Guid colorId, Guid sizeId)
    {
        var variant = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .FirstOrDefaultAsync(v =>
                v.ProductId == productId &&
                v.ProductColorId == colorId &&
                v.ProductSizeId == sizeId);

        return variant?.ToProductVariantDto();
    }

    public async Task<ProductVariantDto> CreateAsync(ProductVariantDto dto)
    {
        // Validate product exists
        var productExists = await context.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists)
            throw new ArgumentException("Product not found");

        // Validate color exists and belongs to product
        var colorExists = await context.ProductColors.AnyAsync(c =>
            c.Id == dto.ProductColorId && c.ProductId == dto.ProductId);
        if (!colorExists)
            throw new ArgumentException("Color not found or does not belong to this product");

        // Validate size exists and belongs to product
        var sizeExists = await context.ProductSizes.AnyAsync(s =>
            s.Id == dto.ProductSizeId && s.ProductId == dto.ProductId);
        if (!sizeExists)
            throw new ArgumentException("Size not found or does not belong to this product");

        // Check for duplicate variant (color+size combo)
        var duplicateExists = await context.ProductVariants.AnyAsync(v =>
            v.ProductId == dto.ProductId &&
            v.ProductColorId == dto.ProductColorId &&
            v.ProductSizeId == dto.ProductSizeId);
        if (duplicateExists)
            throw new ArgumentException("Variant with this color and size combination already exists");

        // Validate pricing
        if (dto.BasePriceKWD.HasValue && dto.BasePriceKWD < 0)
            throw new ArgumentException("Base price cannot be negative");
        if (dto.BasePriceINR.HasValue && dto.BasePriceINR < 0)
            throw new ArgumentException("Base price cannot be negative");
        if (dto.StockQuantity.HasValue && dto.StockQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative");

        var variant = dto.ToProductVariantEntity();
        variant.Id = Guid.NewGuid();
        if(dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-product-variants");
            variant.ImageUrl = imageUrl;
        }


        // If this is the first variant, make it default
        var hasExistingVariants = await context.ProductVariants
            .AnyAsync(v => v.ProductId == dto.ProductId);
        if (!hasExistingVariants)
        {
            variant.IsDefault = true;
        }

        context.ProductVariants.Add(variant);
        await context.SaveChangesAsync();

        // Update product InStock status based on variants
        await UpdateProductStockStatus(dto.ProductId);

        // Reload with navigation properties
        var created = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .FirstAsync(v => v.Id == variant.Id);

        return created.ToProductVariantDto();
    }

    public async Task<ProductVariantDto?> UpdateAsync(Guid id, ProductVariantDto dto)
    {
        var variant = await context.ProductVariants.FindAsync(id);
        if (variant == null)
            return null;

        // Validate pricing
        if (dto.BasePriceKWD.HasValue && dto.BasePriceKWD < 0)
            throw new ArgumentException("Base price cannot be negative");
        if (dto.BasePriceINR.HasValue && dto.BasePriceINR < 0)
            throw new ArgumentException("Base price cannot be negative");
        if (dto.StockQuantity.HasValue && dto.StockQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative");

        // Check if trying to change color/size to existing combination
        if ((variant.ProductColorId != dto.ProductColorId || variant.ProductSizeId != dto.ProductSizeId))
        {
            var duplicateExists = await context.ProductVariants.AnyAsync(v =>
                v.Id != id &&
                v.ProductId == variant.ProductId &&
                v.ProductColorId == dto.ProductColorId &&
                v.ProductSizeId == dto.ProductSizeId);
            if (duplicateExists)
                throw new ArgumentException("Another variant with this color and size combination already exists");
        }

        variant.ProductColorId = dto.ProductColorId;
        variant.ProductSizeId = dto.ProductSizeId;
        variant.BasePriceKWD = dto.BasePriceKWD;
        variant.CompareAtPriceKWD = dto.CompareAtPriceKWD;
        variant.BasePriceINR = dto.BasePriceINR;
        variant.CompareAtPriceINR = dto.CompareAtPriceINR;
        variant.StockQuantity = dto.StockQuantity;
        variant.InStock = dto.InStock;
        variant.IsDefault = dto.IsDefault;
        if(dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-product-variants");
            variant.ImageUrl = imageUrl;
        }

        await context.SaveChangesAsync();

        // Update product InStock status based on variants
        await UpdateProductStockStatus(variant.ProductId);

        // Reload with navigation properties
        var updated = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .FirstAsync(v => v.Id == id);

        return updated.ToProductVariantDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var variant = await context.ProductVariants.FindAsync(id);
        if (variant == null)
            return false;

        var productId = variant.ProductId;

        // Check if variant is in any active carts
        var usedInCart = await context.CartItems.AnyAsync(c =>
            c.IsActive &&
            c.ProductId == productId &&
            c.ProductColorId == variant.ProductColorId &&
            c.ProductSizeId == variant.ProductSizeId);

        if (usedInCart)
            throw new InvalidOperationException("Cannot delete variant that is in active carts");

        context.ProductVariants.Remove(variant);
        await context.SaveChangesAsync();

        // Update product InStock status based on remaining variants
        await UpdateProductStockStatus(productId);

        return true;
    }

    public async Task<bool> CheckStockAsync(Guid variantId, int quantity)
    {
        var variant = await context.ProductVariants.FindAsync(variantId);
        if (variant == null)
            return false;

        if (!variant.InStock)
            return false;

        if (!variant.StockQuantity.HasValue)
            return true; // Unlimited stock

        return variant.StockQuantity >= quantity;
    }

    public async Task<List<ProductVariantDto>> GetAvailableVariantsAsync(Guid productId)
    {
        var variants = await context.ProductVariants
            .Include(v => v.ProductColor)
            .Include(v => v.ProductSize)
            .Where(v => v.ProductId == productId && v.InStock)
            .OrderByDescending(v => v.IsDefault)
            .ThenBy(v => v.ProductColor.NameEnglish)
            .ThenBy(v => v.ProductSize.Label)
            .ToListAsync();

        return variants.Select(v => v.ToProductVariantDto()).ToList();
    }

    public async Task<int> GetLowStockCountAsync(int threshold = 5)
    {
        // Count variants that have stock tracking enabled (StockQuantity is not null)
        // and have stock > 0 but <= threshold
        return await context.ProductVariants
            .Where(v => v.StockQuantity.HasValue && v.StockQuantity > 0 && v.StockQuantity <= threshold)
            .CountAsync();
    }

    private async Task UpdateProductStockStatus(Guid productId)
    {
        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return;

        // Check if product has any variants
        var hasVariants = await context.ProductVariants.AnyAsync(v => v.ProductId == productId);

        if (hasVariants)
        {
            // Product is in stock if ANY variant is in stock
            var anyVariantInStock = await context.ProductVariants
                .AnyAsync(v => v.ProductId == productId && v.InStock);
            product.InStock = anyVariantInStock;
        }
        // If no variants, keep existing Product.InStock value

        await context.SaveChangesAsync();
    }
}
