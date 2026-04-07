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
    public class HeroSlideController(IHeroSlideService heroSlideService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var slides = await heroSlideService.GetAllAsync();
            return Ok(new ApiResponse<List<HeroSlideDto>> { Success = true, Message = "Slides retrieved successfully.", Data = slides });
        }

        [HttpGet("get-active")]
        public async Task<IActionResult> GetActivePublished()
        {
            var slides = await heroSlideService.GetActivePublishedAsync();
            return Ok(new ApiResponse<List<HeroSlideDto>> { Success = true, Message = "Active slides retrieved successfully.", Data = slides });
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var slide = await heroSlideService.GetByIdAsync(id);
            if (slide == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Slide not found." });
            }
            return Ok(new ApiResponse<HeroSlideDto> { Success = true, Message = "Slide retrieved successfully.", Data = slide });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] HeroSlideDto heroSlideDto)
        {
            var slide = await heroSlideService.CreateAsync(heroSlideDto);
            return CreatedAtAction(nameof(GetById), new { id = slide.Id },
                new ApiResponse<HeroSlideDto>
                {
                    Success = true,
                    Message = "Slide created successfully.",
                    Data = slide
                });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] HeroSlideDto heroSlideDto)
        {
            var slide = await heroSlideService.UpdateAsync(id, heroSlideDto);
            if (slide == null)
            {
                return NotFound(new ApiResponse<HeroSlideDto> { Success = false, Message = "Slide not found." });
            }
            return Ok(new ApiResponse<HeroSlideDto> { Success = true, Message = "Slide updated successfully.", Data = slide });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await heroSlideService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Slide not found." });
            }
            return Ok(new ApiResponse<object> { Success = true, Message = "Slide deleted successfully.", Data = result });
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> Reorder([FromBody] ReorderHeroSlidesDto dto)
        {
            var result = await heroSlideService.ReorderAsync(dto.OrderedIds);
            if (!result)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Failed to reorder slides. Some IDs may be invalid." });
            }
            return Ok(new ApiResponse<object> { Success = true, Message = "Slides reordered successfully." });
        }
    }
}
