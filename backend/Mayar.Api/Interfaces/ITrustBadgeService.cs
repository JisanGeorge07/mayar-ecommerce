using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface ITrustBadgeService
{
   Task<List<TrustBadgeDto>> GetAllTrustBadgesAsync();
}
