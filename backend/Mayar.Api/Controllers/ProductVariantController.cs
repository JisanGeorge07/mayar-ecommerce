using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantController(IProductVariantService variantService) : ControllerBase
    {
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var variant = await variantService.GetByIdAsync(id);
            if (variant == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Product variant not found." });
            }
            return Ok(new ApiResponse<ProductVariantDto> { Success = true, Message = "Product variant retrieved successfully.", Data = variant });
        }

        [HttpGet("get-by-product/{productId}")]
        public async Task<IActionResult> GetByProductId(Guid productId)
        {
            var variants = await variantService.GetByProductIdAsync(productId);
            return Ok(new ApiResponse<List<ProductVariantDto>> { Success = true, Message = "Product variants retrieved successfully.", Data = variants });
        }

        [HttpGet("get-by-color-size")]
        public async Task<IActionResult> GetByColorAndSize([FromQuery] Guid productId, [FromQuery] Guid colorId, [FromQuery] Guid sizeId)
        {
            var variant = await variantService.GetByColorAndSizeAsync(productId, colorId, sizeId);
            if (variant == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Product variant not found." });
            }
            return Ok(new ApiResponse<ProductVariantDto> { Success = true, Message = "Product variant retrieved successfully.", Data = variant });
        }

        [HttpGet("available/{productId}")]
        public async Task<IActionResult> GetAvailableVariants(Guid productId)
        {
            var variants = await variantService.GetAvailableVariantsAsync(productId);
            return Ok(new ApiResponse<List<ProductVariantDto>> { Success = true, Message = "Available variants retrieved successfully.", Data = variants });
        }

        [HttpGet("low-stock-count")]
        public async Task<IActionResult> GetLowStockCount([FromQuery] int threshold = 5)
        {
            var count = await variantService.GetLowStockCountAsync(threshold);
            return Ok(new ApiResponse<int> { Success = true, Message = "Low stock count retrieved successfully.", Data = count });
        }

        [HttpPost("check-stock")]
        public async Task<IActionResult> CheckStock([FromBody] CheckStockRequest request)
        {
            var available = await variantService.CheckStockAsync(request.VariantId, request.Quantity);
            return Ok(new ApiResponse<bool> { Success = true, Message = available ? "Stock available." : "Insufficient stock.", Data = available });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] ProductVariantDto dto)
        {
            try
            {
                var variant = await variantService.CreateAsync(dto);
                return Ok(new ApiResponse<ProductVariantDto> { Success = true, Message = "Product variant created successfully.", Data = variant });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] ProductVariantDto dto)
        {
            try
            {
                var variant = await variantService.UpdateAsync(id, dto);
                if (variant == null)
                {
                    return NotFound(new ApiResponse<object> { Success = false, Message = "Product variant not found." });
                }
                return Ok(new ApiResponse<ProductVariantDto> { Success = true, Message = "Product variant updated successfully.", Data = variant });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await variantService.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound(new ApiResponse<object> { Success = false, Message = "Product variant not found." });
                }
                return Ok(new ApiResponse<object> { Success = true, Message = "Product variant deleted successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
            }
        }
    }

    public class CheckStockRequest
    {
        public Guid VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
