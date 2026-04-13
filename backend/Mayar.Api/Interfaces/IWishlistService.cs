using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IWishlistService
{
    Task<List<WishlistDto>> GetAllByUserAsync(Guid userId);
    Task<WishlistDto?> GetByIdAsync(Guid id);
    Task<WishlistDto> CreateAsync(Guid userId, Guid productId, Guid? productVariantId);
    Task<bool> RemoveAsync(Guid id);
    Task<bool> RemoveByUserAndProductAsync(Guid userId, Guid productId);
    Task<bool> IsInWishlistAsync(Guid userId, Guid productId);
    Task<bool> IsVariantInWishlistAsync(Guid userId, Guid productVariantId);
}
