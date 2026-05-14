using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Mayar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetUserNotifications()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAdminNotifications()
        {
            var notifications = await _notificationService.GetAdminNotificationsAsync();
            return Ok(notifications);
        }

        [Authorize]
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var result = await _notificationService.MarkAsReadAsync(id);
            if (!result) return NotFound();
            return Ok();
        }

        [Authorize]
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] bool isAdmin = false)
        {
            if (isAdmin && !User.IsInRole("Admin")) return Forbid();

            Guid? userId = null;
            if (!isAdmin)
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdStr, out var uId)) return Unauthorized();
                userId = uId;
            }

            await _notificationService.MarkAllAsReadAsync(userId, isAdmin);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmNotification(Guid id)
        {
            var confirmedBy = User.FindFirstValue(ClaimTypes.Name) ?? "Admin";
            var result = await _notificationService.ConfirmNotificationAsync(id, confirmedBy);
            if (!result) return NotFound();
            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var result = await _notificationService.DeleteNotificationAsync(id);
            if (!result) return NotFound();
            return Ok();
        }

        [Authorize]
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount([FromQuery] bool isAdmin = false)
        {
            if (isAdmin && !User.IsInRole("Admin")) return Forbid();

            Guid? userId = null;
            if (!isAdmin)
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdStr, out var uId)) return Unauthorized();
                userId = uId;
            }

            var count = await _notificationService.GetUnreadCountAsync(userId, isAdmin);
            return Ok(count);
        }
    }
}
