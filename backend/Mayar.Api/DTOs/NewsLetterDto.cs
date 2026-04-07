using System;

namespace Mayar.Api.DTOs;

public class NewsLetterDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string? Email { get; set; }
    public DateTime SubscribedAt { get; set; }
    public bool IsActive { get; set; }
}
