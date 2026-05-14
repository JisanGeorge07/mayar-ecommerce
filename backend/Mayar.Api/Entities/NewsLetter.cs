using System;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class NewsLetter
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string? Email { get; set; }
    public DateTime SubscribedAt { get; set; } = DateTimeHelper.GetLocalTime();
    public bool IsActive { get; set; } = true;
}
