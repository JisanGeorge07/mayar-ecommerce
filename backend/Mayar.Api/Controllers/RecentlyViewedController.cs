using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecentlyViewedController(IRecentlyViewedService recentlyViewedService, ILogger<RecentlyViewedController> logger) : ControllerBase
    {
        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllByUser(Guid userId, [FromQuery] int limit = 50)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != userId.ToString())
                return Unauthorized(new { message = "Unauthorized access" });

            var items = await recentlyViewedService.GetAllByUserAsync(userId, limit);
            return Ok(new
            {
                success = true,
                message = "Recently viewed items retrieved successfully",
                data = items
            });
        }

        [Authorize]
        [HttpPost("track")]
        public async Task<IActionResult> TrackView([FromBody] CreateRecentlyViewedRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != request.UserId.ToString())
                return Unauthorized(new { message = "Unauthorized access" });

            var item = await recentlyViewedService.AddOrUpdateAsync(request);
            if (item is null)
                return BadRequest(new { message = "Failed to track viewed product" });

            return Ok(new
            {
                success = true,
                message = "Product view tracked successfully",
                data = item
            });
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Remove(Guid id)
        {
            var success = await recentlyViewedService.RemoveAsync(id);
            if (!success)
                return NotFound(new { message = "Recently viewed item not found" });

            logger.LogInformation("Recently viewed item removed: {Id}", id);
            return Ok(new
            {
                success = true,
                message = "Recently viewed item removed successfully"
            });
        }

        [Authorize]
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearUserHistory(Guid userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != userId.ToString())
                return Unauthorized(new { message = "Unauthorized access" });

            var success = await recentlyViewedService.ClearUserHistoryAsync(userId);
            if (!success)
                return BadRequest(new { message = "Failed to clear history" });

            logger.LogInformation("Cleared recently viewed history for user: {UserId}", userId);
            return Ok(new
            {
                success = true,
                message = "Recently viewed history cleared successfully"
            });
        }
    }
}
