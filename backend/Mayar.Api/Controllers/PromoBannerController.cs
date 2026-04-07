using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromoBannerController(IPromoBannerService promoBannerService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var promoBanners = await promoBannerService.GetAllAsync();
            return Ok(new ApiResponse<List<PromoBannerDto>> { Success = true, Message = "Promo banners retrieved successfully.", Data = promoBanners });
        }

        [HttpGet("get-active")]
        public async Task<IActionResult> GetActive()
        {
            var promoBanners = await promoBannerService.GetActiveAsync();
            return Ok(new ApiResponse<List<PromoBannerDto>> { Success = true, Message = "Active promo banners retrieved successfully.", Data = promoBanners });
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var promoBanner = await promoBannerService.GetByIdAsync(id);
            if (promoBanner == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Promo banner not found." });
            }
            return Ok(new ApiResponse<PromoBannerDto> { Success = true, Message = "Promo banner retrieved successfully.", Data = promoBanner });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] PromoBannerDto promoBannerDto)
        {
            var promoBanner = await promoBannerService.CreateAsync(promoBannerDto);
            return CreatedAtAction(nameof(GetById), new { id = promoBanner.Id },
                new ApiResponse<PromoBannerDto>
                {
                    Success = true,
                    Message = "Promo banner created successfully.",
                    Data = promoBanner
                });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] PromoBannerDto promoBannerDto)
        {
            var promoBanner = await promoBannerService.UpdateAsync(id, promoBannerDto);
            if (promoBanner == null)
            {
                return NotFound(new ApiResponse<PromoBannerDto> { Success = false, Message = "Promo banner not found." });
            }
            return Ok(new ApiResponse<PromoBannerDto> { Success = true, Message = "Promo banner updated successfully.", Data = promoBanner });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await promoBannerService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Promo banner not found." });
            }
            return Ok(new ApiResponse<object> { Success = true, Message = "Promo banner deleted successfully.", Data = result });
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<Guid> orderedIds)
        {
            var result = await promoBannerService.ReorderAsync(orderedIds);
            if (!result)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Failed to reorder promo banners." });
            }
            return Ok(new ApiResponse<object> { Success = true, Message = "Promo banners reordered successfully.", Data = result });
        }
    }
}
