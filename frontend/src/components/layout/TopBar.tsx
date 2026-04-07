import { useEffect } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { siteSettings } from '@/data/mock/siteSettings';
import { useTrackingPopup } from '@/context/TrackingPopupContext';

const TopBar = () => {
  const { lang, currency, setLang, setCurrency, t, syncWithSettings } = useLocale();
  const { enabledLanguages, enabledCurrencies, isLoading, settings } = useSettings();
  const { open: openTracking } = useTrackingPopup();

  // Sync locale with settings when settings are loaded
  useEffect(() => {
    if (!isLoading) {
      syncWithSettings(enabledLanguages, enabledCurrencies);
    }
  }, [isLoading, enabledLanguages, enabledCurrencies, syncWithSettings]);

  return (
    <div className="bg-header text-header-foreground">
      <div className="container mx-auto max-w-7xl flex items-center justify-between h-9 text-xs px-4">
        {/* Trust message */}
        <p className="hidden md:block text-header-muted truncate">
          {t(siteSettings.trustMessage)}
        </p>

        {/* Right side links & switchers */}
        <div className="flex items-center gap-4 ms-auto">
          {/* Order Tracking link */}
          {settings?.enableOrderTracking && (
            <nav className="hidden lg:flex items-center gap-4">
              <button
                onClick={openTracking}
                className="text-header-muted hover:text-header-foreground transition-colors"
              >
                {lang === 'ar' ? 'تتبع الطلب' : 'Order Tracking'}
              </button>
            </nav>
          )}

          {/* Divider */}
          {settings?.enableOrderTracking && (
            <span className="hidden lg:block w-px h-3 bg-header-muted/30" />
          )}

          {/* Language switcher */}
          {enabledLanguages.length > 0 && (
            <div className="flex items-center gap-1">
              {enabledLanguages.map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium uppercase transition-colors ${lang === code
                    ? 'bg-header-foreground/15 text-header-foreground'
                    : 'text-header-muted hover:text-header-foreground'
                    }`}
                >
                  {code}
                </button>
              ))}
            </div>
          )}

          {/* Currency switcher */}
          {enabledCurrencies.length > 0 && (
            <div className="flex items-center gap-1">
              {enabledCurrencies.map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${currency === code
                    ? 'bg-header-foreground/15 text-header-foreground'
                    : 'text-header-muted hover:text-header-foreground'
                    }`}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
