using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces
{
    public interface IRecentlyViewedService
    {
        Task<List<RecentlyViewedDto>> GetAllByUserAsync(Guid userId, int limit = 50);
        Task<RecentlyViewedDto?> AddOrUpdateAsync(CreateRecentlyViewedRequest request);
        Task<bool> RemoveAsync(Guid id);
        Task<bool> ClearUserHistoryAsync(Guid userId);
    }
}
