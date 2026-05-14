using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services
{
    public class RecentlyViewedService(AppDbContext context, ILogger<RecentlyViewedService> logger) : IRecentlyViewedService
    {
        public async Task<List<RecentlyViewedDto>> GetAllByUserAsync(Guid userId, int limit = 50)
        {
            var items = await context.RecentlyViewedProducts
                .Where(rv => rv.UserId == userId)
                .OrderByDescending(rv => rv.ViewedAt)
                .Take(limit)
                .ToListAsync();

            return items.Select(item => new RecentlyViewedDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                UserId = item.UserId,
                ViewedAt = item.ViewedAt
            }).ToList();
        }

        public async Task<RecentlyViewedDto?> AddOrUpdateAsync(CreateRecentlyViewedRequest request)
        {
            // Check if already exists
            var existing = await context.RecentlyViewedProducts
                .FirstOrDefaultAsync(rv => rv.UserId == request.UserId && rv.ProductId == request.ProductId);

            if (existing != null)
            {
                // Update the viewed timestamp
                existing.ViewedAt = DateTimeHelper.GetLocalTime();
                await context.SaveChangesAsync();

                logger.LogInformation("Updated recently viewed: {ProductId} for user {UserId}", request.ProductId, request.UserId);

                return new RecentlyViewedDto
                {
                    Id = existing.Id,
                    ProductId = existing.ProductId,
                    UserId = existing.UserId,
                    ViewedAt = existing.ViewedAt
                };
            }

            // Create new entry
            var item = new RecentlyViewed
            {
                ProductId = request.ProductId,
                UserId = request.UserId,
                ViewedAt = DateTimeHelper.GetLocalTime()
            };

            context.RecentlyViewedProducts.Add(item);
            await context.SaveChangesAsync();

            logger.LogInformation("Added to recently viewed: {ProductId} for user {UserId}", request.ProductId, request.UserId);

            return new RecentlyViewedDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                UserId = item.UserId,
                ViewedAt = item.ViewedAt
            };
        }

        public async Task<bool> RemoveAsync(Guid id)
        {
            var item = await context.RecentlyViewedProducts.FindAsync(id);
            if (item is null)
                return false;

            context.RecentlyViewedProducts.Remove(item);
            await context.SaveChangesAsync();

            logger.LogInformation("Removed from recently viewed: {Id}", id);
            return true;
        }

        public async Task<bool> ClearUserHistoryAsync(Guid userId)
        {
            var items = await context.RecentlyViewedProducts
                .Where(rv => rv.UserId == userId)
                .ToListAsync();

            context.RecentlyViewedProducts.RemoveRange(items);
            await context.SaveChangesAsync();

            logger.LogInformation("Cleared recently viewed history for user: {UserId}", userId);
            return true;
        }
    }
}
