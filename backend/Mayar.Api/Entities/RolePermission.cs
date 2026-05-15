using System.ComponentModel.DataAnnotations;

namespace Mayar.Api.Entities
{
    public class RolePermission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid RoleId { get; set; }

        public Role Role { get; set; } = null!;

        [Required]
        public string Path { get; set; } = string.Empty;
    }
}
