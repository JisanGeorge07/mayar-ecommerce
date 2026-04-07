using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IShopByCategoryService
{
    Task<List<ShopByCategoryDto>> GetAllAsync();
    Task<List<ShopByCategoryDto>> GetActivePublishedAsync();
    Task<ShopByCategoryDto?> GetByIdAsync(Guid id);
    Task<ShopByCategoryDto> CreateAsync(ShopByCategoryDto dto);
    Task<ShopByCategoryDto?> UpdateAsync(Guid id, ShopByCategoryDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> orderedIds);
}
