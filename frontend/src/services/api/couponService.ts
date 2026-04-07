import api from '@/lib/axios';
import type { DiscountType } from '@/types/coupon';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Backend DTO types
interface CouponCodeDto {
  id: string;
  code: string;
  nameEnglish: string;
  nameArabic: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  discountType: number; // Enum: 0=Percentage, 1=Fixed, 2=FreeShipping
  discountValue: number;
  maxDiscountCap?: number;
  minOrderAmount: number;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  firstOrderOnly: boolean;
  scope: number; // Enum: 0=All, 1=Categories, 2=Products
  scopeCategories?: string[];
  scopeProducts?: string[];
  status: number; // Enum: 0=Active, 1=Inactive
  startDate?: string;
  endDate?: string;
  showInCartSuggestions: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationRequest {
  code: string;
  cartTotal: number;
  customerId?: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  couponCodeId?: string;
  discountType?: number;
  discountValue?: number;
  maxCap?: number;
  calculatedDiscount?: number;
}

export interface CouponSuggestion {
  code: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
}

// Map backend enum to frontend DiscountType
function mapDiscountType(backendType: number): DiscountType {
  const typeMap: { [key: number]: DiscountType } = {
    0: 'percentage',
    1: 'fixed',
    2: 'free_shipping',
  };
  return typeMap[backendType] || 'percentage';
}

// Map backend coupon to suggestion
function mapCouponToSuggestion(dto: CouponCodeDto): CouponSuggestion {
  return {
    code: dto.code,
    nameEn: dto.nameEnglish,
    nameAr: dto.nameArabic,
    descriptionEn: dto.descriptionEnglish,
    descriptionAr: dto.descriptionArabic,
    discountType: mapDiscountType(dto.discountType),
    discountValue: dto.discountValue,
    minOrderAmount: dto.minOrderAmount,
  };
}

export const couponService = {
  /**
   * Get cart suggestions - coupons that should be displayed in the cart
   */
  async getCartSuggestions(): Promise<CouponSuggestion[]> {
    try {
      const response = await api.get<ApiResponse<CouponCodeDto[]>>('/Coupon/get-cart-suggestions');
      if (response.data.success && response.data.data) {
        return response.data.data.map(mapCouponToSuggestion);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch coupon suggestions:', error);
      return [];
    }
  },

  /**
   * Validate a coupon code
   * @param code - The coupon code to validate
   * @param cartTotal - The current cart subtotal
   * @param customerId - Optional customer ID for logged-in users
   * @returns Validation response with discount details
   */
  async validateCoupon(
    code: string,
    cartTotal: number,
    customerId?: string
  ): Promise<CouponValidationResponse> {
    try {
      const request: CouponValidationRequest = {
        code: code.toUpperCase(),
        cartTotal,
        customerId,
      };

      const response = await api.post<ApiResponse<CouponValidationResponse>>(
        '/Coupon/validate',
        request
      );

      if (response.data.data) {
        return response.data.data;
      }

      // Fallback if data is missing
      return {
        valid: false,
        message: response.data.message || 'Invalid coupon code',
      };
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      return {
        valid: false,
        message: error.response?.data?.message || 'Failed to validate coupon',
      };
    }
  },

  /**
   * Calculate discount amount based on validation response
   * @param response - The validation response from the backend
   * @param cartTotal - The cart subtotal
   * @returns The calculated discount amount
   */
  calculateDiscount(response: CouponValidationResponse, cartTotal: number): number {
    if (!response.valid || response.calculatedDiscount === undefined) {
      return 0;
    }

    // Backend already calculated the discount, so just return it
    return response.calculatedDiscount;
  },
};
