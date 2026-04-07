using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IHeroSlideService
{
    Task<List<HeroSlideDto>> GetAllAsync();
    Task<List<HeroSlideDto>> GetActivePublishedAsync();
    Task<HeroSlideDto?> GetByIdAsync(Guid id);
    Task<HeroSlideDto> CreateAsync(HeroSlideDto heroSlideDto);
    Task<HeroSlideDto?> UpdateAsync(Guid id, HeroSlideDto heroSlideDto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> orderedIds);
}
