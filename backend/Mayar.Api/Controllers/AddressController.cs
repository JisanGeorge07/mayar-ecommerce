using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AddressController(IAddressService addressService, ILogger<AddressController> logger) : ControllerBase
    {
        private Guid GetUserId()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                throw new UnauthorizedAccessException("Invalid user ID");
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddresses()
        {
            try
            {
                var userId = GetUserId();
                var addresses = await addressService.GetUserAddressesAsync(userId);
                return Ok(addresses);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDto>> GetAddress(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var address = await addressService.GetAddressByIdAsync(id, userId);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                return Ok(address);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressDto dto)
        {
            try
            {
                var userId = GetUserId();
                var address = await addressService.CreateAddressAsync(userId, dto);
                logger.LogInformation("Address created for user: {UserId}", userId);
                return CreatedAtAction(nameof(GetAddress), new { id = address.Id }, address);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AddressDto>> UpdateAddress(Guid id, [FromBody] UpdateAddressDto dto)
        {
            try
            {
                var userId = GetUserId();
                var address = await addressService.UpdateAddressAsync(id, userId, dto);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                logger.LogInformation("Address updated: {AddressId} for user: {UserId}", id, userId);
                return Ok(address);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var success = await addressService.DeleteAddressAsync(id, userId);

                if (!success)
                    return NotFound(new { message = "Address not found" });

                logger.LogInformation("Address deleted: {AddressId} for user: {UserId}", id, userId);
                return Ok(new { message = "Address deleted successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }

        [HttpPost("{id}/set-default")]
        public async Task<IActionResult> SetDefaultAddress(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var success = await addressService.SetDefaultAddressAsync(id, userId);

                if (!success)
                    return NotFound(new { message = "Address not found" });

                logger.LogInformation("Default address set: {AddressId} for user: {UserId}", id, userId);
                return Ok(new { message = "Default address set successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid user ID" });
            }
        }
    }
}
