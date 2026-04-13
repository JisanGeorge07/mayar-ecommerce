import type { TranslatedText } from './index';

export interface CartItem {
  id: string; // Frontend composite ID (productId_colorId_sizeId)
  backendId?: string; // Backend Guid for API calls
  productId: string;
  productSlug: string;
  variantId?: string;
  name: TranslatedText;
  image: string;
  brand?: TranslatedText;
  color?: string;
  colorHex?: string;
  size?: string;
  quantity: number;
  unitPrice: number; // KWD
  compareAtPrice?: number; // KWD
  unitPriceINR: number; // INR
  compareAtPriceINR?: number; // INR
  inStock: boolean;
  maxQuantity: number;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}
