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
    [Authorize] // Should be restricted to users with specific permission in a real app
    public class RolesController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            var roles = await context.Roles
                .Include(r => r.Permissions)
                .ToListAsync();

            return Ok(roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                AllowedPaths = r.Permissions.Select(p => p.Path).ToList()
            }));
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto request)
        {
            var role = new Role
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Permissions = request.AllowedPaths.Select(path => new RolePermission
                {
                    Path = path
                }).ToList()
            };

            context.Roles.Add(role);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoles), new { id = role.Id }, new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                AllowedPaths = role.Permissions.Select(p => p.Path).ToList()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, UpdateRoleDto request)
        {
            var role = await context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null) return NotFound();

            role.Name = request.Name;
            role.Description = request.Description;

            // Simple way: clear and re-add permissions
            context.RolePermissions.RemoveRange(role.Permissions);
            role.Permissions = request.AllowedPaths.Select(path => new RolePermission
            {
                Path = path
            }).ToList();

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var role = await context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            // Check if any users are assigned to this role
            if (await context.Users.AnyAsync(u => u.RoleId == id))
            {
                return BadRequest(new { message = "Cannot delete role because users are assigned to it." });
            }

            context.Roles.Remove(role);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
