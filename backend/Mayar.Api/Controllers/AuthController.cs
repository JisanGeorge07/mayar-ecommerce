using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, ILogger<AuthController> logger) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> Register(UserRegisterDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest(new { message = "User with this email already exists." });
            }
            logger.LogInformation("User registered: {UserId}", user.Id);
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginDto request)
        {
            var result = await authService.LoginAsync(request.Email, request.Password);
            if (result is null)
            {
                return BadRequest(new { message = "Invalid email or password." });
            }
            return Ok(result);
        }

        [HttpPost("admin/login")]
        public async Task<ActionResult<TokenResponseDto>> AdminLogin(LoginDto request)
        {
            var result = await authService.AdminLoginAsync(request.Email, request.Password);
            if (result is null)
            {
                return Unauthorized(new { message = "Invalid credentials or insufficient permissions." });
            }
            logger.LogInformation("Admin login successful");
            return Ok(result);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokensAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
            {
                return Unauthorized("Invalid refresh token.");
            }
            return Ok(result);
        }

        [Authorize]
        [HttpGet("checkAuth")]
        public async Task<IActionResult> CheckAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.Identity?.Name;
            var user = await authService.GetUserByIdAsync(Guid.Parse(userId!));
            return Ok(new
            {
                success = true,
                user = new
                {
                    id = userId,
                    name = username,
                    email = user?.Email,
                    role = user?.Role,
                    phoneNumber = user?.PhoneNumber,
                    address = user?.Address,
                    country = user?.Country,
                    pinCode = user?.PinCode,
                }
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid user ID" });

            var success = await authService.RevokeRefreshTokenAsync(userId, request.RefreshToken);
            if (!success)
            {
                return BadRequest(new { message = "Failed to revoke refresh token" });
            }
            logger.LogInformation("User logged out: {UserId}", userId);
            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<ActionResult<UserResponseDto>> UpdateProfile([FromBody] UserUpdateDto request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid user ID" });

            var user = await authService.UpdateUserAsync(userId, request);
            if (user is null)
            {
                return NotFound(new { message = "User not found" });
            }

            logger.LogInformation("User profile updated: {UserId}", userId);
            return Ok(new
            {
                success = true,
                message = "Profile updated successfully",
                data = user
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            var success = await authService.ForgotPasswordAsync(request.Email);
            if (!success)
            {
                return BadRequest(new { message = "Failed to send reset link." });
            }
            return Ok(new { message = "If an account exists with this email, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            var success = await authService.ResetPasswordAsync(request);
            if (!success)
            {
                return BadRequest(new { message = "Invalid or expired token." });
            }
            return Ok(new { message = "Password reset successful." });
        }
    }
}
