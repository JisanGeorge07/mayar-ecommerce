using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface ICategoryService
{
    // MegaMenu - hierarchical menu for navigation
    Task<List<NavMenuItemDto>> GetMegaMenuAsync();

    //Top Category
    Task<List<TopCategoryDto>> GetAllTopCategoriesAsync();
    Task<TopCategoryDto?> GetTopCategoryByIdAsync(Guid id);
    Task<TopCategoryDto?> GetTopCategoryBySlugAsync(string slug);
    Task<TopCategoryDto> CreateTopCategoryAsync(TopCategoryDto dto);
    Task<bool> UpdateTopCategoryAsync(Guid id, TopCategoryDto dto);
    Task<bool> DeleteTopCategoryAsync(Guid id);
    Task<bool> ToggleTopCategoryStatusAsync(Guid id);

    //Middle Category
    Task<List<MiddleCategoryDto>> GetAllMiddleCategoriesAsync();
    Task<MiddleCategoryDto?> GetMiddleCategoryByIdAsync(Guid id);
    Task<MiddleCategoryDto?> GetMiddleCategoryBySlugAsync(string slug);
    Task<MiddleCategoryDto> CreateMiddleCategoryAsync(MiddleCategoryDto dto);
    Task<bool> UpdateMiddleCategoryAsync(Guid id, MiddleCategoryDto dto);
    Task<bool> DeleteMiddleCategoryAsync(Guid id);
    Task<bool> ToggleMiddleCategoryStatusAsync(Guid id);

    //Bottom Category
    Task<List<BottomCategoryDto>> GetAllBottomCategoriesAsync();
    Task<BottomCategoryDto?> GetBottomCategoryByIdAsync(Guid id);
    Task<BottomCategoryDto?> GetBottomCategoryBySlugAsync(string slug);
    Task<BottomCategoryDto> CreateBottomCategoryAsync(BottomCategoryDto dto);
    Task<bool> UpdateBottomCategoryAsync(Guid id, BottomCategoryDto dto);
    Task<bool> DeleteBottomCategoryAsync(Guid id);
    Task<bool> ToggleBottomCategoryStatusAsync(Guid id);
}
