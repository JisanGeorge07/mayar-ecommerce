using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mayar.Api.Services;

public class CartService(AppDbContext context) : ICartService
{
    public async Task<CartSummaryDto> GetCartAsync(Guid? userId, string? sessionId)
    {
        // Validate: must have either userId or sessionId
        if (userId == null && string.IsNullOrEmpty(sessionId))
            throw new ArgumentException("Either userId or sessionId must be provided");

        var query = context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.Product)
                .ThenInclude(p => p.Variants)
            .Include(c => c.ProductColor)
            .Include(c => c.ProductSize)
            .Where(c => c.IsActive);

        if (userId.HasValue)
            query = query.Where(c => c.UserId == userId);
        else
            query = query.Where(c => c.SessionId == sessionId);

        var items = await query
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();

        var detailDtos = items.Select(c => c.ToCartItemDetailDto()).ToList();

        return new CartSummaryDto
        {
            Items = detailDtos,
            TotalItems = detailDtos.Count,
            TotalQuantity = detailDtos.Sum(i => i.Quantity),
            Subtotal = detailDtos.Sum(i => i.CurrentPrice * i.Quantity),
            HasPriceChanges = detailDtos.Any(i => i.PriceChanged),
            HasStockIssues = detailDtos.Any(i => !i.InStock || i.Quantity > (i.MaxQuantity ?? 99))
        };
    }

    public async Task<CartItemDetailDto?> GetCartItemAsync(Guid id)
    {
        var item = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.Product)
                .ThenInclude(p => p.Variants)
            .Include(c => c.ProductColor)
            .Include(c => c.ProductSize)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        return item?.ToCartItemDetailDto();
    }

    public async Task<CartItemDetailDto> AddToCartAsync(AddToCartRequest request)
    {
        // Validate: must have either userId or sessionId
        if (request.UserId == null && string.IsNullOrEmpty(request.SessionId))
            throw new ArgumentException("Either userId or sessionId must be provided");

        // Validate product exists and load with variants
        var product = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Colors)
            .Include(p => p.Sizes)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

        if (product == null)
            throw new ArgumentException("Product not found");

        if (!product.InStock)
            throw new ArgumentException("Product is out of stock");

        // Find variant if color and size are selected
        Entities.ProductVariant? variant = null;
        if (request.ProductColorId.HasValue && request.ProductSizeId.HasValue)
        {
            variant = product.Variants.FirstOrDefault(v =>
                v.ProductColorId == request.ProductColorId &&
                v.ProductSizeId == request.ProductSizeId);

            if (variant == null)
                throw new ArgumentException("Selected variant does not exist");

            if (!variant.InStock)
                throw new ArgumentException("Selected variant is out of stock");

            // Check variant stock
            if (variant.StockQuantity.HasValue && variant.StockQuantity < request.Quantity)
                throw new ArgumentException($"Insufficient stock. Only {variant.StockQuantity} items available");
        }
        else
        {
            // Validate individual color/size selection (for products without variants)
            if (request.ProductColorId.HasValue)
            {
                var colorExists = product.Colors.Any(c =>
                    c.Id == request.ProductColorId && c.IsActive);
                if (!colorExists)
                    throw new ArgumentException("Invalid color selection");
            }

            if (request.ProductSizeId.HasValue)
            {
                var size = product.Sizes.FirstOrDefault(s =>
                    s.Id == request.ProductSizeId && s.IsActive);
                if (size == null)
                    throw new ArgumentException("Invalid size selection");

                // For products without variants, rely on product-level stock status
                // Individual size stock is now managed via ProductVariant system
            }
        }

        // Check for existing cart item with same product+variant
        var existingItem = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.ProductColor)
            .Include(c => c.ProductSize)
            .FirstOrDefaultAsync(c =>
                c.ProductId == request.ProductId &&
                c.ProductColorId == request.ProductColorId &&
                c.ProductSizeId == request.ProductSizeId &&
                c.IsActive &&
                (request.UserId.HasValue ? c.UserId == request.UserId : c.SessionId == request.SessionId));

        if (existingItem != null)
        {
            // Update quantity
            var newQuantity = existingItem.Quantity + request.Quantity;

            // Validate stock for new quantity
            if (variant != null)
            {
                // Use variant stock
                if (variant.StockQuantity.HasValue && newQuantity > variant.StockQuantity)
                    throw new ArgumentException($"Insufficient stock. Maximum {variant.StockQuantity} items allowed");
            }
            else if (request.ProductSizeId.HasValue)
            {
                // For non-variant products, rely on product-level stock status
                // Individual size stock is now managed via ProductVariant system
                var size = product.Sizes.FirstOrDefault(s => s.Id == request.ProductSizeId);
                if (size == null)
                    throw new ArgumentException("Invalid size selection");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UpdatedAt = DateTimeHelper.GetLocalTime();
            await context.SaveChangesAsync();
            return existingItem.ToCartItemDetailDto();
        }

        // Determine unit price: use variant price if available, otherwise product base price
        var unitPrice = variant?.BasePriceKWD ?? product.BasePriceKWD ?? 0;

        // Create new cart item
        var cartItem = new Entities.CartItem
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            UserId = request.UserId,
            SessionId = request.SessionId,
            ProductColorId = request.ProductColorId,
            ProductSizeId = request.ProductSizeId,
            Quantity = request.Quantity,
            UnitPrice = unitPrice,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime(),
            IsActive = true
        };

        context.CartItems.Add(cartItem);
        await context.SaveChangesAsync();

        // Reload with navigation properties for DTO
        var addedItem = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.ProductColor)
            .Include(c => c.ProductSize)
            .FirstAsync(c => c.Id == cartItem.Id);

        return addedItem.ToCartItemDetailDto();
    }

    public async Task<CartItemDetailDto?> UpdateQuantityAsync(Guid id, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than 0");

        var item = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.Product)
                .ThenInclude(p => p.Variants)
            .Include(c => c.ProductColor)
            .Include(c => c.ProductSize)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (item == null)
            return null;

        // Check variant stock if both color and size are selected
        if (item.ProductColorId.HasValue && item.ProductSizeId.HasValue)
        {
            var variant = item.Product.Variants.FirstOrDefault(v =>
                v.ProductColorId == item.ProductColorId &&
                v.ProductSizeId == item.ProductSizeId);

            if (variant != null)
            {
                // Use variant stock
                if (variant.StockQuantity.HasValue && quantity > variant.StockQuantity)
                    throw new ArgumentException($"Insufficient stock. Only {variant.StockQuantity} items available");
            }
        }
        else if (item.ProductSizeId.HasValue && item.ProductSize != null)
        {
            // For non-variant products, rely on product-level stock status
            // Individual size stock is now managed via ProductVariant system
            if (!item.Product.InStock)
                throw new ArgumentException("Product is out of stock");
        }

        item.Quantity = quantity;
        item.UpdatedAt = DateTimeHelper.GetLocalTime();
        await context.SaveChangesAsync();

        return item.ToCartItemDetailDto();
    }

    public async Task<bool> RemoveItemAsync(Guid id)
    {
        var item = await context.CartItems.FindAsync(id);
        if (item == null || !item.IsActive)
            return false;

        // Soft delete
        item.IsActive = false;
        item.UpdatedAt = DateTimeHelper.GetLocalTime();
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearCartAsync(Guid? userId, string? sessionId)
    {
        if (userId == null && string.IsNullOrEmpty(sessionId))
            return false;

        var query = context.CartItems.Where(c => c.IsActive);

        if (userId.HasValue)
            query = query.Where(c => c.UserId == userId);
        else
            query = query.Where(c => c.SessionId == sessionId);

        var items = await query.ToListAsync();

        foreach (var item in items)
        {
            item.IsActive = false;
            item.UpdatedAt = DateTimeHelper.GetLocalTime();
        }

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<CartSummaryDto> ValidateCartAsync(Guid? userId, string? sessionId)
    {
        var cart = await GetCartAsync(userId, sessionId);

        // Update prices to current values
        foreach (var item in cart.Items.Where(i => i.PriceChanged))
        {
            var dbItem = await context.CartItems.FindAsync(item.Id);
            if (dbItem != null)
            {
                dbItem.UnitPrice = item.CurrentPrice;
                dbItem.UpdatedAt = DateTimeHelper.GetLocalTime();
            }
        }

        await context.SaveChangesAsync();

        // Return updated cart
        return await GetCartAsync(userId, sessionId);
    }

    public async Task<bool> MergeGuestCartAsync(Guid userId, string sessionId)
    {
        if (string.IsNullOrEmpty(sessionId))
            return false;

        var guestItems = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Variants)
            .Where(c => c.SessionId == sessionId && c.IsActive)
            .ToListAsync();

        foreach (var guestItem in guestItems)
        {
            // Check if user already has this item with same variant
            var existingUserItem = await context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.Variants)
                .Include(c => c.ProductSize)
                .FirstOrDefaultAsync(c =>
                    c.UserId == userId &&
                    c.ProductId == guestItem.ProductId &&
                    c.ProductColorId == guestItem.ProductColorId &&
                    c.ProductSizeId == guestItem.ProductSizeId &&
                    c.IsActive);

            if (existingUserItem != null)
            {
                // Merge quantities
                var newQuantity = existingUserItem.Quantity + guestItem.Quantity;

                // Validate against variant stock if applicable
                if (existingUserItem.ProductColorId.HasValue && existingUserItem.ProductSizeId.HasValue)
                {
                    var variant = existingUserItem.Product.Variants.FirstOrDefault(v =>
                        v.ProductColorId == existingUserItem.ProductColorId &&
                        v.ProductSizeId == existingUserItem.ProductSizeId);

                    if (variant?.StockQuantity.HasValue == true)
                        newQuantity = Math.Min(newQuantity, variant.StockQuantity.Value);
                }
                else if (existingUserItem.ProductSizeId.HasValue && existingUserItem.ProductSize != null)
                {
                    // For non-variant products, no specific stock limit per size
                    // Stock is managed at product level or via ProductVariant system
                }

                existingUserItem.Quantity = newQuantity;
                existingUserItem.UpdatedAt = DateTimeHelper.GetLocalTime();

                // Remove guest item
                guestItem.IsActive = false;
            }
            else
            {
                // Transfer to user
                guestItem.UserId = userId;
                guestItem.SessionId = null;
                guestItem.UpdatedAt = DateTimeHelper.GetLocalTime();
            }
        }

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetCartCountAsync(Guid? userId, string? sessionId)
    {
        if (userId == null && string.IsNullOrEmpty(sessionId))
            return 0;

        var query = context.CartItems.Where(c => c.IsActive);

        if (userId.HasValue)
            query = query.Where(c => c.UserId == userId);
        else
            query = query.Where(c => c.SessionId == sessionId);

        return await query.SumAsync(c => c.Quantity);
    }
}
