using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CouponController(ICouponCodeService couponCodeService) : ControllerBase
{
    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var coupons = await couponCodeService.GetAllAsync();
        return Ok(new ApiResponse<List<CouponCodeDto>>
        {
            Success = true,
            Message = "Coupons retrieved successfully.",
            Data = coupons
        });
    }

    [HttpGet("get-active")]
    public async Task<IActionResult> GetActive()
    {
        var coupons = await couponCodeService.GetActiveAsync();
        return Ok(new ApiResponse<List<CouponCodeDto>>
        {
            Success = true,
            Message = "Active coupons retrieved successfully.",
            Data = coupons
        });
    }

    [HttpGet("get-cart-suggestions")]
    public async Task<IActionResult> GetCartSuggestions()
    {
        var coupons = await couponCodeService.GetCartSuggestionsAsync();
        return Ok(new ApiResponse<List<CouponCodeDto>>
        {
            Success = true,
            Message = "Cart suggestions retrieved successfully.",
            Data = coupons
        });
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var coupon = await couponCodeService.GetByIdAsync(id);
        if (coupon == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Coupon not found."
            });
        }

        return Ok(new ApiResponse<CouponCodeDto>
        {
            Success = true,
            Message = "Coupon retrieved successfully.",
            Data = coupon
        });
    }

    [HttpGet("get-by-code/{code}")]
    public async Task<IActionResult> GetByCode(string code)
    {
        var coupon = await couponCodeService.GetByCodeAsync(code);
        if (coupon == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Coupon not found."
            });
        }

        return Ok(new ApiResponse<CouponCodeDto>
        {
            Success = true,
            Message = "Coupon retrieved successfully.",
            Data = coupon
        });
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CouponCodeDto dto)
    {
        try
        {
            var coupon = await couponCodeService.CreateAsync(dto);
            return Ok(new ApiResponse<CouponCodeDto>
            {
                Success = true,
                Message = "Coupon created successfully.",
                Data = coupon
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
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] CouponCodeDto dto)
    {
        try
        {
            var coupon = await couponCodeService.UpdateAsync(id, dto);
            if (coupon == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Coupon not found."
                });
            }

            return Ok(new ApiResponse<CouponCodeDto>
            {
                Success = true,
                Message = "Coupon updated successfully.",
                Data = coupon
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

    [HttpDelete("delete/{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await couponCodeService.DeleteAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Coupon not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Coupon deleted successfully."
        });
    }

    [HttpPatch("toggle-status/{id}")]
    [Authorize]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        var result = await couponCodeService.ToggleStatusAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Coupon not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Coupon status toggled successfully."
        });
    }

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] CouponValidationRequest request)
    {
        var response = await couponCodeService.ValidateAsync(request);
        return Ok(new ApiResponse<CouponValidationResponse>
        {
            Success = response.Valid,
            Message = response.Message,
            Data = response
        });
    }
}
