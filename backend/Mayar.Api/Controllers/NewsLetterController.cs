using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsLetterController(INewsLetterService service) : ControllerBase
{
    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var items = await service.GetAllAsync();
        return Ok(new ApiResponse<List<NewsLetterDto>> { Success = true, Message = "Subscriptions retrieved successfully.", Data = items });
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await service.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Subscription not found." });
        }
        return Ok(new ApiResponse<NewsLetterDto> { Success = true, Message = "Subscription retrieved successfully.", Data = item });
    }

    [HttpGet("get-by-user/{userId}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var items = await service.GetByUserIdAsync(userId);
        return Ok(new ApiResponse<List<NewsLetterDto>> { Success = true, Message = "Subscriptions retrieved successfully.", Data = items });
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromForm] NewsLetterDto dto)
    {
        try
        {
            var item = await service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = item.Id },
                new ApiResponse<NewsLetterDto> { Success = true, Message = "Subscribed successfully.", Data = item });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await service.DeleteAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Subscription not found." });
        }
        return Ok(new ApiResponse<object> { Success = true, Message = "Unsubscribed successfully." });
    }
}
