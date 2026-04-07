using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController(IContactService contactService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetContact()
        {
            var contact = await contactService.GetContactAsync();
            return Ok(new ApiResponse<ContactDto>
            {
                Success = true,
                Message = "Contact information retrieved successfully.",
                Data = contact
            });
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateContact([FromBody] ContactDto contactDto)
        {
            var result = await contactService.UpdateContactAsync(contactDto);
            return Ok(new ApiResponse<ContactDto>
            {
                Success = true,
                Message = "Contact information updated successfully.",
                Data = result
            });
        }
    }
}
