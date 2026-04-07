using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class ProductImageService(AppDbContext context, ICloudinaryService cloudinaryService) : IProductImageService
{
    public async Task<List<ProductImageDto>> GetAllAsync()
    {
        var images = await context.ProductImages.ToListAsync();
        return images.Select(i => i.ToProductImageDto()).ToList();
    }

    public async Task<ProductImageDto?> GetByIdAsync(Guid id)
    {
        var image = await context.ProductImages.FindAsync(id);
        return image?.ToProductImageDto();
    }

    public async Task<List<ProductImageDto>> GetByProductIdAsync(Guid productId)
    {
        var images = await context.ProductImages
            .Where(i => i.ProductId == productId)
            .ToListAsync();
        return images.Select(i => i.ToProductImageDto()).ToList();
    }

    public async Task<ProductImageDto> CreateAsync(ProductImageDto dto)
    {
        var entity = new ProductImage
        {
            Id = Guid.NewGuid(),
            ProductId = dto.ProductId,
            ImageAlt = dto.ImageAlt,
            IsActive = dto.IsActive
        };

        // Check if this is the first image for this product
        var existingImagesCount = await context.ProductImages
            .CountAsync(i => i.ProductId == dto.ProductId);

        // Set as primary if it's the first image or explicitly set as primary
        entity.IsPrimary = existingImagesCount == 0 || dto.IsPrimary;

        // If setting as primary, ensure no other images are primary for this product
        if (entity.IsPrimary)
        {
            await UnsetPrimaryForProduct(dto.ProductId);
        }

        if (dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-products");
            entity.ImageUrl = imageUrl;
        }

        context.ProductImages.Add(entity);
        await context.SaveChangesAsync();

        return entity.ToProductImageDto();
    }

    public async Task<ProductImageDto?> UpdateAsync(Guid id, ProductImageDto dto)
    {
        var entity = await context.ProductImages.FindAsync(id);
        if (entity == null)
        {
            return null;
        }

        entity.ImageAlt = dto.ImageAlt;

        // Handle primary image status change
        if (dto.IsPrimary != entity.IsPrimary && dto.IsPrimary)
        {
            // If setting this image as primary, unset other primary images for this product
            await UnsetPrimaryForProduct(entity.ProductId);
        }

        entity.IsPrimary = dto.IsPrimary;

        if (dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-products");
            entity.ImageUrl = imageUrl;
        }

        await context.SaveChangesAsync();

        return entity.ToProductImageDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await context.ProductImages.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.ProductImages.Remove(entity);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SetAsPrimaryAsync(Guid id)
    {
        var entity = await context.ProductImages.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        // Unset primary for all other images of this product
        await UnsetPrimaryForProduct(entity.ProductId);

        // Set this image as primary
        entity.IsPrimary = true;
        await context.SaveChangesAsync();

        return true;
    }

    private async Task UnsetPrimaryForProduct(Guid productId)
    {
        var primaryImages = await context.ProductImages
            .Where(i => i.ProductId == productId && i.IsPrimary)
            .ToListAsync();

        foreach (var image in primaryImages)
        {
            image.IsPrimary = false;
        }
    }
}
