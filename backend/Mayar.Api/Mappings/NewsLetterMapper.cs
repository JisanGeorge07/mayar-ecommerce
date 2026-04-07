using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class NewsLetterMapper
{
    public static NewsLetterDto ToNewsLetterDto(this NewsLetter entity)
    {
        return new NewsLetterDto
        {
            Id = entity.Id,
            UserId = entity.UserId,
            Email = entity.Email,
            SubscribedAt = entity.SubscribedAt,
            IsActive = entity.IsActive
        };
    }

    public static NewsLetter ToNewsLetterEntity(this NewsLetterDto dto)
    {
        return new NewsLetter
        {
            Id = dto.Id,
            UserId = dto.UserId,
            Email = dto.Email,
            SubscribedAt = dto.SubscribedAt,
            IsActive = dto.IsActive
        };
    }
}
