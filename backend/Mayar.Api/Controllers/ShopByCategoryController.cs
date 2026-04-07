using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopByCategoryController : ControllerBase
    {
        private readonly IShopByCategoryService _shopByCategoryService;

        public ShopByCategoryController(IShopByCategoryService shopByCategoryService)
        {
            _shopByCategoryService = shopByCategoryService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var items = await _shopByCategoryService.GetAllAsync();
            return Ok(new ApiResponse<List<ShopByCategoryDto>>
            {
                Success = true,
                Message = "Shop by category items retrieved successfully.",
                Data = items
            });
        }

        [HttpGet("get-active")]
        public async Task<IActionResult> GetActivePublished()
        {
            var items = await _shopByCategoryService.GetActivePublishedAsync();
            return Ok(new ApiResponse<List<ShopByCategoryDto>>
            {
                Success = true,
                Message = "Active items retrieved successfully.",
                Data = items
            });
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _shopByCategoryService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Item not found."
                });
            }
            return Ok(new ApiResponse<ShopByCategoryDto>
            {
                Success = true,
                Message = "Item retrieved successfully.",
                Data = item
            });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] ShopByCategoryDto dto)
        {
            try
            {
                // Log the received data for debugging
                Console.WriteLine($"Received DTO: InternalName='{dto.InternalName}', TitleEnglish='{dto.TitleEnglish}', TitleArabic='{dto.TitleArabic}'");
                Console.WriteLine($"LinkType='{dto.LinkType}', CategoryId={dto.CategoryId}, SortOrder={dto.SortOrder}");
                Console.WriteLine($"IsActive={dto.IsActive}, IsPublished={dto.IsPublished}");

                if (!ModelState.IsValid)
                {
                    Console.WriteLine("ModelState is invalid:");
                    foreach (var error in ModelState)
                    {
                        Console.WriteLine($"{error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                    }

                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Data = ModelState
                    });
                }

                var item = await _shopByCategoryService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = item.Id },
                    new ApiResponse<ShopByCategoryDto>
                    {
                        Success = true,
                        Message = "Item created successfully.",
                        Data = item
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in Create: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] ShopByCategoryDto dto)
        {
            var item = await _shopByCategoryService.UpdateAsync(id, dto);
            if (item == null)
            {
                return NotFound(new ApiResponse<ShopByCategoryDto>
                {
                    Success = false,
                    Message = "Item not found."
                });
            }
            return Ok(new ApiResponse<ShopByCategoryDto>
            {
                Success = true,
                Message = "Item updated successfully.",
                Data = item
            });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _shopByCategoryService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Item not found."
                });
            }
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Item deleted successfully.",
                Data = result
            });
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> Reorder([FromBody] ReorderShopByCategoryDto dto)
        {
            var result = await _shopByCategoryService.ReorderAsync(dto.OrderedIds);
            if (!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Failed to reorder items. Some IDs may be invalid."
                });
            }
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Items reordered successfully."
            });
        }
    }
}
