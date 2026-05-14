using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId);
        Task<IEnumerable<NotificationDto>> GetAdminNotificationsAsync();
        Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto);
        Task<bool> MarkAsReadAsync(Guid notificationId);
        Task<bool> MarkAllAsReadAsync(Guid? userId, bool isAdmin);
        Task<bool> ConfirmNotificationAsync(Guid notificationId, string confirmedBy);
        Task<bool> DeleteNotificationAsync(Guid notificationId);
        Task<int> GetUnreadCountAsync(Guid? userId, bool isAdmin);
    }
}
