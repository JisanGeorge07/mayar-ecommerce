using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class NewsLetterService(AppDbContext context) : INewsLetterService
{
    public async Task<List<NewsLetterDto>> GetAllAsync()
    {
        var items = await context.NewsLetters.ToListAsync();
        return items.Select(x => x.ToNewsLetterDto()).ToList();
    }

    public async Task<NewsLetterDto?> GetByIdAsync(Guid id)
    {
        var item = await context.NewsLetters.FindAsync(id);
        return item?.ToNewsLetterDto();
    }

    public async Task<List<NewsLetterDto>> GetByUserIdAsync(Guid userId)
    {
        var items = await context.NewsLetters
            .Where(x => x.UserId == userId)
            .ToListAsync();
        return items.Select(x => x.ToNewsLetterDto()).ToList();
    }

    public async Task<NewsLetterDto> CreateAsync(NewsLetterDto dto)
    {
        // Check if email already exists
        var existingSubscription = await context.NewsLetters
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (existingSubscription != null)
        {
            throw new InvalidOperationException("This email is already subscribed.");
        }

        var entity = new NewsLetter
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Email = dto.Email,
            SubscribedAt = DateTime.UtcNow,
            IsActive = true
        };

        context.NewsLetters.Add(entity);
        await context.SaveChangesAsync();

        return entity.ToNewsLetterDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await context.NewsLetters.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.NewsLetters.Remove(entity);
        await context.SaveChangesAsync();

        return true;
    }
}
