import api from '@/lib/axios';
import type { Coupon } from '@/types/coupon';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Backend DTO
interface CouponCodeDto {
  id: string;
  code: string;
  nameEnglish: string;
  nameArabic: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  maxDiscountCap?: number;
  minOrderAmount: number;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  firstOrderOnly: boolean;
  scope: 'all' | 'categories' | 'products';
  scopeCategories?: string[];
  scopeProducts?: string[];
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
  showInCartSuggestions: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Map backend enum values to frontend types
function mapDiscountType(backendType: any): 'percentage' | 'fixed' | 'free_shipping' {
  const typeMap: { [key: number]: 'percentage' | 'fixed' | 'free_shipping' } = {
    0: 'percentage',
    1: 'fixed',
    2: 'free_shipping',
  };

  // If it's a number, convert it
  if (typeof backendType === 'number') {
    return typeMap[backendType] || 'percentage';
  }

  // Otherwise assume it's already a string type
  return backendType as 'percentage' | 'fixed' | 'free_shipping';
}

function mapCouponScope(backendScope: any): 'all' | 'categories' | 'products' {
  const scopeMap: { [key: number]: 'all' | 'categories' | 'products' } = {
    0: 'all',
    1: 'categories',
    2: 'products',
  };

  // If it's a number, convert it
  if (typeof backendScope === 'number') {
    return scopeMap[backendScope] || 'all';
  }

  // Otherwise assume it's already a string type
  return backendScope as 'all' | 'categories' | 'products';
}

function mapCouponStatus(backendStatus: any): 'active' | 'inactive' {
  const statusMap: { [key: number]: 'active' | 'inactive' } = {
    0: 'active',
    1: 'inactive',
  };

  // If it's a number, convert it
  if (typeof backendStatus === 'number') {
    return statusMap[backendStatus] || 'inactive';
  }

  // Otherwise assume it's already a string type
  return backendStatus as 'active' | 'inactive';
}

// Mapping function from backend DTO to frontend Coupon
function mapDtoToCoupon(dto: any): Coupon {
  return {
    id: dto.id,
    code: dto.code,
    nameEn: dto.nameEnglish,
    nameAr: dto.nameArabic,
    descriptionEn: dto.descriptionEnglish,
    descriptionAr: dto.descriptionArabic,
    discountType: mapDiscountType(dto.discountType),
    discountValue: dto.discountValue,
    maxDiscountCap: dto.maxDiscountCap,
    minOrderAmount: dto.minOrderAmount,
    usageLimit: dto.usageLimit,
    usageLimitPerCustomer: dto.usageLimitPerCustomer,
    usedCount: dto.usedCount,
    firstOrderOnly: dto.firstOrderOnly,
    scope: mapCouponScope(dto.scope),
    scopeCategories: dto.scopeCategories,
    scopeProducts: dto.scopeProducts,
    status: mapCouponStatus(dto.status),
    startDate: dto.startDate,
    endDate: dto.endDate,
    showInCartSuggestions: dto.showInCartSuggestions,
    displayOrder: dto.displayOrder,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// Map frontend string types to backend enum integers
function mapToBackendDiscountType(type: 'percentage' | 'fixed' | 'free_shipping'): number {
  const typeMap: { [key: string]: number } = {
    percentage: 0,
    fixed: 1,
    free_shipping: 2,
  };
  return typeMap[type];
}

function mapToBackendCouponScope(scope: 'all' | 'categories' | 'products'): number {
  const scopeMap: { [key: string]: number } = {
    all: 0,
    categories: 1,
    products: 2,
  };
  return scopeMap[scope];
}

function mapToBackendCouponStatus(status: 'active' | 'inactive'): number {
  const statusMap: { [key: string]: number } = {
    active: 0,
    inactive: 1,
  };
  return statusMap[status];
}

// Mapping function from frontend Coupon to backend DTO
function mapCouponToDto(coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Partial<CouponCodeDto> {
  return {
    code: coupon.code,
    nameEnglish: coupon.nameEn,
    nameArabic: coupon.nameAr,
    descriptionEnglish: coupon.descriptionEn,
    descriptionArabic: coupon.descriptionAr,
    discountType: mapToBackendDiscountType(coupon.discountType) as any,
    discountValue: coupon.discountValue,
    maxDiscountCap: coupon.maxDiscountCap,
    minOrderAmount: coupon.minOrderAmount,
    usageLimit: coupon.usageLimit,
    usageLimitPerCustomer: coupon.usageLimitPerCustomer,
    firstOrderOnly: coupon.firstOrderOnly,
    scope: mapToBackendCouponScope(coupon.scope) as any,
    scopeCategories: coupon.scopeCategories,
    scopeProducts: coupon.scopeProducts,
    status: mapToBackendCouponStatus(coupon.status) as any,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    showInCartSuggestions: coupon.showInCartSuggestions,
    displayOrder: coupon.displayOrder,
  };
}

export const couponService = {
  async getAllCoupons(): Promise<Coupon[]> {
    try {
      const response = await api.get<ApiResponse<CouponCodeDto[]>>('/Coupon/get-all');
      if (response.data.success && response.data.data) {
        return response.data.data.map(mapDtoToCoupon);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      return [];
    }
  },

  async getCouponById(id: string): Promise<Coupon | null> {
    try {
      const response = await api.get<ApiResponse<CouponCodeDto>>(`/Coupon/get/${id}`);
      if (response.data.success && response.data.data) {
        return mapDtoToCoupon(response.data.data);
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch coupon:', error);
      return null;
    }
  },

  async createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<Coupon> {
    const dto = mapCouponToDto(coupon);
    const response = await api.post<ApiResponse<CouponCodeDto>>('/Coupon/create', dto);

    if (response.data.success && response.data.data) {
      return mapDtoToCoupon(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create coupon');
  },

  async updateCoupon(id: string, coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<Coupon> {
    const dto = mapCouponToDto(coupon);
    const response = await api.put<ApiResponse<CouponCodeDto>>(`/Coupon/update/${id}`, dto);

    if (response.data.success && response.data.data) {
      return mapDtoToCoupon(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to update coupon');
  },

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/Coupon/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      return false;
    }
  },

  async toggleCouponStatus(id: string): Promise<boolean> {
    try {
      const response = await api.patch<ApiResponse<object>>(`/Coupon/toggle-status/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to toggle coupon status:', error);
      return false;
    }
  },
};
