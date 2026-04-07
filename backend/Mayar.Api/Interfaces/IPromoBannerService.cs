using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IPromoBannerService
{
    Task<List<PromoBannerDto>> GetAllAsync();
    Task<List<PromoBannerDto>> GetActiveAsync();
    Task<PromoBannerDto?> GetByIdAsync(Guid id);
    Task<PromoBannerDto> CreateAsync(PromoBannerDto dto);
    Task<PromoBannerDto?> UpdateAsync(Guid id, PromoBannerDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> orderedIds);
}
