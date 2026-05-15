using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Helpers;

namespace Mayar.Api.Mappings
{
    public static class NotificationMapper
    {
        public static NotificationDto ToDto(this Notification entity)
        {
            if (entity == null) return null!;

            return new NotificationDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                TitleEnglish = entity.TitleEnglish,
                TitleArabic = entity.TitleArabic,
                MessageEnglish = entity.MessageEnglish,
                MessageArabic = entity.MessageArabic,
                Type = entity.Type,
                Priority = entity.Priority,
                IsRead = entity.IsRead,
                CreatedAt = entity.CreatedAt,
                ReadAt = entity.ReadAt,
                ReferenceType = entity.ReferenceType,
                ReferenceId = entity.ReferenceId,
                IsAdminNotification = entity.IsAdminNotification,
                Status = entity.Status,
                IsConfirmed = entity.IsConfirmed,
                ConfirmedBy = entity.ConfirmedBy,
                ConfirmedAt = entity.ConfirmedAt
            };
        }

        public static Notification ToEntity(this CreateNotificationDto dto)
        {
            if (dto == null) return null!;

            return new Notification
            {
                Id = Guid.NewGuid(),
                UserId = dto.UserId,
                TitleEnglish = dto.TitleEnglish,
                TitleArabic = dto.TitleArabic,
                MessageEnglish = dto.MessageEnglish,
                MessageArabic = dto.MessageArabic,
                Type = dto.Type,
                Priority = dto.Priority,
                IsRead = false,
                CreatedAt = DateTimeHelper.GetLocalTime(),
                ReferenceType = dto.ReferenceType,
                ReferenceId = dto.ReferenceId,
                IsAdminNotification = dto.IsAdminNotification,
                Status = dto.Status
            };
        }
    }
}
