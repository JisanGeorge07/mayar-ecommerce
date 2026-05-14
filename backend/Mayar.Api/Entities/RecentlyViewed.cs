using System;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class RecentlyViewed
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public DateTime ViewedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
