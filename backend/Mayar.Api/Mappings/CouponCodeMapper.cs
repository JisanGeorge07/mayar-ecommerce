using System;
using System.Text.Json;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings;

public static class CouponCodeMapper
{
    public static CouponCodeDto ToCouponCodeDto(this CouponCode entity)
    {
        return new CouponCodeDto
        {
            Id = entity.Id,
            Code = entity.Code,
            NameEnglish = entity.NameEnglish,
            NameArabic = entity.NameArabic,
            DescriptionEnglish = entity.DescriptionEnglish,
            DescriptionArabic = entity.DescriptionArabic,
            DiscountType = entity.DiscountType,
            DiscountValue = entity.DiscountValue,
            MaxDiscountCap = entity.MaxDiscountCap,
            MinOrderAmount = entity.MinOrderAmount,
            UsageLimit = entity.UsageLimit,
            UsageLimitPerCustomer = entity.UsageLimitPerCustomer,
            UsedCount = entity.UsedCount,
            FirstOrderOnly = entity.FirstOrderOnly,
            Scope = entity.Scope,
            ScopeCategories = string.IsNullOrEmpty(entity.ScopeCategories)
                ? null
                : JsonSerializer.Deserialize<List<string>>(entity.ScopeCategories),
            ScopeProducts = string.IsNullOrEmpty(entity.ScopeProducts)
                ? null
                : JsonSerializer.Deserialize<List<string>>(entity.ScopeProducts),
            Status = entity.Status,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            ShowInCartSuggestions = entity.ShowInCartSuggestions,
            DisplayOrder = entity.DisplayOrder,
            CreatedAt = DateTime.SpecifyKind(entity.CreatedAt, DateTimeKind.Utc),
            UpdatedAt = DateTime.SpecifyKind(entity.UpdatedAt, DateTimeKind.Utc)
        };
    }

    public static CouponCode ToCouponCodeEntity(this CouponCodeDto dto)
    {
        return new CouponCode
        {
            Id = dto.Id,
            Code = dto.Code.ToUpper(),
            NameEnglish = dto.NameEnglish,
            NameArabic = dto.NameArabic,
            DescriptionEnglish = dto.DescriptionEnglish,
            DescriptionArabic = dto.DescriptionArabic,
            DiscountType = dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            MaxDiscountCap = dto.MaxDiscountCap,
            MinOrderAmount = dto.MinOrderAmount,
            UsageLimit = dto.UsageLimit,
            UsageLimitPerCustomer = dto.UsageLimitPerCustomer,
            UsedCount = dto.UsedCount,
            FirstOrderOnly = dto.FirstOrderOnly,
            Scope = dto.Scope,
            ScopeCategories = dto.ScopeCategories == null || dto.ScopeCategories.Count == 0
                ? null
                : JsonSerializer.Serialize(dto.ScopeCategories),
            ScopeProducts = dto.ScopeProducts == null || dto.ScopeProducts.Count == 0
                ? null
                : JsonSerializer.Serialize(dto.ScopeProducts),
            Status = dto.Status,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ShowInCartSuggestions = dto.ShowInCartSuggestions,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt
        };
    }
}
