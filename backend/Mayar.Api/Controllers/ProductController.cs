using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var products = await productService.GetAllAsync();
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "Products retrieved successfully.", Data = products });
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
            }
            return Ok(new ApiResponse<ProductDto> { Success = true, Message = "Product retrieved successfully.", Data = product });
        }

        [HttpPost("get-by-ids")]
        public async Task<IActionResult> GetByIds([FromBody] List<Guid> ids)
        {
            if (ids == null || ids.Count == 0)
            {
                return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "No IDs provided.", Data = new List<ProductDto>() });
            }
            var products = await productService.GetByIdsAsync(ids);
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "Products retrieved successfully.", Data = products });
        }

        [HttpGet("get-by-slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await productService.GetBySlugAsync(slug);
            if (product == null)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
            }
            return Ok(new ApiResponse<ProductDto> { Success = true, Message = "Product retrieved successfully.", Data = product });
        }

        [HttpGet("best-sellers")]
        public async Task<IActionResult> GetBestSellers()
        {
            var products = await productService.GetBestSellersAsync();
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "Best sellers retrieved successfully.", Data = products });
        }

        [HttpGet("new-arrivals")]
        public async Task<IActionResult> GetNewArrivals()
        {
            var products = await productService.GetNewArrivalsAsync();
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "New arrivals retrieved successfully.", Data = products });
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured()
        {
            var products = await productService.GetFeaturedAsync();
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "Featured products retrieved successfully.", Data = products });
        }

        [HttpGet("on-sale")]
        public async Task<IActionResult> GetOnSale()
        {
            var products = await productService.GetOnSaleAsync();
            return Ok(new ApiResponse<List<ProductDto>> { Success = true, Message = "Sale products retrieved successfully.", Data = products });
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetFiltered([FromBody] ProductFilterDto filter)
        {
            var result = await productService.GetFilteredAsync(filter);
            return Ok(new ApiResponse<PaginatedResult<ProductDto>> { Success = true, Message = "Products filtered successfully.", Data = result });
        }

        [HttpGet("shop-data")]
        public async Task<IActionResult> GetShopData()
        {
            var result = await productService.GetShopDataAsync();
            return Ok(new ApiResponse<ShopDataDto> { Success = true, Message = "Shop data retrieved successfully.", Data = result });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] ProductDto productDto)
        {
            var product = await productService.CreateAsync(productDto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id },
                new ApiResponse<ProductDto>
                {
                    Success = true,
                    Message = "Product created successfully.",
                    Data = product
                });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] ProductDto productDto)
        {
            var product = await productService.UpdateAsync(id, productDto);
            if (product == null)
            {
                return NotFound(new ApiResponse<ProductDto> { Success = false, Message = "Product not found." });
            }
            return Ok(new ApiResponse<ProductDto> { Success = true, Message = "Product updated successfully.", Data = product });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await productService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new ApiResponse<object> { Success = false, Message = "Product not found." });
            }
            return Ok(new ApiResponse<object> { Success = true, Message = "Product deleted successfully.", Data = result });
        }
    }
}
