using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Mayar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpGet("get")]
    public async Task<IActionResult> GetCart([FromQuery] Guid? userId, [FromQuery] string? sessionId)
    {
        if (userId == null && string.IsNullOrEmpty(sessionId))
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Either userId or sessionId must be provided."
            });
        }

        try
        {
            var cart = await cartService.GetCartAsync(userId, sessionId);
            return Ok(new ApiResponse<CartSummaryDto>
            {
                Success = true,
                Message = "Cart retrieved successfully.",
                Data = cart
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [HttpGet("item/{id}")]
    public async Task<IActionResult> GetCartItem(Guid id)
    {
        var item = await cartService.GetCartItemAsync(id);
        if (item == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Cart item not found."
            });
        }

        return Ok(new ApiResponse<CartItemDetailDto>
        {
            Success = true,
            Message = "Cart item retrieved successfully.",
            Data = item
        });
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        try
        {
            var item = await cartService.AddToCartAsync(request);
            return Ok(new ApiResponse<CartItemDetailDto>
            {
                Success = true,
                Message = "Item added to cart successfully.",
                Data = item
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartItemRequest request)
    {
        try
        {
            var item = await cartService.UpdateQuantityAsync(id, request.Quantity);
            if (item == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Cart item not found."
                });
            }

            return Ok(new ApiResponse<CartItemDetailDto>
            {
                Success = true,
                Message = "Cart item updated successfully.",
                Data = item
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveItem(Guid id)
    {
        var success = await cartService.RemoveItemAsync(id);
        if (!success)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Cart item not found."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Item removed from cart successfully."
        });
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart([FromQuery] Guid? userId, [FromQuery] string? sessionId)
    {
        var success = await cartService.ClearCartAsync(userId, sessionId);
        if (!success)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid request."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Cart cleared successfully."
        });
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateCart([FromBody] ValidateCartRequest request)
    {
        try
        {
            var cart = await cartService.ValidateCartAsync(request.UserId, request.SessionId);
            return Ok(new ApiResponse<CartSummaryDto>
            {
                Success = true,
                Message = "Cart validated successfully.",
                Data = cart
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message
            });
        }
    }

    [HttpPost("merge")]
    public async Task<IActionResult> MergeGuestCart([FromBody] MergeCartRequest request)
    {
        var success = await cartService.MergeGuestCartAsync(request.UserId, request.SessionId);
        if (!success)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to merge cart."
            });
        }

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Guest cart merged successfully."
        });
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCartCount([FromQuery] Guid? userId, [FromQuery] string? sessionId)
    {
        var count = await cartService.GetCartCountAsync(userId, sessionId);
        return Ok(new ApiResponse<int>
        {
            Success = true,
            Message = "Cart count retrieved successfully.",
            Data = count
        });
    }
}

public class ValidateCartRequest
{
    public Guid? UserId { get; set; }
    public string? SessionId { get; set; }
}
