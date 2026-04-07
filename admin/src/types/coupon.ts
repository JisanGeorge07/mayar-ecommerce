export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';
export type CouponScope = 'all' | 'categories' | 'products';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled';

export interface Coupon {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountCap?: number;
  minOrderAmount: number;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  firstOrderOnly: boolean;
  scope: CouponScope;
  scopeCategories?: string[];
  scopeProducts?: string[];
  status: CouponStatus;
  startDate?: string;
  endDate?: string;
  showInCartSuggestions: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
