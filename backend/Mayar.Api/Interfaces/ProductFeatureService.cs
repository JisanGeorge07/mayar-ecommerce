using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class ProductFeatureService(AppDbContext context) : IProductFeatureService
{
    public async Task<List<ProductFeatureDto>> GetAllAsync()
    {
        var features = await context.ProductFeatures.ToListAsync();
        return features.Select(f => f.ToProductFeatureDto()).ToList();
    }

    public async Task<ProductFeatureDto?> GetByIdAsync(Guid id)
    {
        var feature = await context.ProductFeatures.FindAsync(id);
        return feature?.ToProductFeatureDto();
    }

    public async Task<List<ProductFeatureDto>> GetByProductIdAsync(Guid productId)
    {
        var features = await context.ProductFeatures
            .Where(f => f.ProductId == productId)
            .ToListAsync();
        return features.Select(f => f.ToProductFeatureDto()).ToList();
    }

    public async Task<ProductFeatureDto> CreateAsync(ProductFeatureDto dto)
    {
        var entity = new ProductFeature
        {
            Id = Guid.NewGuid(),
            ProductId = dto.ProductId,
            LabelEnglish = dto.LabelEnglish,
            LabelArabic = dto.LabelArabic,
            IconName = dto.IconName,
        };

        context.ProductFeatures.Add(entity);
        await context.SaveChangesAsync();

        return entity.ToProductFeatureDto();
    }

    public async Task<ProductFeatureDto?> UpdateAsync(Guid id, ProductFeatureDto dto)
    {
        var entity = await context.ProductFeatures.FindAsync(id);
        if (entity == null)
        {
            return null;
        }

        entity.LabelEnglish = dto.LabelEnglish;
        entity.LabelArabic = dto.LabelArabic;
        entity.IconName = dto.IconName;

        await context.SaveChangesAsync();

        return entity.ToProductFeatureDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await context.ProductFeatures.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.ProductFeatures.Remove(entity);
        await context.SaveChangesAsync();

        return true;
    }
}
