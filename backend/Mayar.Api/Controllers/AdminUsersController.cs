using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminUsersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAdminUsers()
        {
            var users = await context.Users
                .Include(u => u.RoleEntity)
                .ThenInclude(r => r!.Permissions)
                .Where(u => u.RoleEntity != null && u.RoleEntity.Name != "User")
                .ToListAsync();

            return Ok(users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.RoleEntity?.Name ?? u.Role,
                RoleId = u.RoleId,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                Country = u.Country,
                PinCode = u.PinCode,
                AllowedPaths = u.RoleEntity?.Permissions.Select(p => p.Path).ToList() ?? new List<string>()
            }));
        }

        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateAdminUser(CreateAdminUserDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "User with this email already exists." });
            }

            var role = await context.Roles.FindAsync(request.RoleId);
            if (role == null) return BadRequest(new { message = "Invalid role ID." });

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = role.Name,
                RoleId = role.Id
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdminUsers), new { id = user.Id }, new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = role.Name,
                RoleId = role.Id,
                AllowedPaths = new List<string>() // Initially empty, will be loaded if needed
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdminUser(Guid id, UpdateAdminUserDto request)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var role = await context.Roles.FindAsync(request.RoleId);
            if (role == null) return BadRequest(new { message = "Invalid role ID." });

            user.Name = request.Name;
            user.Email = request.Email;
            user.Role = role.Name;
            user.RoleId = role.Id;

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdminUser(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
