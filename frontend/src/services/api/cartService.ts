import type { CartItem, CartState } from '@/types/cart';
import api from '@/lib/axios';

const CART_STORAGE_KEY = 'mayar_cart';
const SESSION_ID_KEY = 'mayar_session_id';

// ==================== Session Management ====================

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_ID_KEY);
};

// ==================== Backend API Types ====================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendCartItem {
  id: string;
  productId: string;
  productSlug?: string;
  productNameEnglish?: string;
  productNameArabic?: string;
  brandEnglish?: string;
  brandArabic?: string;
  imageUrl?: string;
  productVariantId?: string;
  productColorId?: string;
  colorNameEnglish?: string;
  colorNameArabic?: string;
  colorHex?: string;
  productSizeId?: string;
  sizeLabel?: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  unitPriceINR: number;
  compareAtPriceINR?: number;
  inStock: boolean;
  maxQuantity?: number;
  currentPrice: number;
  currentPriceINR: number;
  priceChanged: boolean;
  updatedAt: string;
}

interface BackendCartSummary {
  items: BackendCartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  hasPriceChanges: boolean;
  hasStockIssues: boolean;
}

// ==================== DTO Mapping ====================

const mapBackendToCartItem = (item: BackendCartItem): CartItem => ({
  id: `${item.productId}_${item.productColorId || 'default'}_${item.productSizeId || 'default'}`,
  backendId: item.id,
  productId: item.productId,
  productSlug: item.productSlug || '',
  variantId: item.productVariantId,
  name: {
    en: item.productNameEnglish || '',
    ar: item.productNameArabic || '',
  },
  image: item.imageUrl || '',
  brand: {
    en: item.brandEnglish || '',
    ar: item.brandArabic || '',
  },
  color: item.colorNameEnglish,
  colorHex: item.colorHex,
  size: item.sizeLabel,
  quantity: item.quantity,
  unitPrice: item.currentPrice,
  compareAtPrice: item.compareAtPrice,
  unitPriceINR: item.currentPriceINR,
  compareAtPriceINR: item.compareAtPriceINR,
  inStock: item.inStock,
  maxQuantity: item.maxQuantity || 99,
});

// ==================== API Functions ====================

export const fetchCart = async (userId?: string): Promise<CartState> => {
  try {
    const sessionId = userId ? undefined : getSessionId();
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (sessionId) params.append('sessionId', sessionId);

    const response = await api.get<ApiResponse<BackendCartSummary>>(`/Cart/get?${params}`);

    if (response.data.success) {
      return {
        items: response.data.data.items.map(mapBackendToCartItem),
        updatedAt: Date.now(),
      };
    }
    throw new Error(response.data.message);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    // Fallback to localStorage
    return loadCart();
  }
};

export const addToCartApi = async (
  productId: string,
  colorId?: string,
  sizeId?: string,
  quantity: number = 1,
  userId?: string
): Promise<CartItem> => {
  const sessionId = userId ? undefined : getSessionId();

  const response = await api.post<ApiResponse<BackendCartItem>>('/Cart/add', {
    productId,
    productColorId: colorId || null,
    productSizeId: sizeId || null,
    quantity,
    userId: userId || null,
    sessionId: sessionId || null,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return mapBackendToCartItem(response.data.data);
};

export const updateCartItemApi = async (
  backendId: string,
  quantity: number
): Promise<CartItem> => {
  const response = await api.put<ApiResponse<BackendCartItem>>(`/Cart/update/${backendId}`, {
    quantity,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return mapBackendToCartItem(response.data.data);
};

export const removeFromCartApi = async (backendId: string): Promise<void> => {
  const response = await api.delete<ApiResponse<void>>(`/Cart/remove/${backendId}`);

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
};

export const clearCartApi = async (userId?: string): Promise<void> => {
  const sessionId = userId ? undefined : getSessionId();
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (sessionId) params.append('sessionId', sessionId);

  const response = await api.delete<ApiResponse<void>>(`/Cart/clear?${params}`);

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
};

export const mergeGuestCartApi = async (userId: string, sessionId: string): Promise<void> => {
  const response = await api.post<ApiResponse<void>>('/Cart/merge', {
    userId,
    sessionId,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  clearSessionId();
};

export const validateCartApi = async (userId?: string): Promise<CartState> => {
  const sessionId = userId ? undefined : getSessionId();

  const response = await api.post<ApiResponse<BackendCartSummary>>('/Cart/validate', {
    userId: userId || null,
    sessionId: sessionId || null,
  });

  if (response.data.success) {
    return {
      items: response.data.data.items.map(mapBackendToCartItem),
      updatedAt: Date.now(),
    };
  }
  throw new Error(response.data.message);
};

export const getCartCountApi = async (userId?: string): Promise<number> => {
  try {
    const sessionId = userId ? undefined : getSessionId();
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (sessionId) params.append('sessionId', sessionId);

    const response = await api.get<ApiResponse<number>>(`/Cart/count?${params}`);

    if (response.data.success) {
      return response.data.data;
    }
    return 0;
  } catch (error) {
    console.error('Failed to fetch cart count:', error);
    return 0;
  }
};

// ==================== Local Storage Functions (Fallback) ====================

export const loadCart = (): CartState => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return { items: [], updatedAt: Date.now() };
};

export const saveCart = (state: CartState): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
};

export const getCartCount = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const getCartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

export const getCartTotal = (items: CartItem[]): number =>
  getCartSubtotal(items);
