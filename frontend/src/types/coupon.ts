export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';

export interface CouponInfo {
  id?: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  calculatedDiscount: number;
  maxCap?: number;
}
