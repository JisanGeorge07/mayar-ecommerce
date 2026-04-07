import { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useTrackingPopup } from '@/context/TrackingPopupContext';
import { useNavbarItems, type GeneratedMegaMenu } from '@/hooks/useCatalog';
import { User, Heart, ChevronDown, Package, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu = () => {
  const { t, lang, currency, setLang, setCurrency } = useLocale();
  const { isLoggedIn } = useAuth();
  const { settings, enabledLanguages, enabledCurrencies } = useSettings();
  const { open: openTracking } = useTrackingPopup();
  const [expandedNav, setExpandedNav] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const { navItems } = useNavbarItems();

  const toggleNav = (id: string) => {
    setExpandedNav(expandedNav === id ? null : id);
    setExpandedSection(null);
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-5 py-4 border-b border-border">
        <span className="text-xl font-heading font-bold text-foreground">Mayar</span>
        <span className="text-xl font-heading font-light text-brand ms-1">Shop</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(item => (
          <MobileNavItem
            key={item.id}
            item={item}
            isExpanded={expandedNav === item.id}
            expandedSection={expandedSection}
            onToggle={() => toggleNav(item.id)}
            onToggleSection={toggleSection}
            t={t}
          />
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4 space-y-3">
        <div className="flex items-center gap-4">
          {settings?.enableMyAccount && (
            isLoggedIn ? (
              <Link to="/account" className="flex items-center gap-2 text-sm text-foreground">
                <User size={16} /> {lang === 'ar' ? 'حسابي' : 'My Account'}
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm text-foreground">
                <LogIn size={16} /> {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
            )
          )}
          {settings?.enableWishlist && (
            <Link to={isLoggedIn ? '/account?section=wishlist' : '/login'} className="flex items-center gap-2 text-sm text-foreground">
              <Heart size={16} /> {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
            </Link>
          )}
        </div>
        {settings?.enableOrderTracking && (
          <button onClick={openTracking} className="flex items-center gap-2 text-sm text-foreground">
            <Package size={16} /> {lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
          </button>
        )}

        <div className="flex items-center gap-4">
          {enabledLanguages.length > 0 && (
            <div className="flex items-center gap-1">
              {enabledLanguages.map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-2 py-1 rounded text-xs font-medium uppercase ${lang === code ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                    }`}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
          {enabledCurrencies.length > 0 && (
            <div className="flex items-center gap-1">
              {enabledCurrencies.map(code => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-2 py-1 rounded text-xs font-medium ${currency === code ? 'bg-secondary text-foreground' : 'text-muted-foreground'
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

interface MobileNavItemProps {
  item: GeneratedMegaMenu;
  isExpanded: boolean;
  expandedSection: string | null;
  onToggle: () => void;
  onToggleSection: (id: string) => void;
  t: (text: { en: string; ar: string }) => string;
}

const MobileNavItem = ({ item, isExpanded, expandedSection, onToggle, onToggleSection, t }: MobileNavItemProps) => {
  if (item.type === 'link') {
    return (
      <Link
        to={item.slug}
        className="flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <span>{t(item.label)}</span>
        {item.badge && (
          <span className="bg-brand text-brand-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
            {t(item.badge)}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <span>{t(item.label)}</span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && item.sections.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-secondary/30"
          >
            {item.sections.map(section => (
              <div key={section.id}>
                <button
                  onClick={() => onToggleSection(section.id)}
                  className="w-full flex items-center justify-between px-7 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <span>{t(section.title)}</span>
                  <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      {section.links.map(link => (
                        <Link
                          key={link.id}
                          to={link.href}
                          className="block px-9 py-2 text-[12px] text-muted-foreground hover:text-brand transition-colors"
                        >
                          {t(link.label)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
