using System;

namespace Mayar.Api.DTOs
{
    public class RecentlyViewedDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public DateTime ViewedAt { get; set; }
    }

    public class CreateRecentlyViewedRequest
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
