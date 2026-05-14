using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities
{
    public class Address
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        public string Label { get; set; } = string.Empty;

        public bool IsDefault { get; set; } = false;

        [Required]
        public string Area { get; set; } = string.Empty;

        [Required]
        public string Block { get; set; } = string.Empty;

        [Required]
        public string Street { get; set; } = string.Empty;

        [Required]
        public string Building { get; set; } = string.Empty;

        public string? Floor { get; set; }

        public string? FlatOffice { get; set; }

        public string? Notes { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();

        public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();
    }
}
