import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { CartItem } from '@/types/cart';
import type { ProductItem } from '@/types/product';
import type { CouponInfo, DiscountType } from '@/types/coupon';
import {
  saveCart,
  getCartCount,
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
  mergeGuestCartApi,
  getSessionId,
} from '@/services/api/cartService';
import { couponService, type CouponSuggestion } from '@/services/api/couponService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { useLocale } from '@/hooks/useLocale';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode: string;
  promoApplied: boolean;
  promoError: string;
  promoLoading: boolean;
  couponInfo: CouponInfo | null;
  couponSuggestions: CouponSuggestion[];
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, opts?: { colorId?: string; sizeId?: string; quantity?: number }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
  removePromo: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const { getPrice } = useLocale();
  const userId = user?.id;
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);
  const [couponSuggestions, setCouponSuggestions] = useState<CouponSuggestion[]>([]);

  // Track previous login state to detect logout vs initial guest load
  const prevIsLoggedIn = useRef<boolean | null>(null);

  // Fetch coupon suggestions on mount
  useEffect(() => {
    const loadCouponSuggestions = async () => {
      try {
        const suggestions = await couponService.getCartSuggestions();
        setCouponSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to load coupon suggestions:', error);
      }
    };
    loadCouponSuggestions();
  }, []);

  // Currency-aware subtotal calculation
  const getCartSubtotalCurrency = useCallback((cartItems: CartItem[]): number => {
    return cartItems.reduce((sum, item) => {
      const price = getPrice(item.unitPrice, item.unitPriceINR);
      return sum + (price * item.quantity);
    }, 0);
  }, [getPrice]);

  // Refresh cart from backend (works for both guests and logged-in users)
  const refreshCart = useCallback(async () => {
    try {
      // For logged-in users, pass userId; for guests, pass undefined (cartService uses sessionId)
      const cart = await fetchCart(isLoggedIn ? userId : undefined);
      setItems(cart.items);
      saveCart(cart);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  }, [userId, isLoggedIn]);

  // Handle authentication changes
  useEffect(() => {
    if (isLoggedIn && userId) {
      // User logged in - merge guest cart and refresh
      const sessionId = getSessionId();
      // Only merge if user just logged in (was a guest before)
      if (sessionId && prevIsLoggedIn.current === false) {
        // Merge guest cart with user cart
        mergeGuestCartApi(userId, sessionId)
          .then(() => {
            refreshCart();
          })
          .catch((error) => {
            console.error('Failed to merge cart:', error);
            refreshCart();
          });
      } else {
        // Just refresh cart from backend
        refreshCart();
      }
    } else if (prevIsLoggedIn.current === true && !isLoggedIn) {
      // User just logged OUT - clear cart
      setItems([]);
      setPromoCode('');
      setPromoApplied(false);
      setPromoError('');
      setCouponInfo(null);
      try {
        localStorage.removeItem('mayar_cart');
      } catch {
        // Ignore errors
      }
    } else if (!isLoggedIn) {
      // Guest user (initial load or staying as guest) - load guest cart
      refreshCart();
    }

    // Track previous login state
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, userId, refreshCart]);

  // Save to localStorage only when user is authenticated or for guest users (not immediately after logout)
  useEffect(() => {
    if (isLoggedIn || items.length > 0) {
      saveCart({ items, updatedAt: Date.now() });
    }
  }, [items, isLoggedIn]);

  const addToCart = useCallback(async (
    product: ProductItem,
    opts?: { colorId?: string; sizeId?: string; quantity?: number }
  ) => {
    const qty = opts?.quantity || 1;

    try {
      // Call backend API (pass userId for logged-in users, undefined for guests)
      const addedItem = await addToCartApi(
        product.id,
        opts?.colorId,
        opts?.sizeId,
        qty,
        isLoggedIn ? userId : undefined
      );

      // Update local state
      setItems(prev => {
        const existing = prev.find(i => i.id === addedItem.id);
        if (existing) {
          return prev.map(i => (i.id === addedItem.id ? addedItem : i));
        }
        return [...prev, addedItem];
      });

      toast({
        title: 'Added to Cart',
        description: product.name.en,
        duration: 2500,
      });
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [userId, isLoggedIn]);

  const removeFromCart = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item?.backendId) {
      // Local-only item, just remove from state
      setItems(prev => prev.filter(i => i.id !== itemId));
      return;
    }

    try {
      await removeFromCartApi(item.backendId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [items]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item?.backendId) {
      // Local-only item, just update state
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i))
      );
      return;
    }

    try {
      const updatedItem = await updateCartItemApi(item.backendId, quantity);
      setItems(prev => prev.map(i => (i.id === itemId ? updatedItem : i)));
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update quantity',
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [items, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      await clearCartApi(isLoggedIn ? userId : undefined);
      setItems([]);
      setPromoCode('');
      setPromoApplied(false);
      setPromoError('');
      setCouponInfo(null);
      toast({
        title: 'Cart Cleared',
        description: 'All items removed from cart',
        duration: 2500,
      });
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      // Fallback to local clear
      setItems([]);
      setPromoCode('');
      setPromoApplied(false);
      setPromoError('');
      setCouponInfo(null);
    }
  }, [userId, isLoggedIn]);

  // Re-validate coupon when subtotal changes (to recalculate discount)
  const currentSubtotal = getCartSubtotalCurrency(items);
  useEffect(() => {
    const revalidateCoupon = async () => {
      if (promoApplied && promoCode && currentSubtotal > 0) {
        try {
          const response = await couponService.validateCoupon(
            promoCode,
            currentSubtotal,
            userId
          );
          if (response.valid && response.calculatedDiscount !== undefined) {
            setCouponInfo({
              id: response.couponCodeId,
              code: promoCode,
              discountType: mapBackendDiscountType(response.discountType),
              discountValue: response.discountValue || 0,
              calculatedDiscount: response.calculatedDiscount,
              maxCap: response.maxCap,
            });
          } else {
            // Coupon no longer valid (e.g., cart total below minimum)
            setPromoApplied(false);
            setPromoError(response.message);
            setCouponInfo(null);
          }
        } catch (error) {
          console.error('Failed to revalidate coupon:', error);
        }
      }
    };
    revalidateCoupon();
  }, [currentSubtotal, promoApplied, promoCode, userId]);

  const applyPromo = useCallback(async (code: string) => {
    const upper = code.trim().toUpperCase();
    if (!upper) {
      setPromoError('Please enter a promo code');
      return;
    }

    setPromoLoading(true);
    setPromoError('');

    try {
      const subtotal = getCartSubtotalCurrency(items);
      const response = await couponService.validateCoupon(upper, subtotal, userId);

      if (response.valid) {
        setPromoCode(upper);
        setPromoApplied(true);
        setPromoError('');
        setCouponInfo({
          id: response.couponCodeId,
          code: upper,
          discountType: mapBackendDiscountType(response.discountType),
          discountValue: response.discountValue || 0,
          calculatedDiscount: response.calculatedDiscount || 0,
          maxCap: response.maxCap,
        });

        // Show appropriate toast based on discount type
        let discountMsg = '';
        if (response.discountType === 0) {
          discountMsg = `${response.discountValue}% discount applied`;
        } else if (response.discountType === 1) {
          discountMsg = `KWD ${response.discountValue?.toFixed(3)} discount applied`;
        } else if (response.discountType === 2) {
          discountMsg = 'Free shipping applied';
        }

        toast({
          title: 'Promo Applied',
          description: discountMsg || response.message,
          duration: 2500,
        });
      } else {
        setPromoError(response.message);
        setPromoApplied(false);
        setCouponInfo(null);
      }
    } catch (error: any) {
      console.error('Failed to apply promo:', error);
      setPromoError(error.message || 'Failed to validate promo code');
      setPromoApplied(false);
      setCouponInfo(null);
    } finally {
      setPromoLoading(false);
    }
  }, [items, getCartSubtotalCurrency, userId]);

  const removePromo = useCallback(() => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
    setCouponInfo(null);
  }, []);

  const count = getCartCount(items);
  const subtotal = getCartSubtotalCurrency(items);
  // Use calculated discount from backend, or 0 if no coupon applied
  const discount = couponInfo?.calculatedDiscount || 0;
  // Free shipping logic: free if coupon is free_shipping type, or if subtotal >= 15
  const isFreeShippingCoupon = couponInfo?.discountType === 'free_shipping';
  const shipping = subtotal > 0 ? (isFreeShippingCoupon || subtotal >= 15 ? 0 : 2.5) : 0;
  const total = subtotal - discount + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        discount,
        shipping,
        total,
        promoCode,
        promoApplied,
        promoError,
        promoLoading,
        couponInfo,
        couponSuggestions,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Helper function to map backend discount type to frontend type
function mapBackendDiscountType(backendType: number | undefined): DiscountType {
  if (backendType === undefined) return 'percentage';
  const typeMap: { [key: number]: DiscountType } = {
    0: 'percentage',
    1: 'fixed',
    2: 'free_shipping',
  };
  return typeMap[backendType] || 'percentage';
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
