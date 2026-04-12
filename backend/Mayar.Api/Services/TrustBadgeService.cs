using System;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class TrustBadgeService(AppDbContext context) : ITrustBadgeService
{
    public async Task<List<TrustBadgeDto>> GetAllTrustBadgesAsync()
    {
        var trustBadges = await context.TrustBadges.ToListAsync();
        return trustBadges.Select(tb => tb.ToTrustBadgeDto()).ToList();
    }
}
