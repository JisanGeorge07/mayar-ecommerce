using Mayar.Api.Common;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mayar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SettingsController(ISettingsService settingsService) : ControllerBase
{
    // Feature Settings Endpoints
    [HttpGet("get-settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await settingsService.GetSettingsAsync();
        return Ok(new ApiResponse<FeatureSettingsDto>
        {
            Success = true,
            Message = "Settings retrieved successfully.",
            Data = settings
        });
    }

    [HttpPut("update-settings")]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateFeatureSettingsDto dto)
    {
        var settings = await settingsService.UpdateSettingsAsync(dto);
        return Ok(new ApiResponse<FeatureSettingsDto>
        {
            Success = true,
            Message = "Settings updated successfully.",
            Data = settings
        });
    }

    [HttpGet("page-visibility")]
    public async Task<IActionResult> GetPageVisibility()
    {
        var visibility = await settingsService.GetPageVisibilityAsync();
        return Ok(new ApiResponse<Dictionary<string, string>>
        {
            Success = true,
            Message = "Page visibility retrieved successfully.",
            Data = visibility
        });
    }

    // Checkout Countries Endpoints
    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await settingsService.GetCountriesAsync();
        return Ok(new ApiResponse<List<CheckoutCountryDto>>
        {
            Success = true,
            Message = "Countries retrieved successfully.",
            Data = countries
        });
    }

    [HttpGet("countries/{id}")]
    public async Task<IActionResult> GetCountryById(Guid id)
    {
        var country = await settingsService.GetCountryByIdAsync(id);
        if (country == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Country not found."
            });
        }
        return Ok(new ApiResponse<CheckoutCountryDto>
        {
            Success = true,
            Message = "Country retrieved successfully.",
            Data = country
        });
    }

    [HttpPost("countries")]
    public async Task<IActionResult> CreateCountry([FromBody] CreateCheckoutCountryDto dto)
    {
        var country = await settingsService.CreateCountryAsync(dto);
        return CreatedAtAction(nameof(GetCountryById), new { id = country.Id },
            new ApiResponse<CheckoutCountryDto>
            {
                Success = true,
                Message = "Country created successfully.",
                Data = country
            });
    }

    [HttpPut("countries/{id}")]
    public async Task<IActionResult> UpdateCountry(Guid id, [FromBody] UpdateCheckoutCountryDto dto)
    {
        var country = await settingsService.UpdateCountryAsync(id, dto);
        if (country == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Country not found."
            });
        }
        return Ok(new ApiResponse<CheckoutCountryDto>
        {
            Success = true,
            Message = "Country updated successfully.",
            Data = country
        });
    }

    [HttpDelete("countries/{id}")]
    public async Task<IActionResult> DeleteCountry(Guid id)
    {
        var result = await settingsService.DeleteCountryAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Country not found."
            });
        }
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Country deleted successfully."
        });
    }

    // Checkout Address Fields Endpoints
    [HttpGet("address-fields/{countryId}")]
    public async Task<IActionResult> GetAddressFields(Guid countryId)
    {
        var fields = await settingsService.GetAddressFieldsAsync(countryId);
        return Ok(new ApiResponse<List<CheckoutAddressFieldDto>>
        {
            Success = true,
            Message = "Address fields retrieved successfully.",
            Data = fields
        });
    }

    [HttpGet("address-field/{id}")]
    public async Task<IActionResult> GetAddressFieldById(Guid id)
    {
        var field = await settingsService.GetAddressFieldByIdAsync(id);
        if (field == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Address field not found."
            });
        }
        return Ok(new ApiResponse<CheckoutAddressFieldDto>
        {
            Success = true,
            Message = "Address field retrieved successfully.",
            Data = field
        });
    }

    [HttpPost("address-fields")]
    public async Task<IActionResult> CreateAddressField([FromBody] CreateCheckoutAddressFieldDto dto)
    {
        var field = await settingsService.CreateAddressFieldAsync(dto);
        return CreatedAtAction(nameof(GetAddressFieldById), new { id = field.Id },
            new ApiResponse<CheckoutAddressFieldDto>
            {
                Success = true,
                Message = "Address field created successfully.",
                Data = field
            });
    }

    [HttpPut("address-fields/{id}")]
    public async Task<IActionResult> UpdateAddressField(Guid id, [FromBody] UpdateCheckoutAddressFieldDto dto)
    {
        var field = await settingsService.UpdateAddressFieldAsync(id, dto);
        if (field == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Address field not found."
            });
        }
        return Ok(new ApiResponse<CheckoutAddressFieldDto>
        {
            Success = true,
            Message = "Address field updated successfully.",
            Data = field
        });
    }

    [HttpDelete("address-fields/{id}")]
    public async Task<IActionResult> DeleteAddressField(Guid id)
    {
        var result = await settingsService.DeleteAddressFieldAsync(id);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Address field not found."
            });
        }
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Address field deleted successfully."
        });
    }
}
