using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponseDto?> RegisterAsync(UserRegisterDto request);
        Task<TokenResponseDto?> LoginAsync(string email, string password);
        Task<TokenResponseDto?> AdminLoginAsync(string email, string password);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
        Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken);
        Task<UserResponseDto?> GetUserByIdAsync(Guid userId);
        Task<UserResponseDto?> UpdateUserAsync(Guid userId, UserUpdateDto request);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(ResetPasswordDto request);
    }
}
