using System.ComponentModel.DataAnnotations;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        
        public Guid? UserId { get; set; }
        public User? User { get; set; }

        [Required]
        public string TitleEnglish { get; set; } = string.Empty;
        
        [Required]
        public string TitleArabic { get; set; } = string.Empty;

        [Required]
        public string MessageEnglish { get; set; } = string.Empty;

        [Required]
        public string MessageArabic { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // e.g., "new_order", "delivery", "promo", "account"

        public string Priority { get; set; } = "medium"; // low, medium, high, critical
        
        public bool IsRead { get; set; } = false;
        
        public bool IsConfirmed { get; set; } = false;
        public string? ConfirmedBy { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();
        
        public DateTime? ReadAt { get; set; }

        public string? ReferenceType { get; set; } // e.g., "Order"
        public string? ReferenceId { get; set; }

        public bool IsAdminNotification { get; set; }
        
        public string Status { get; set; } = "published"; // draft, published, scheduled
    }
}
