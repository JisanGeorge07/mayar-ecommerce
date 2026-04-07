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
    public class AboutController(IAboutService aboutService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAbout()
        {
            var about = await aboutService.GetAboutAsync();
            if (about == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "About information not found."
                });
            }
            return Ok(new ApiResponse<AboutDto>
            {
                Success = true,
                Message = "About information retrieved successfully.",
                Data = about
            });
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAbout([FromBody] AboutDto aboutDto)
        {
            var result = await aboutService.UpdateAboutAsync(aboutDto);
            if (!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Failed to update about information."
                });
            }
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "About information updated successfully."
            });
        }
    }
}
