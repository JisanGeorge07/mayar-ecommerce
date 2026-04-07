using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IProductImageService
{
    Task<List<ProductImageDto>> GetAllAsync();
    Task<ProductImageDto?> GetByIdAsync(Guid id);
    Task<List<ProductImageDto>> GetByProductIdAsync(Guid productId);
    Task<ProductImageDto> CreateAsync(ProductImageDto dto);
    Task<ProductImageDto?> UpdateAsync(Guid id, ProductImageDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetAsPrimaryAsync(Guid id);
}
