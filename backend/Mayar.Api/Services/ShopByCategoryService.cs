using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;
namespace Mayar.Api.Services;

public class ShopByCategoryService(AppDbContext context, ICloudinaryService cloudinaryService) : IShopByCategoryService
{

    public async Task<List<ShopByCategoryDto>> GetAllAsync()
    {
        var items = await context.ShopByCategories
            .OrderBy(s => s.SortOrder)
            .ToListAsync();

        return items.Select(s => s.ToDto()).ToList();
    }

    public async Task<List<ShopByCategoryDto>> GetActivePublishedAsync()
    {
        var items = await context.ShopByCategories
            .Where(s => s.IsActive && s.IsPublished)
            .OrderBy(s => s.SortOrder)
            .ToListAsync();

        return items.Select(s => s.ToDto()).ToList();
    }

    public async Task<ShopByCategoryDto?> GetByIdAsync(Guid id)
    {
        var item = await context.ShopByCategories.FindAsync(id);
        return item?.ToDto();
    }

    public async Task<ShopByCategoryDto> CreateAsync(ShopByCategoryDto dto)
    {
        // Upload image if provided
        if (dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-shop-by-category");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.ImageUrl = imageUrl;
            }
        }

        // Set sort order to be last if not specified or is 0
        if (dto.SortOrder <= 0)
        {
            var maxOrder = await context.ShopByCategories.MaxAsync(s => (int?)s.SortOrder) ?? 0;
            dto.SortOrder = maxOrder + 1;
        }

        var item = new ShopByCategory
        {
            Id = Guid.NewGuid(),
            InternalName = dto.InternalName,
            TitleEnglish = dto.TitleEnglish,
            TitleArabic = dto.TitleArabic,
            ImageUrl = dto.ImageUrl ?? string.Empty,
            AltText = dto.AltText,
            LinkType = dto.LinkType,
            CategoryId = dto.CategoryId,
            SubcategoryId = dto.SubcategoryId,
            ProductTypeId = dto.ProductTypeId,
            ProductId = dto.ProductId,
            CustomUrl = dto.CustomUrl,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            IsPublished = dto.IsPublished,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };

        context.ShopByCategories.Add(item);
        await context.SaveChangesAsync();

        return item.ToDto();
    }

    public async Task<ShopByCategoryDto?> UpdateAsync(Guid id, ShopByCategoryDto dto)
    {
        var item = await context.ShopByCategories.FindAsync(id);
        if (item == null)
            return null;

        // Upload image if provided
        if (dto.ImageFile != null)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-shop-by-category");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                dto.ImageUrl = imageUrl;
            }
        }

        // Update all fields
        item.InternalName = dto.InternalName;
        item.TitleEnglish = dto.TitleEnglish;
        item.TitleArabic = dto.TitleArabic;
        item.AltText = dto.AltText;
        item.LinkType = dto.LinkType;
        item.CategoryId = dto.CategoryId;
        item.SubcategoryId = dto.SubcategoryId;
        item.ProductTypeId = dto.ProductTypeId;
        item.ProductId = dto.ProductId;
        item.CustomUrl = dto.CustomUrl;
        item.SortOrder = dto.SortOrder;
        item.IsActive = dto.IsActive;
        item.IsPublished = dto.IsPublished;
        item.UpdatedAt = DateTimeHelper.GetLocalTime();

        // Update image only if new URL is provided
        if (!string.IsNullOrEmpty(dto.ImageUrl))
        {
            item.ImageUrl = dto.ImageUrl;
        }

        await context.SaveChangesAsync();
        return item.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await context.ShopByCategories.FindAsync(id);
        if (item == null)
            return false;

        context.ShopByCategories.Remove(item);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(List<Guid> orderedIds)
    {
        for (int i = 0; i < orderedIds.Count; i++)
        {
            var item = await context.ShopByCategories.FindAsync(orderedIds[i]);
            if (item != null)
            {
                item.SortOrder = i + 1;
                item.UpdatedAt = DateTimeHelper.GetLocalTime();
            }
        }

        await context.SaveChangesAsync();
        return true;
    }
}
