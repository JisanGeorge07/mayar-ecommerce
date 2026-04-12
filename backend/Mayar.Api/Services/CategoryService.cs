using Mayar.Api.Common;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class CategoryService(AppDbContext context, ICloudinaryService cloudinaryService) : ICategoryService
{
    // MegaMenu - hierarchical menu for navigation
    public async Task<List<NavMenuItemDto>> GetMegaMenuAsync()
    {
        // Get all active top categories with their middle and bottom categories
        var topCategories = await context.TopCategories
            .Where(tc => tc.IsActive)
            .Include(tc => tc.MiddleCategories.Where(mc => mc.IsActive))
                .ThenInclude(mc => mc.BottomCategories.Where(bc => bc.IsActive))
            .ToListAsync();

        var menuItems = new List<NavMenuItemDto>();

        foreach (var topCategory in topCategories)
        {
            var sections = topCategory.MiddleCategories
                .Select(mc => new MegaMenuSectionDto
                {
                    Id = mc.Id.ToString(),
                    Title = new TranslatedTextDto { En = mc.TitleEnglish, Ar = mc.TitleArabic },
                    Links = mc.BottomCategories
                        .Select(bc => new MegaMenuLinkDto
                        {
                            Id = bc.Id.ToString(),
                            Label = new TranslatedTextDto { En = bc.TitleEnglish, Ar = bc.TitleArabic },
                            Slug = bc.Slug ?? string.Empty
                        }).ToList()
                }).ToList();

            var menuItem = new NavMenuItemDto
            {
                Id = topCategory.Id.ToString(),
                Label = new TranslatedTextDto { En = topCategory.TitleEnglish, Ar = topCategory.TitleArabic },
                Slug = $"/{topCategory.Slug ?? string.Empty}",
                Type = sections.Count > 0 ? "mega" : "link",
                Sections = sections.Count > 0 ? sections : null,
                FeaturedImage = topCategory.ImageUrl
            };

            // Add badge if present
            if (!string.IsNullOrEmpty(topCategory.BadgeEnglish) || !string.IsNullOrEmpty(topCategory.BadgeArabic))
            {
                menuItem.Badge = new TranslatedTextDto
                {
                    En = topCategory.BadgeEnglish,
                    Ar = topCategory.BadgeArabic
                };
            }

            menuItems.Add(menuItem);
        }

        return menuItems;
    }

    //Top Category
    public async Task<List<TopCategoryDto>> GetAllTopCategoriesAsync()
    {
        var categories = await context.TopCategories.ToListAsync();
        return categories.Select(c => c.ToTopCategoryDto()).ToList();
    }

    public async Task<TopCategoryDto?> GetTopCategoryByIdAsync(Guid id)
    {
        var category = await context.TopCategories.FindAsync(id);
        return category?.ToTopCategoryDto();
    }
    public async Task<TopCategoryDto?> GetTopCategoryBySlugAsync(string slug)
    {
        var category = await context.TopCategories.FirstOrDefaultAsync(c => c.Slug == slug);
        return category?.ToTopCategoryDto();
    }

    public async Task<TopCategoryDto> CreateTopCategoryAsync([FromForm]TopCategoryDto dto)
    {
        // if (dto.ImageFile != null)
        // {
        //     var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-categories");
        //     if (!string.IsNullOrEmpty(imageUrl))
        //     {
        //         dto.ImageUrl = imageUrl;
        //     }
        // }

        var entity = dto.ToTopCategoryEntity();


        context.TopCategories.Add(entity);
        await context.SaveChangesAsync();
        return entity.ToTopCategoryDto();
    }
    public async Task<bool> UpdateTopCategoryAsync(Guid id, TopCategoryDto dto)
    {
        var entity = await context.TopCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        // if (dto.ImageFile != null)
        // {
        //     var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-categories");
        //     if (!string.IsNullOrEmpty(imageUrl))
        //     {
        //         dto.ImageUrl = imageUrl;
        //     }
        // }
        entity.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? string.Empty : dto.Slug;
        entity.TitleEnglish = string.IsNullOrWhiteSpace(dto.TitleEnglish) ? string.Empty : dto.TitleEnglish;
        entity.TitleArabic = string.IsNullOrWhiteSpace(dto.TitleArabic) ? string.Empty : dto.TitleArabic;
        // entity.ImageAlt = string.IsNullOrWhiteSpace(dto.ImageAlt) ? string.Empty : dto.ImageAlt;
        entity.BadgeEnglish = string.IsNullOrWhiteSpace(dto.BadgeEnglish) ? string.Empty : dto.BadgeEnglish;
        entity.BadgeArabic = string.IsNullOrWhiteSpace(dto.BadgeArabic) ? string.Empty : dto.BadgeArabic;
        entity.DisplayOrder = dto.DisplayOrder == 0 ? 0 : dto.DisplayOrder;
        entity.IsActive = dto.IsActive;

        // if (!string.IsNullOrEmpty(dto.ImageUrl))
        // {
        //     entity.ImageUrl = dto.ImageUrl;
        // }
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteTopCategoryAsync(Guid id)
    {
        var entity = await context.TopCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.TopCategories.Remove(entity);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleTopCategoryStatusAsync(Guid id)
    {
        var entity = await context.TopCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        entity.IsActive = !entity.IsActive;
        await context.SaveChangesAsync();
        return true;
    }

    //Middle Category
    public async Task<List<MiddleCategoryDto>> GetAllMiddleCategoriesAsync()
    {
        var categories = await context.MiddleCategories.ToListAsync();
        return categories.Select(c => c.ToMiddleCategoryDto()).ToList();
    }

    public async Task<MiddleCategoryDto?> GetMiddleCategoryByIdAsync(Guid id)
    {
        var category = await context.MiddleCategories.FindAsync(id);
        return category?.ToMiddleCategoryDto();
    }
    public async Task<MiddleCategoryDto?> GetMiddleCategoryBySlugAsync(string slug)
    {
        var category = await context.MiddleCategories.FirstOrDefaultAsync(c => c.Slug == slug);
        return category?.ToMiddleCategoryDto();
    }

    public async Task<MiddleCategoryDto> CreateMiddleCategoryAsync(MiddleCategoryDto dto)
    {
        // if (dto.ImageFile != null)
        // {
        //     var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-categories");
        //     if (!string.IsNullOrEmpty(imageUrl))
        //     {
        //         dto.ImageUrl = imageUrl;
        //     }
        // }

        var entity = dto.ToMiddleCategoryEntity();
        // entity.Slug = SlugGenerator.GenerateSlug(dto.TitleEnglish ?? string.Empty);

        // var displayOrder = context.MiddleCategories.Max(x => x.DisplayOrder);
        // if (displayOrder == 0 || displayOrder == null)
        // {
        //     entity.DisplayOrder = 1;
        // }
        // else
        // {
        //     entity.DisplayOrder = (long)displayOrder + 1;
        // }

        context.MiddleCategories.Add(entity);
        await context.SaveChangesAsync();
        return entity.ToMiddleCategoryDto();
    }
    public async Task<bool> UpdateMiddleCategoryAsync(Guid id, MiddleCategoryDto dto)
    {
        var entity = await context.MiddleCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        // if (dto.ImageFile != null)
        // {
        //     var imageUrl = await cloudinaryService.UploadImageAsync(dto.ImageFile, "mayar-categories");
        //     if (!string.IsNullOrEmpty(imageUrl))
        //     {
        //         dto.ImageUrl = imageUrl;
        //     }
        // }

        entity.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? string.Empty : dto.Slug;
        entity.TopCategoryId = string.IsNullOrWhiteSpace(dto.TopCategoryId.ToString()) ? Guid.Empty : dto.TopCategoryId;
        entity.TitleEnglish = string.IsNullOrWhiteSpace(dto.TitleEnglish) ? string.Empty : dto.TitleEnglish;
        entity.TitleArabic = string.IsNullOrWhiteSpace(dto.TitleArabic) ? string.Empty : dto.TitleArabic;
        // entity.SubtitleEnglish = string.IsNullOrWhiteSpace(dto.SubtitleEnglish) ? string.Empty : dto.SubtitleEnglish;
        // entity.SubtitleArabic = string.IsNullOrWhiteSpace(dto.SubtitleArabic) ? string.Empty : dto.SubtitleArabic;
        // entity.ImageAlt = string.IsNullOrWhiteSpace(dto.ImageAlt) ? string.Empty : dto.ImageAlt;
        // entity.ButtonTextEnglish = string.IsNullOrWhiteSpace(dto.ButtonTextEnglish) ? string.Empty : dto.ButtonTextEnglish;
        // entity.ButtonTextArabic = string.IsNullOrWhiteSpace(dto.ButtonTextArabic) ? string.Empty : dto.ButtonTextArabic;
        // entity.ButtonLink = string.IsNullOrWhiteSpace(dto.ButtonLink) ? string.Empty : dto.ButtonLink;
        entity.IsActive = dto.IsActive;
        entity.DisplayOrder = dto.DisplayOrder == 0 ? 0 : dto.DisplayOrder;

        // if (!string.IsNullOrEmpty(dto.ImageUrl))
        // {
        //     entity.ImageUrl = dto.ImageUrl;
        // }

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteMiddleCategoryAsync(Guid id)
    {
        var entity = await context.MiddleCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.MiddleCategories.Remove(entity);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleMiddleCategoryStatusAsync(Guid id)
    {
        var entity = await context.MiddleCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        entity.IsActive = !entity.IsActive;
        await context.SaveChangesAsync();
        return true;
    }

    //Bottom Category
    public async Task<List<BottomCategoryDto>> GetAllBottomCategoriesAsync()
    {
        var categories = await context.BottomCategories.ToListAsync();
        return categories.Select(c => c.ToBottomCategoryDto()).ToList();
    }

    public async Task<BottomCategoryDto?> GetBottomCategoryByIdAsync(Guid id)
    {
        var category = await context.BottomCategories.FindAsync(id);
        return category?.ToBottomCategoryDto();
    }
    public async Task<BottomCategoryDto?> GetBottomCategoryBySlugAsync(string slug)
    {
        var category = await context.BottomCategories.FirstOrDefaultAsync(c => c.Slug == slug);
        return category?.ToBottomCategoryDto();
    }

    public async Task<BottomCategoryDto> CreateBottomCategoryAsync(BottomCategoryDto dto)
    {

        var entity = dto.ToBottomCategoryEntity();
        // entity.Slug = SlugGenerator.GenerateSlug(dto.TitleEnglish ?? string.Empty);
        // var displayOrder = context.BottomCategories.Max(x => x.DisplayOrder);
        // if (displayOrder == 0 || displayOrder == null)
        // {
        //     entity.DisplayOrder = 1;
        // }
        // else
        // {
        //     entity.DisplayOrder = (long)displayOrder + 1;
        // }
        context.BottomCategories.Add(entity);
        await context.SaveChangesAsync();
        return entity.ToBottomCategoryDto();
    }
    public async Task<bool> UpdateBottomCategoryAsync(Guid id, BottomCategoryDto dto)
    {
        var entity = await context.BottomCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        entity.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? string.Empty : dto.Slug;
        entity.TopCategoryId = string.IsNullOrWhiteSpace(dto.TopCategoryId.ToString()) ? Guid.Empty : dto.TopCategoryId;
        entity.MiddleCategoryId = string.IsNullOrWhiteSpace(dto.MiddleCategoryId.ToString()) ? Guid.Empty : dto.MiddleCategoryId;
        entity.TitleEnglish = string.IsNullOrWhiteSpace(dto.TitleEnglish) ? string.Empty : dto.TitleEnglish;
        entity.TitleArabic = string.IsNullOrWhiteSpace(dto.TitleArabic) ? string.Empty : dto.TitleArabic;
        entity.IsActive = dto.IsActive;
        entity.DisplayOrder = dto.DisplayOrder == 0 ? 0 : dto.DisplayOrder;
        entity.Description = string.IsNullOrWhiteSpace(dto.Description) ? string.Empty : dto.Description;
        entity.AttributeTemplate = string.IsNullOrWhiteSpace(dto.AttributeTemplate) ? string.Empty : dto.AttributeTemplate;


        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBottomCategoryAsync(Guid id)
    {
        var entity = await context.BottomCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        context.BottomCategories.Remove(entity);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleBottomCategoryStatusAsync(Guid id)
    {
        var entity = await context.BottomCategories.FindAsync(id);
        if (entity == null)
        {
            return false;
        }

        entity.IsActive = !entity.IsActive;
        await context.SaveChangesAsync();
        return true;
    }
}
