using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<List<ProductDto>> GetByIdsAsync(List<Guid> ids);
    Task<ProductDto?> GetBySlugAsync(string slug);
    Task<List<ProductDto>> GetBestSellersAsync();
    Task<List<ProductDto>> GetNewArrivalsAsync();
    Task<List<ProductDto>> GetFeaturedAsync();
    Task<List<ProductDto>> GetOnSaleAsync();
    Task<PaginatedResult<ProductDto>> GetFilteredAsync(ProductFilterDto filter);
    Task<ShopDataDto> GetShopDataAsync();
    Task<ProductDto> CreateAsync(ProductDto productDto);
    Task<ProductDto?> UpdateAsync(Guid id, ProductDto productDto);
    Task<bool> DeleteAsync(Guid id);
}
