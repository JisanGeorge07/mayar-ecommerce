namespace Mayar.Api.DTOs
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string TitleEnglish { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string MessageEnglish { get; set; } = string.Empty;
        public string MessageArabic { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public bool IsRead { get; set; }
        public bool IsConfirmed { get; set; }
        public string? ConfirmedBy { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public string? ReferenceType { get; set; }
        public string? ReferenceId { get; set; }
        public bool IsAdminNotification { get; set; }
        public string Status { get; set; } = "published";
    }

    public class CreateNotificationDto
    {
        public Guid? UserId { get; set; }
        public string TitleEnglish { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string MessageEnglish { get; set; } = string.Empty;
        public string MessageArabic { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public string? ReferenceType { get; set; }
        public string? ReferenceId { get; set; }
        public bool IsAdminNotification { get; set; }
        public string Status { get; set; } = "published";
    }
}
