using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface ICouponCodeService
{
    Task<List<CouponCodeDto>> GetAllAsync();
    Task<List<CouponCodeDto>> GetActiveAsync();
    Task<List<CouponCodeDto>> GetCartSuggestionsAsync();
    Task<CouponCodeDto?> GetByIdAsync(Guid id);
    Task<CouponCodeDto?> GetByCodeAsync(string code);
    Task<CouponCodeDto> CreateAsync(CouponCodeDto dto);
    Task<CouponCodeDto?> UpdateAsync(Guid id, CouponCodeDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleStatusAsync(Guid id);
    Task<CouponValidationResponse> ValidateAsync(CouponValidationRequest request);
}
