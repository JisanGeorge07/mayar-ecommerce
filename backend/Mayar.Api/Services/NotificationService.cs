using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(AppDbContext context, ILogger<NotificationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsAdminNotification && n.Status == "published")
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(n => n.ToDto());
        }

        public async Task<IEnumerable<NotificationDto>> GetAdminNotificationsAsync()
        {
            var notifications = await _context.Notifications
                .Where(n => n.IsAdminNotification && n.Status == "published")
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(n => n.ToDto());
        }

        public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto)
        {
            var notification = dto.ToEntity();
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Notification created: {Id} for {UserType}", 
                notification.Id, dto.IsAdminNotification ? "Admin" : $"User {dto.UserId}");

            return notification.ToDto();
        }

        public async Task<bool> MarkAsReadAsync(Guid notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            notification.IsRead = true;
            notification.ReadAt = DateTimeHelper.GetLocalTime();
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(Guid? userId, bool isAdmin)
        {
            var query = _context.Notifications.Where(n => !n.IsRead);
            
            if (isAdmin)
            {
                query = query.Where(n => n.IsAdminNotification);
            }
            else if (userId.HasValue)
            {
                query = query.Where(n => n.UserId == userId.Value && !n.IsAdminNotification);
            }
            else
            {
                return false;
            }

            var unreadNotifications = await query.ToListAsync();
            foreach (var n in unreadNotifications)
            {
                n.IsRead = true;
                n.ReadAt = DateTimeHelper.GetLocalTime();
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ConfirmNotificationAsync(Guid notificationId, string confirmedBy)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            notification.IsConfirmed = true;
            notification.ConfirmedAt = DateTimeHelper.GetLocalTime();
            notification.ConfirmedBy = confirmedBy;
            notification.IsRead = true;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNotificationAsync(Guid notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(Guid? userId, bool isAdmin)
        {
            var query = _context.Notifications.Where(n => !n.IsRead && n.Status == "published");

            if (isAdmin)
            {
                query = query.Where(n => n.IsAdminNotification);
            }
            else if (userId.HasValue)
            {
                query = query.Where(n => n.UserId == userId.Value && !n.IsAdminNotification);
            }
            else
            {
                return 0;
            }

            return await query.CountAsync();
        }
    }
}
