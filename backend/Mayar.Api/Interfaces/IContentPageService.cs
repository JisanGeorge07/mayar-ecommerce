using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IContentPageService
{
    Task<List<ContentPageDto>> GetAllAsync();
    Task<ContentPageDto?> GetByIdAsync(Guid id);
    Task<ContentPageDto?> GetByPageTypeAsync(string pageType);
    Task<ContentPageDto> CreateAsync(ContentPageDto dto);
    Task<ContentPageDto?> UpdateAsync(Guid id, ContentPageDto dto);
    Task<bool> DeleteAsync(Guid id);
}