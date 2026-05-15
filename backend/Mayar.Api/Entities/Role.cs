using System.ComponentModel.DataAnnotations;

namespace Mayar.Api.Entities
{
    public class Role
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<RolePermission> Permissions { get; set; } = new();
    }
}
