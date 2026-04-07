using System.ComponentModel.DataAnnotations;

namespace Mayar.Api.DTOs
{
    public class UserUpdateDto
    {
        [Required, MinLength(2), MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Phone]
        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }
        public string? Country { get; set; }
        public string? PinCode { get; set; }
    }
}
