using System;

namespace Mayar.Api.Entities;

public class ProductFeature
{
    public Guid Id { get; set;}
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public Guid TrustBadgeId { get; set; }
    public TrustBadge TrustBadge { get; set; } = null!;
    public bool IsActive { get; set; }
}
