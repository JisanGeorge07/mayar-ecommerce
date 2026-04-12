using System;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class TrustBadgeMapper
{
    public static TrustBadgeDto ToTrustBadgeDto(this TrustBadge trustBadge)
    {
        return new TrustBadgeDto
        {
            Id = trustBadge.Id,
            Key = trustBadge.Key,
            LabelEnglish = trustBadge.LabelEnglish,
            LabelArabic = trustBadge.LabelArabic,
            DescriptionEnglish = trustBadge.DescriptionEnglish,
            DescriptionArabic = trustBadge.DescriptionArabic,
            IconName = trustBadge.IconName
        };
    }
    public static TrustBadge ToTrustBadgeEntity(this TrustBadgeDto trustBadgeDto)
    {
        return new TrustBadge
        {
            Id = trustBadgeDto.Id,
            Key = trustBadgeDto.Key,
            LabelEnglish = trustBadgeDto.LabelEnglish,
            LabelArabic = trustBadgeDto.LabelArabic,
            DescriptionEnglish = trustBadgeDto.DescriptionEnglish,
            DescriptionArabic = trustBadgeDto.DescriptionArabic,
            IconName = trustBadgeDto.IconName
        };
    }
}
