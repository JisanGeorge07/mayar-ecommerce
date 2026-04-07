using Mayar.Api.DTOs;
using System;
using System.Threading.Tasks;

namespace Mayar.Api.Interfaces;

public interface ICartService
{
    Task<CartSummaryDto> GetCartAsync(Guid? userId, string? sessionId);
    Task<CartItemDetailDto?> GetCartItemAsync(Guid id);
    Task<CartItemDetailDto> AddToCartAsync(AddToCartRequest request);
    Task<CartItemDetailDto?> UpdateQuantityAsync(Guid id, int quantity);
    Task<bool> RemoveItemAsync(Guid id);
    Task<bool> ClearCartAsync(Guid? userId, string? sessionId);
    Task<CartSummaryDto> ValidateCartAsync(Guid? userId, string? sessionId);
    Task<bool> MergeGuestCartAsync(Guid userId, string sessionId);
    Task<int> GetCartCountAsync(Guid? userId, string? sessionId);
}
