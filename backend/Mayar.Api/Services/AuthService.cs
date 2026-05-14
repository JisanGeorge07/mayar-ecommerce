using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Mayar.Api.Services
{
    public class AuthService(
        AppDbContext context,
        IConfiguration configuration,
        IEmailService emailService,
        INotificationService notificationService,
        ILogger<AuthService> logger) : IAuthService
    {
        public async Task<UserResponseDto?> RegisterAsync(UserRegisterDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Country = request.Country,
                PinCode = request.PinCode
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            logger.LogInformation("User registered: {UserId}", user.Id);

            // Send Welcome Notification
            await notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = user.Id,
                TitleEnglish = "Welcome to Mayar!",
                TitleArabic = "مرحباً في ميار!",
                MessageEnglish = "Your account has been created successfully. Start shopping now!",
                MessageArabic = "تم إنشاء حسابك بنجاح. ابدأ التسوق الآن!",
                Type = "account",
                Priority = "medium",
                IsAdminNotification = false
            });

            // Notify Admin of new customer
            await notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                TitleEnglish = "New Customer Registered",
                TitleArabic = "تم تسجيل عميل جديد",
                MessageEnglish = $"{user.Name} ({user.Email}) has created a new account.",
                MessageArabic = $"قام {user.Name} ({user.Email}) بإنشاء حساب جديد.",
                Type = "new_customer",
                Priority = "low",
                IsAdminNotification = true,
                ReferenceType = "User",
                ReferenceId = user.Id.ToString()
            });

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Country = user.Country,
                PinCode = user.PinCode,
            };
        }

        public async Task<TokenResponseDto?> LoginAsync(string email, string password)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            logger.LogInformation("User logged in: {UserId}", user.Id);
            return await CreateTokenResponse(user);
        }

        public async Task<TokenResponseDto?> AdminLoginAsync(string email, string password)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }

            if (user.Role != "Admin")
            {
                logger.LogWarning("Non-admin user attempted admin login: {UserId}", user.Id);
                return null;
            }

            logger.LogInformation("Admin logged in: {UserId}", user.Id);
            return await CreateTokenResponse(user);
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user is null)
            {
                return null;
            }
            return await CreateTokenResponse(user);
        }

        public async Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null || !CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(user.RefreshToken ?? ""),
                Encoding.UTF8.GetBytes(refreshToken)))
            {
                return false;
            }
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(Guid userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null)
                return null;

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Country = user.Country,
                PinCode = user.PinCode,
            };
        }

        public async Task<UserResponseDto?> UpdateUserAsync(Guid userId, UserUpdateDto request)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null)
                return null;

            user.Name = request.Name;
            user.PhoneNumber = request.PhoneNumber;
            user.Address = request.Address;
            user.Country = request.Country;
            user.PinCode = request.PinCode;

            await context.SaveChangesAsync();
            logger.LogInformation("User profile updated: {UserId}", user.Id);

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Country = user.Country,
                PinCode = user.PinCode,
            };
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                // Return true to avoid email enumeration
                return true;
            }

            var token = Guid.NewGuid().ToString();
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiry = DateTimeHelper.GetLocalTime().AddHours(1);

            await context.SaveChangesAsync();

            var success = await emailService.SendPasswordResetEmailAsync(user.Email, token);
            return success;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => 
                u.PasswordResetToken == request.Token && 
                u.PasswordResetTokenExpiry > DateTimeHelper.GetLocalTime());

            if (user == null)
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            // Also revoke refresh tokens for security
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            await context.SaveChangesAsync();
            logger.LogInformation("Password reset successful for user: {UserId}", user.Id);

            return true;
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                UserId = user.Id,
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role)
            };

            if (!string.IsNullOrEmpty(user.PhoneNumber))
                claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTimeHelper.GetLocalTime().AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTimeHelper.GetLocalTime().AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null
                || !CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(user.RefreshToken ?? ""),
                    Encoding.UTF8.GetBytes(refreshToken))
                || user.RefreshTokenExpiryTime <= DateTimeHelper.GetLocalTime())
            {
                return null;
            }
            return user;
        }
    }
}
