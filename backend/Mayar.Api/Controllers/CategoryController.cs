using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        // MegaMenu - hierarchical menu for navigation
        [HttpGet("megamenu")]
        public async Task<IActionResult> GetMegaMenu()
        {
            var menuItems = await categoryService.GetMegaMenuAsync();
            return Ok(new ApiResponse<List<NavMenuItemDto>> { Success = true, Message = "Mega menu retrieved successfully.", Data = menuItems });
        }

        //Top Category
        [HttpGet("top")]
        public async Task<IActionResult> GetAllTopCategories()
        {
            var categories = await categoryService.GetAllTopCategoriesAsync();

            return Ok(new ApiResponse<List<TopCategoryDto>> { Success = true, Message = "Top categories retrieved successfully.", Data = categories });
        }

        [HttpGet("top/{id}")]
        public async Task<IActionResult> GetTopCategoryById(Guid id)
        {
            var category = await categoryService.GetTopCategoryByIdAsync(id);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Top category not found." });


            return Ok(new ApiResponse<TopCategoryDto> { Success = true, Message = "Top category retrieved successfully.", Data = category });
        }

        [HttpGet("top/slug/{slug}")]
        public async Task<IActionResult> GetTopCategoryBySlug(string slug)
        {
            var category = await categoryService.GetTopCategoryBySlugAsync(slug);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Top category not found." });

            return Ok(new ApiResponse<TopCategoryDto> { Success = true, Message = "Top category retrieved successfully.", Data = category });
        }

        [HttpPost("top/create")]
        public async Task<IActionResult> CreateTopCategory([FromForm] TopCategoryDto dto)
        {
            var created = await categoryService.CreateTopCategoryAsync(dto);

            return CreatedAtAction(nameof(GetTopCategoryById), new { id = created.Id },
    new ApiResponse<TopCategoryDto>
    {
        Success = true,
        Message = "Top category created successfully.",
        Data = created
    });
        }

        [HttpPut("top/update/{id}")]
        public async Task<IActionResult> UpdateTopCategory(Guid id, [FromForm] TopCategoryDto dto)
        {
            var success = await categoryService.UpdateTopCategoryAsync(id, dto);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Top category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Top category updated successfully." });
        }
        [HttpDelete("top/delete/{id}")]
        public async Task<IActionResult> DeleteTopCategory(Guid id)
        {
            var success = await categoryService.DeleteTopCategoryAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Top category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Top category deleted successfully." });
        }

        [HttpPatch("top/toggle-status/{id}")]
        public async Task<IActionResult> ToggleTopCategoryStatus(Guid id)
        {
            var success = await categoryService.ToggleTopCategoryStatusAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Top category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Top category status toggled successfully." });
        }

        //Middle Category
        [HttpGet("middle")]
        public async Task<IActionResult> GetAllMiddleCategories()
        {
            var categories = await categoryService.GetAllMiddleCategoriesAsync();

            return Ok(new ApiResponse<List<MiddleCategoryDto>> { Success = true, Message = "Middle categories retrieved successfully.", Data = categories });
        }

        [HttpGet("middle/{id}")]
        public async Task<IActionResult> GetMiddleCategoryById(Guid id)
        {
            var category = await categoryService.GetMiddleCategoryByIdAsync(id);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });

            return Ok(new ApiResponse<MiddleCategoryDto> { Success = true, Message = "Middle category retrieved successfully.", Data = category });
        }

        [HttpGet("middle/slug/{slug}")]
        public async Task<IActionResult> GetMiddleCategoryBySlug(string slug)
        {
            var category = await categoryService.GetMiddleCategoryBySlugAsync(slug);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });

            return Ok(new ApiResponse<MiddleCategoryDto> { Success = true, Message = "Middle category retrieved successfully.", Data = category });
        }

        [HttpPost("middle/create")]
        public async Task<IActionResult> CreateMiddleCategory([FromForm] MiddleCategoryDto dto)
        {
            var created = await categoryService.CreateMiddleCategoryAsync(dto);
            if (created == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });

            return CreatedAtAction(nameof(GetMiddleCategoryById), new { id = created.Id },
    new ApiResponse<MiddleCategoryDto>
    {
        Success = true,
        Message = "Middle category created successfully.",
        Data = created
    });
        }

        [HttpPut("middle/update/{id}")]
        public async Task<IActionResult> UpdateMiddleCategory(Guid id, [FromForm] MiddleCategoryDto dto)
        {
            var success = await categoryService.UpdateMiddleCategoryAsync(id, dto);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });


            return Ok(new ApiResponse<object> { Success = true, Message = "Middle category updated successfully." });
        }

        [HttpDelete("middle/delete/{id}")]
        public async Task<IActionResult> DeleteMiddleCategory(Guid id)
        {
            var success = await categoryService.DeleteMiddleCategoryAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Middle category deleted successfully." });
        }

        [HttpPatch("middle/toggle-status/{id}")]
        public async Task<IActionResult> ToggleMiddleCategoryStatus(Guid id)
        {
            var success = await categoryService.ToggleMiddleCategoryStatusAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Middle category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Middle category status toggled successfully." });
        }

        //Bottom Category
        [HttpGet("bottom")]
        public async Task<IActionResult> GetBottomCategories()
        {
            var categories = await categoryService.GetAllBottomCategoriesAsync();
            return Ok(new ApiResponse<List<BottomCategoryDto>> { Success = true, Message = "Bottom categories retrieved successfully.", Data = categories });

        }

        [HttpGet("bottom/{id}")]
        public async Task<IActionResult> GetBottomCategoryById(Guid id)
        {
            var category = await categoryService.GetBottomCategoryByIdAsync(id);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return Ok(new ApiResponse<BottomCategoryDto> { Success = true, Message = "Bottom category retrieved successfully.", Data = category });
        }

        [HttpGet("bottom/slug/{slug}")]
        public async Task<IActionResult> GetBottomCategoryBySlug(string slug)
        {
            var category = await categoryService.GetBottomCategoryBySlugAsync(slug);
            if (category == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return Ok(new ApiResponse<BottomCategoryDto> { Success = true, Message = "Bottom category retrieved successfully.", Data = category });
        }

        [HttpPost("bottom/create")]
        public async Task<IActionResult> CreateBottomCategory([FromForm] BottomCategoryDto dto)
        {
            var created = await categoryService.CreateBottomCategoryAsync(dto);
            if (created == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return CreatedAtAction(nameof(GetBottomCategoryById), new { id = created.Id },
    new ApiResponse<BottomCategoryDto>
    {
        Success = true,
        Message = "Bottom category created successfully.",
        Data = created
    });
        }

        [HttpPut("bottom/update/{id}")]
        public async Task<IActionResult> UpdateBottomCategory(Guid id, [FromForm] BottomCategoryDto dto)
        {
            var success = await categoryService.UpdateBottomCategoryAsync(id, dto);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Bottom category updated successfully." });
        }

        [HttpDelete("bottom/delete/{id}")]
        public async Task<IActionResult> DeleteBottomCategory(Guid id)
        {
            var success = await categoryService.DeleteBottomCategoryAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Bottom category deleted successfully." });
        }

        [HttpPatch("bottom/toggle-status/{id}")]
        public async Task<IActionResult> ToggleBottomCategoryStatus(Guid id)
        {
            var success = await categoryService.ToggleBottomCategoryStatusAsync(id);
            if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Bottom category not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Bottom category status toggled successfully." });
        }
    }
}
