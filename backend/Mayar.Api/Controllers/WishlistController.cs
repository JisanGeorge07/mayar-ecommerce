using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController(IWishlistService wishlistService) : ControllerBase
    {
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllByUser(Guid userId)
        {
            var wishlists = await wishlistService.GetAllByUserAsync(userId);
            return Ok(new ApiResponse<List<WishlistDto>>
            {
                Success = true,
                Message = "Wishlist retrieved successfully.",
                Data = wishlists
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var wishlist = await wishlistService.GetByIdAsync(id);
            if (wishlist == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Wishlist item not found."
                });
            }

            return Ok(new ApiResponse<WishlistDto>
            {
                Success = true,
                Message = "Wishlist item retrieved successfully.",
                Data = wishlist
            });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateWishlistRequest request)
        {
            try
            {
                var created = await wishlistService.CreateAsync(request.UserId, request.ProductVariantId);
                return CreatedAtAction(nameof(GetById), new { id = created.Id },
                    new ApiResponse<WishlistDto>
                    {
                        Success = true,
                        Message = "Product added to wishlist successfully.",
                        Data = created
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
        public async Task<IActionResult> Remove(Guid id)
        {
            var success = await wishlistService.RemoveAsync(id);
            if (!success)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Wishlist item not found."
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Product removed from wishlist successfully."
            });
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveByUserAndProduct([FromQuery] Guid userId, [FromQuery] Guid productId)
        {
            var success = await wishlistService.RemoveByUserAndProductAsync(userId, productId);
            if (!success)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Wishlist item not found."
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Product removed from wishlist successfully."
            });
        }

        [HttpGet("check")]
        public async Task<IActionResult> IsInWishlist([FromQuery] Guid userId, [FromQuery] Guid productId)
        {
            var isInWishlist = await wishlistService.IsInWishlistAsync(userId, productId);
            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Message = isInWishlist ? "Product is in wishlist." : "Product is not in wishlist.",
                Data = isInWishlist
            });
        }

        [HttpGet("check-variant")]
        public async Task<IActionResult> IsVariantInWishlist([FromQuery] Guid userId, [FromQuery] Guid productVariantId)
        {
            var isInWishlist = await wishlistService.IsVariantInWishlistAsync(userId, productVariantId);
            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Message = isInWishlist ? "Variant is in wishlist." : "Variant is not in wishlist.",
                Data = isInWishlist
            });
        }
    }

    public class CreateWishlistRequest
    {
        public Guid UserId { get; set; }
        public Guid ProductVariantId { get; set; }
    }
}
