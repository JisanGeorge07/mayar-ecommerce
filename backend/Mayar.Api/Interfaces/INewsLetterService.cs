using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface INewsLetterService
{
    Task<List<NewsLetterDto>> GetAllAsync();
    Task<NewsLetterDto?> GetByIdAsync(Guid id);
    Task<List<NewsLetterDto>> GetByUserIdAsync(Guid userId);
    Task<NewsLetterDto> CreateAsync(NewsLetterDto dto);
    Task<bool> DeleteAsync(Guid id);
}
