import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsService, FeatureSettings } from '@/services/api/settingsService';
import type { LanguageCode, CurrencyCode } from '@/types';

interface SettingsContextValue {
  settings: FeatureSettings | null;
  isLoading: boolean;
  error: string | null;
  enabledLanguages: LanguageCode[];
  enabledCurrencies: CurrencyCode[];
}

const defaultSettings: FeatureSettings = {
  enableEnglish: true,
  enableArabic: true,
  enableKwd: true,
  enableInr: true,
  enableWishlist: true,
  enableReviews: true,
  enableOrderTracking: false,
  enableNewsletter: false,
  enableMyAccount: true,
  enableGuestCheckout: true,
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  isLoading: true,
  error: null,
  enabledLanguages: ['en', 'ar'],
  enabledCurrencies: ['KWD', 'INR'],
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FeatureSettings | null>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load settings');
        // Keep default settings on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Compute enabled languages based on settings
  const enabledLanguages: LanguageCode[] = [];
  if (settings?.enableEnglish) enabledLanguages.push('en');
  if (settings?.enableArabic) enabledLanguages.push('ar');
  // Ensure at least one language is enabled
  if (enabledLanguages.length === 0) enabledLanguages.push('en');

  // Compute enabled currencies based on settings
  const enabledCurrencies: CurrencyCode[] = [];
  if (settings?.enableKwd) enabledCurrencies.push('KWD');
  if (settings?.enableInr) enabledCurrencies.push('INR');
  // Ensure at least one currency is enabled
  if (enabledCurrencies.length === 0) enabledCurrencies.push('KWD');

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, enabledLanguages, enabledCurrencies }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
