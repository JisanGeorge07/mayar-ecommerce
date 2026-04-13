import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { wishlistApi, type WishlistDto } from '@/services/api/wishlistService';
import { useAuth } from './AuthContext';
import { useLocale } from '@/hooks/useLocale';

const STORAGE_KEY = 'mayar_wishlist';
const STORAGE_KEY_GUEST = 'mayar_wishlist_guest';

// Guest wishlist item structure (stores variant info for merging)
interface GuestWishlistItem {
  productId: string;
  productVariantId?: string;
}

// Item format expected by AccountWishlist component
export interface WishlistItem {
  id: string;
  productId: string;
  productVariantId: string;
  productSlug?: string;
  image: string;
  name: { en: string; ar: string };
  brand: { en: string; ar: string };
  colorName?: string;
  colorHex?: string;
  size?: string;
  price: number;
  compareAtPrice?: number;
}

interface WishlistContextValue {
  wishlistIds: string[];
  wishlistVariantIds: string[];
  wishlistItems: WishlistDto[];
  items: WishlistItem[];
  isInWishlist: (productId: string, variantId?: string) => boolean;
  toggleWishlist: (productId: string, productVariantId?: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => void;
  count: number;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const { lang, getPrice } = useLocale();
  const [wishlistItems, setWishlistItems] = useState<WishlistDto[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    // For non-logged-in users, use localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [wishlistVariantIds, setWishlistVariantIds] = useState<string[]>([]);
  const [guestWishlistItems, setGuestWishlistItems] = useState<GuestWishlistItem[]>(() => {
    // Load guest wishlist items with variant info
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GUEST);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);

  // Track previous login state to detect login transition
  const prevIsLoggedIn = useRef<boolean | null>(null);

  // Transform wishlistItems to the format expected by AccountWishlist
  const items = useMemo((): WishlistItem[] => {
    return wishlistItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productVariantId: item.productVariantId,
      productSlug: item.productSlug,
      image: item.imageUrl || '/placeholder.svg',
      name: {
        en: item.productNameEnglish || '',
        ar: item.productNameArabic || ''
      },
      brand: {
        en: item.brand || '',
        ar: item.brand || ''
      },
      colorName: lang === 'ar' ? item.colorNameArabic : item.colorNameEnglish,
      colorHex: item.colorHex,
      size: item.sizeLabel,
      price: getPrice(item.priceKWD, item.priceINR),
      compareAtPrice: item.compareAtPriceKWD || item.compareAtPriceINR
        ? getPrice(item.compareAtPriceKWD, item.compareAtPriceINR)
        : undefined
    }));
  }, [wishlistItems, lang, getPrice]);

  // Load wishlist from backend when user logs in
  const loadWishlist = useCallback(async () => {
    if (!user?.id || !isLoggedIn) return;

    setLoading(true);
    try {
      const response = await wishlistApi.getAllByUser(user.id);
      if (response.success && response.data) {
        setWishlistItems(response.data);
        setWishlistIds(response.data.map(item => item.productId));
        setWishlistVariantIds(response.data.map(item => item.productVariantId));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isLoggedIn]);

  // Merge guest wishlist items to user's wishlist
  const mergeGuestWishlist = useCallback(async () => {
    if (!user?.id || !isLoggedIn) return;

    // Get guest items from localStorage
    let guestItems: GuestWishlistItem[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GUEST);
      guestItems = stored ? JSON.parse(stored) : [];
    } catch {
      guestItems = [];
    }

    // If no guest items, just load user's wishlist
    if (guestItems.length === 0) {
      await loadWishlist();
      return;
    }

    // Add each guest item to user's wishlist
    for (const guestItem of guestItems) {
      try {
        await wishlistApi.create({
          userId: user.id,
          productId: guestItem.productId,
          productVariantId: guestItem.productVariantId,
        });
      } catch (error) {
        // Ignore errors for duplicates or invalid items
        console.error('Failed to merge wishlist item:', error);
      }
    }

    // Clear guest wishlist after merge
    localStorage.removeItem(STORAGE_KEY_GUEST);
    localStorage.removeItem(STORAGE_KEY);
    setGuestWishlistItems([]);

    // Refresh to get updated wishlist
    await loadWishlist();
  }, [user?.id, isLoggedIn, loadWishlist]);

  // Handle authentication changes
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      // User logged in
      if (prevIsLoggedIn.current === false) {
        // Just logged in - merge guest wishlist then load
        mergeGuestWishlist();
      } else {
        // Already logged in or initial load - just load
        loadWishlist();
      }
    } else if (prevIsLoggedIn.current === true && !isLoggedIn) {
      // User just logged OUT - clear wishlist
      setWishlistItems([]);
      setWishlistVariantIds([]);
      setWishlistIds([]);
      setGuestWishlistItems([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY_GUEST);
      } catch {
        // Ignore errors
      }
    } else if (!isLoggedIn) {
      // Guest user (initial load or staying as guest) - load from localStorage
      setWishlistItems([]);
      setWishlistVariantIds([]);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setWishlistIds(stored ? JSON.parse(stored) : []);
        const storedGuest = localStorage.getItem(STORAGE_KEY_GUEST);
        setGuestWishlistItems(storedGuest ? JSON.parse(storedGuest) : []);
      } catch {
        setWishlistIds([]);
        setGuestWishlistItems([]);
      }
    }

    // Track previous login state
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, user?.id, loadWishlist, mergeGuestWishlist]);

  // Save to localStorage for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
      localStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(guestWishlistItems));
    }
  }, [wishlistIds, guestWishlistItems, isLoggedIn]);

  const isInWishlist = useCallback((productId: string, variantId?: string) => {
    // If variantId is provided and user is logged in, check by variantId
    if (variantId && isLoggedIn) {
      return wishlistVariantIds.includes(variantId);
    }
    // For guests with variantId, check guest items
    if (variantId && !isLoggedIn) {
      return guestWishlistItems.some(item => item.productVariantId === variantId);
    }
    // Fallback to product-level check
    return wishlistIds.includes(productId);
  }, [wishlistIds, wishlistVariantIds, guestWishlistItems, isLoggedIn]);

  const toggleWishlist = useCallback(async (productId: string, productVariantId?: string) => {
    // Check if this specific variant is in wishlist (for logged-in users)
    const isVariantInWishlist = productVariantId && isLoggedIn && wishlistVariantIds.includes(productVariantId);
    const isProductInWishlist = wishlistIds.includes(productId);
    // For guests, also check by variant
    const isGuestVariantInWishlist = productVariantId && !isLoggedIn &&
      guestWishlistItems.some(item => item.productVariantId === productVariantId);

    if (isVariantInWishlist) {
      // Find the wishlist item to get its ID
      const wishlistItem = wishlistItems.find(item => item.productVariantId === productVariantId);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      }
    } else if (!isLoggedIn && (isGuestVariantInWishlist || (isProductInWishlist && !productVariantId))) {
      // For non-logged-in users, toggle by variant or product ID
      if (productVariantId) {
        setGuestWishlistItems(prev => prev.filter(item => item.productVariantId !== productVariantId));
        // Only remove productId if no other variants of this product are in guest wishlist
        const hasOtherVariants = guestWishlistItems.some(
          item => item.productId === productId && item.productVariantId !== productVariantId
        );
        if (!hasOtherVariants) {
          setWishlistIds(prev => prev.filter(id => id !== productId));
        }
      } else {
        setWishlistIds(prev => prev.filter(id => id !== productId));
        setGuestWishlistItems(prev => prev.filter(item => item.productId !== productId));
      }
    } else if (isLoggedIn && isProductInWishlist && !productVariantId) {
      // For logged-in users, if no variantId provided, remove all variants of this product
      if (user?.id) {
        // Find all variant IDs for this product in wishlist
        const variantIdsToRemove = wishlistItems
          .filter(item => item.productId === productId)
          .map(item => item.productVariantId);

        // Optimistically update UI
        setWishlistVariantIds(prev => prev.filter(id => !variantIdsToRemove.includes(id)));
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        setWishlistIds(prev => prev.filter(id => id !== productId));

        try {
          await wishlistApi.removeByUserAndProduct(user.id, productId);
        } catch (error) {
          console.error('Failed to remove all variants from wishlist:', error);
          // Revert by refreshing
          await loadWishlist();
        }
      }
    } else {
      // Adding to wishlist
      if (isLoggedIn && user?.id) {
        // Optimistically update UI
        setWishlistIds(prev => prev.includes(productId) ? prev : [...prev, productId]);
        if (productVariantId) {
          setWishlistVariantIds(prev => [...prev, productVariantId]);
        }

        try {
          const response = await wishlistApi.create({
            userId: user.id,
            productId,
            productVariantId,
          });
          if (response.success && response.data) {
            setWishlistItems(prev => [...prev, response.data]);
          }
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
          // Revert optimistic update on error
          if (productVariantId) {
            setWishlistVariantIds(prev => prev.filter(id => id !== productVariantId));
          }
          // Only remove productId if no other variants of this product are in wishlist
          const hasOtherVariants = wishlistItems.some(
            item => item.productId === productId && item.productVariantId !== productVariantId
          );
          if (!hasOtherVariants) {
            setWishlistIds(prev => prev.filter(id => id !== productId));
          }
        }
      } else {
        // Non-logged-in user - store both productId and variantId for later merge
        setWishlistIds(prev => prev.includes(productId) ? prev : [...prev, productId]);
        setGuestWishlistItems(prev => {
          // Check for duplicate (matching both product and variant)
          const isDuplicate = prev.some(
            item => item.productId === productId && item.productVariantId === productVariantId
          );
          if (isDuplicate) return prev;
          return [...prev, { productId, productVariantId }];
        });
      }
    }
  }, [isLoggedIn, user?.id, wishlistIds, wishlistVariantIds, wishlistItems, guestWishlistItems]);

  // Remove by wishlist item ID
  const removeFromWishlist = useCallback(async (id: string) => {
    if (isLoggedIn && user?.id) {
      // Find the wishlist item by ID
      const wishlistItem = wishlistItems.find(item => item.id === id);
      if (!wishlistItem) return;

      const { productId, productVariantId } = wishlistItem;

      // Optimistically update UI
      setWishlistVariantIds(prev => prev.filter(vid => vid !== productVariantId));
      setWishlistItems(prev => prev.filter(item => item.id !== id));

      // Check if this was the last variant of this product
      const remainingVariants = wishlistItems.filter(
        item => item.productId === productId && item.id !== id
      );
      if (remainingVariants.length === 0) {
        setWishlistIds(prev => prev.filter(pid => pid !== productId));
      }

      try {
        await wishlistApi.remove(id);
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        // Revert optimistic update on error
        setWishlistVariantIds(prev => [...prev, productVariantId]);
        setWishlistItems(prev => [...prev, wishlistItem]);
        setWishlistIds(prev => prev.includes(productId) ? prev : [...prev, productId]);
      }
    } else {
      // For non-logged-in users, remove by ID (which is productId in this case)
      setWishlistIds(prev => prev.filter(pid => pid !== id));
      setGuestWishlistItems(prev => prev.filter(item => item.productId !== id));
    }
  }, [isLoggedIn, user?.id, wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    setWishlistVariantIds([]);
    setWishlistItems([]);
    setGuestWishlistItems([]);
    if (!isLoggedIn) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_GUEST);
    }
  }, [isLoggedIn]);

  const refreshWishlist = useCallback(async () => {
    await loadWishlist();
  }, [loadWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistVariantIds,
        wishlistItems,
        items,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        count: isLoggedIn ? wishlistItems.length : guestWishlistItems.length,
        loading,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
