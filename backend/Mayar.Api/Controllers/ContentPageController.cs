using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContentPageController(IContentPageService service) : ControllerBase
{
    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var pages = await service.GetAllAsync();
        return Ok(new ApiResponse<List<ContentPageDto>>
        {
            Success = true,
            Message = "Content pages retrieved successfully.",
            Data = pages
        });
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var page = await service.GetByIdAsync(id);
        if (page == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Content page not found."
            });
        }

        return Ok(new ApiResponse<ContentPageDto>
        {
            Success = true,
            Message = "Content page retrieved successfully.",
            Data = page
        });
    }

    [HttpGet("get-by-type/{pageType}")]
    public async Task<IActionResult> GetByPageType(string pageType)
    {
        var page = await service.GetByPageTypeAsync(pageType);
        if (page == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = $"Content page with type '{pageType}' not found."
            });
        }

        return Ok(new ApiResponse<ContentPageDto>
        {
            Success = true,
            Message = "Content page retrieved successfully.",
            Data = page
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] ContentPageDto dto)
    {
        try
        {
            var page = await service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = page.Id },
                new ApiResponse<ContentPageDto>
                {
                    Success = true,
                    Message = "Content page created successfully.",
                    Data = page
                });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ContentPageDto dto)
    {
        var page = await service.UpdateAsync(id, dto);
        if (page == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Content page not found."
            });
        }

        return Ok(new ApiResponse<ContentPageDto>
        {
            Success = true,
            Message = "Content page updated successfully.",
            Data = page
        });
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await service.DeleteAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Content page not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Content page deleted successfully."
        });
    }
}