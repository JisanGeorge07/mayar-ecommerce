import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { recentlyViewedApi } from '@/services/api/recentlyViewedService';

const STORAGE_KEY = 'mayar_recently_viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const { user, isLoggedIn } = useAuth();
  // Start with empty array - will be populated from localStorage or backend
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn && !isLoaded) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setViewedIds(JSON.parse(stored));
        }
      } catch { /* ignore */ }
      setIsLoaded(true);
    }
  }, [isLoggedIn, isLoaded]);

  // Save to localStorage for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn && isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
      } catch { /* ignore */ }
    }
  }, [viewedIds, isLoggedIn, isLoaded]);

  // Load from backend when user logs in
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await recentlyViewedApi.getAllByUser(user.id, MAX_ITEMS);
          if (response.success && response.data) {
            setViewedIds(response.data.map(item => item.productId));
          } else {
            setViewedIds([]);
          }
        } catch (error) {
          console.error('Failed to load recently viewed:', error);
          setViewedIds([]);
        }
        setIsLoaded(true);
      }
    };

    loadRecentlyViewed();
  }, [isLoggedIn, user?.id]);

  const addViewed = useCallback(async (productId: string) => {
    // Optimistically update UI
    setViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });

    // Sync with backend if logged in
    if (isLoggedIn && user?.id) {
      try {
        await recentlyViewedApi.trackView({
          userId: user.id,
          productId,
        });
      } catch (error) {
        console.error('Failed to track product view:', error);
      }
    }
  }, [isLoggedIn, user?.id]);

  return { viewedIds, addViewed };
}
