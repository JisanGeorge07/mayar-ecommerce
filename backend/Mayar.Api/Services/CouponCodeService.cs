using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Enums;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class CouponCodeService(AppDbContext context) : ICouponCodeService
{
    public async Task<List<CouponCodeDto>> GetAllAsync()
    {
        var coupons = await context.CouponCodes
            .OrderBy(c => c.DisplayOrder)
            .ThenByDescending(c => c.CreatedAt)
            .ToListAsync();

        return coupons.Select(c => c.ToCouponCodeDto()).ToList();
    }

    public async Task<List<CouponCodeDto>> GetActiveAsync()
    {
        var now = DateTimeHelper.GetLocalTime();
        var coupons = await context.CouponCodes
            .Where(c => c.Status == CouponStatus.Active &&
                       (c.StartDate == null || c.StartDate <= now) &&
                       (c.EndDate == null || c.EndDate >= now))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return coupons.Select(c => c.ToCouponCodeDto()).ToList();
    }

    public async Task<List<CouponCodeDto>> GetCartSuggestionsAsync()
    {
        var now = DateTimeHelper.GetLocalTime();
        var coupons = await context.CouponCodes
            .Where(c => c.Status == CouponStatus.Active &&
                       c.ShowInCartSuggestions &&
                       (c.StartDate == null || c.StartDate <= now) &&
                       (c.EndDate == null || c.EndDate >= now))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return coupons.Select(c => c.ToCouponCodeDto()).ToList();
    }

    public async Task<CouponCodeDto?> GetByIdAsync(Guid id)
    {
        var coupon = await context.CouponCodes.FindAsync(id);
        return coupon?.ToCouponCodeDto();
    }

    public async Task<CouponCodeDto?> GetByCodeAsync(string code)
    {
        var coupon = await context.CouponCodes
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == code.ToUpper());
        return coupon?.ToCouponCodeDto();
    }

    public async Task<CouponCodeDto> CreateAsync(CouponCodeDto dto)
    {
        // Check if code already exists
        var existingCoupon = await context.CouponCodes
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.Code.ToUpper());

        if (existingCoupon != null)
        {
            throw new InvalidOperationException($"Coupon code '{dto.Code}' already exists.");
        }

        var coupon = dto.ToCouponCodeEntity();
        coupon.Id = Guid.NewGuid();
        coupon.Code = coupon.Code.ToUpper();
        coupon.UsedCount = 0;
        coupon.CreatedAt = DateTimeHelper.GetLocalTime();
        coupon.UpdatedAt = DateTimeHelper.GetLocalTime();

        context.CouponCodes.Add(coupon);
        await context.SaveChangesAsync();

        return coupon.ToCouponCodeDto();
    }

    public async Task<CouponCodeDto?> UpdateAsync(Guid id, CouponCodeDto dto)
    {
        var existingCoupon = await context.CouponCodes.FindAsync(id);
        if (existingCoupon == null)
        {
            return null;
        }

        // Check if code already exists for another coupon
        var duplicateCode = await context.CouponCodes
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.Code.ToUpper() && c.Id != id);

        if (duplicateCode != null)
        {
            throw new InvalidOperationException($"Coupon code '{dto.Code}' already exists.");
        }

        existingCoupon.Code = dto.Code.ToUpper();
        existingCoupon.NameEnglish = dto.NameEnglish;
        existingCoupon.NameArabic = dto.NameArabic;
        existingCoupon.DescriptionEnglish = dto.DescriptionEnglish;
        existingCoupon.DescriptionArabic = dto.DescriptionArabic;
        existingCoupon.DiscountType = dto.DiscountType;
        existingCoupon.DiscountValue = dto.DiscountValue;
        existingCoupon.MaxDiscountCap = dto.MaxDiscountCap;
        existingCoupon.MinOrderAmount = dto.MinOrderAmount;
        existingCoupon.UsageLimit = dto.UsageLimit;
        existingCoupon.UsageLimitPerCustomer = dto.UsageLimitPerCustomer;
        existingCoupon.FirstOrderOnly = dto.FirstOrderOnly;
        existingCoupon.Scope = dto.Scope;
        existingCoupon.ScopeCategories = dto.ScopeCategories == null || dto.ScopeCategories.Count == 0
            ? null
            : System.Text.Json.JsonSerializer.Serialize(dto.ScopeCategories);
        existingCoupon.ScopeProducts = dto.ScopeProducts == null || dto.ScopeProducts.Count == 0
            ? null
            : System.Text.Json.JsonSerializer.Serialize(dto.ScopeProducts);
        existingCoupon.Status = dto.Status;
        existingCoupon.StartDate = dto.StartDate;
        existingCoupon.EndDate = dto.EndDate;
        existingCoupon.ShowInCartSuggestions = dto.ShowInCartSuggestions;
        existingCoupon.DisplayOrder = dto.DisplayOrder;
        existingCoupon.UpdatedAt = DateTimeHelper.GetLocalTime();

        await context.SaveChangesAsync();

        return existingCoupon.ToCouponCodeDto();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var coupon = await context.CouponCodes.FindAsync(id);
        if (coupon == null)
        {
            return false;
        }

        context.CouponCodes.Remove(coupon);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ToggleStatusAsync(Guid id)
    {
        var coupon = await context.CouponCodes.FindAsync(id);
        if (coupon == null)
        {
            return false;
        }

        coupon.Status = coupon.Status == CouponStatus.Active
            ? CouponStatus.Inactive
            : CouponStatus.Active;
        coupon.UpdatedAt = DateTimeHelper.GetLocalTime();

        await context.SaveChangesAsync();

        return true;
    }

    public async Task<CouponValidationResponse> ValidateAsync(CouponValidationRequest request)
    {
        var coupon = await context.CouponCodes
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper());

        if (coupon == null)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = "Invalid coupon code."
            };
        }

        // Check if coupon is active
        if (coupon.Status != CouponStatus.Active)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = "This coupon is not active."
            };
        }

        // Check start date
        var now = DateTimeHelper.GetLocalTime();
        if (coupon.StartDate.HasValue && coupon.StartDate.Value > now)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = "This coupon is not yet valid."
            };
        }

        // Check end date
        if (coupon.EndDate.HasValue && coupon.EndDate.Value < now)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = "This coupon has expired."
            };
        }

        // Check minimum order amount
        if (request.CartTotal < coupon.MinOrderAmount)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = $"Minimum order amount is KWD {coupon.MinOrderAmount:F3}."
            };
        }

        // Check usage limit
        if (coupon.UsageLimit.HasValue && coupon.UsedCount >= coupon.UsageLimit.Value)
        {
            return new CouponValidationResponse
            {
                Valid = false,
                Message = "This coupon has reached its usage limit."
            };
        }

        // Check first order only (you may need to implement customer order history logic)
        if (coupon.FirstOrderOnly && request.CustomerId.HasValue)
        {
            var hasOrders = await context.Orders
                .AnyAsync(o => o.UserId == request.CustomerId.Value);

            if (hasOrders)
            {
                return new CouponValidationResponse
                {
                    Valid = false,
                    Message = "This coupon is only valid for first-time orders."
                };
            }
        }

        // Check per-customer usage limit (you may need to implement this based on order history)
        if (coupon.UsageLimitPerCustomer.HasValue && request.CustomerId.HasValue)
        {
            var customerUsageCount = await context.Orders
                .Where(o => o.UserId == request.CustomerId.Value && o.PromoCode == coupon.Code)
                .CountAsync();

            if (customerUsageCount >= coupon.UsageLimitPerCustomer.Value)
            {
                return new CouponValidationResponse
                {
                    Valid = false,
                    Message = "You have reached the usage limit for this coupon."
                };
            }
        }

        // Calculate discount
        decimal calculatedDiscount = 0;
        switch (coupon.DiscountType)
        {
            case DiscountType.Percentage:
                calculatedDiscount = request.CartTotal * (coupon.DiscountValue / 100);
                if (coupon.MaxDiscountCap.HasValue)
                {
                    calculatedDiscount = Math.Min(calculatedDiscount, coupon.MaxDiscountCap.Value);
                }
                break;

            case DiscountType.Fixed:
                calculatedDiscount = Math.Min(coupon.DiscountValue, request.CartTotal);
                break;

            case DiscountType.FreeShipping:
                // Discount will be applied to shipping cost
                calculatedDiscount = 0;
                break;
        }

        return new CouponValidationResponse
        {
            Valid = true,
            Message = "Coupon applied successfully!",
            CouponCodeId = coupon.Id,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            MaxCap = coupon.MaxDiscountCap,
            CalculatedDiscount = calculatedDiscount
        };
    }
}
