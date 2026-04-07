using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class ProductSizeService(AppDbContext context) : IProductSizeService
{
    public async Task<List<ProductSizeDto>> GetAllAsync()
    {
        var sizes = await context.ProductSizes.ToListAsync();
        return sizes.Select(s => s.ToProductSizeDto()).ToList();
    }

    public async Task<ProductSizeDto?> GetByIdAsync(Guid id)
    {
        var size = await context.ProductSizes.FindAsync(id);
        return size?.ToProductSizeDto();
    }

    public async Task<List<ProductSizeDto>> GetByProductIdAsync(Guid productId)
    {
        var sizes = await context.ProductSizes
            .Where(s => s.ProductId == productId)
            .ToListAsync();
        return sizes.Select(s => s.ToProductSizeDto()).ToList();
    }

    public async Task<ProductSizeDto> CreateAsync(ProductSizeDto dto)
    {
        var entity = new ProductSize
        {
            Id = Guid.NewGuid(),
            ProductId = dto.ProductId,
            Label = dto.Label
        };

        context.ProductSizes.Add(entity);
        await context.SaveChangesAsync();

        return entity.ToProductSizeDto();
    }

    public async Task<ProductSizeDto?> UpdateAsync(Guid id, ProductSizeDto dto)
    {
        var entity = await context.ProductSizes.FindAsync(id);
        if (entity == null)
        {
            return null;
        }

        entity.Label = dto.Label;

        await context.SaveChangesAsync();

        return entity.ToProductSizeDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await context.ProductSizes.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.ProductSizes.Remove(entity);
        await context.SaveChangesAsync();

        return true;
    }
}
