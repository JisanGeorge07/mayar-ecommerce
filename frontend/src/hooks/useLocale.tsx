import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { LanguageCode, CurrencyCode, Direction, TranslatedText } from '@/types';
import { currencies } from '@/data/mock/siteSettings';

interface LocaleContextValue {
  lang: LanguageCode;
  currency: CurrencyCode;
  dir: Direction;
  setLang: (lang: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  t: (text: TranslatedText) => string;
  formatPrice: (amount: number, currencyOverride?: CurrencyCode) => string;
  getPrice: (kwdPrice?: number, inrPrice?: number) => number;
  syncWithSettings: (enabledLanguages: LanguageCode[], enabledCurrencies: CurrencyCode[]) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('KWD');

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [dir, lang]);

  const t = useCallback(
    (text: TranslatedText) => text[lang] || text.en,
    [lang]
  );

  const formatPrice = useCallback(
    (amount: number, currencyOverride?: CurrencyCode) => {
      const curr = currencies[currencyOverride || currency];
      const formatted = amount.toFixed(curr.decimalPlaces);
      return `${curr.symbol} ${formatted}`;
    },
    [currency]
  );

  const getPrice = useCallback(
    (kwdPrice?: number, inrPrice?: number) => {
      if (currency === 'INR') {
        return inrPrice || 0;
      }
      return kwdPrice || 0;
    },
    [currency]
  );

  // Sync locale with settings - switch to enabled language/currency if current is disabled
  const syncWithSettings = useCallback(
    (enabledLanguages: LanguageCode[], enabledCurrencies: CurrencyCode[]) => {
      if (enabledLanguages.length > 0 && !enabledLanguages.includes(lang)) {
        setLangState(enabledLanguages[0]);
      }
      if (enabledCurrencies.length > 0 && !enabledCurrencies.includes(currency)) {
        setCurrency(enabledCurrencies[0]);
      }
    },
    [lang, currency]
  );

  return (
    <LocaleContext.Provider value={{ lang, currency, dir, setLang, setCurrency, t, formatPrice, getPrice, syncWithSettings }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
