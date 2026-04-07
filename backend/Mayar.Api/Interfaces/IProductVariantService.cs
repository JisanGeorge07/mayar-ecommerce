using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IProductVariantService
{
    Task<ProductVariantDto?> GetByIdAsync(Guid id);
    Task<List<ProductVariantDto>> GetByProductIdAsync(Guid productId);
    Task<ProductVariantDto?> GetByColorAndSizeAsync(Guid productId, Guid colorId, Guid sizeId);
    Task<ProductVariantDto> CreateAsync(ProductVariantDto dto);
    Task<ProductVariantDto?> UpdateAsync(Guid id, ProductVariantDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> CheckStockAsync(Guid variantId, int quantity);
    Task<List<ProductVariantDto>> GetAvailableVariantsAsync(Guid productId);
    Task<int> GetLowStockCountAsync(int threshold = 5);
}
