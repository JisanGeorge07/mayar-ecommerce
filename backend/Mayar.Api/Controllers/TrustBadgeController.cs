using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrustBadgeController(ITrustBadgeService trustBadgeService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var trustBadges = await trustBadgeService.GetAllTrustBadgesAsync();
            return Ok(new ApiResponse<List<TrustBadgeDto>> { Success = true, Message = "Trust badges retrieved successfully.", Data = trustBadges });
        }
    }
}
