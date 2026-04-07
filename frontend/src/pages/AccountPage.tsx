import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, User, ShoppingBag, MapPin, Heart, Clock, Bell, Shield, LogOut, Package, ChevronRight, Menu } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import AccountDashboard from '@/components/account/AccountDashboard';
import AccountProfile from '@/components/account/AccountProfile';
import AccountOrders from '@/components/account/AccountOrders';
import AccountAddresses from '@/components/account/AccountAddresses';
import AccountWishlistSection from '@/components/account/AccountWishlist';
import AccountRecentlyViewed from '@/components/account/AccountRecentlyViewed';
import AccountNotifications from '@/components/account/AccountNotifications';
import AccountSecurity from '@/components/account/AccountSecurity';
import AccountTracking from '@/components/account/AccountTracking';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type AccountSection = 'dashboard' | 'profile' | 'orders' | 'tracking' | 'addresses' | 'wishlist' | 'recently-viewed' | 'notifications' | 'security';

const allSidebarItems: { id: AccountSection; icon: typeof LayoutDashboard; label: { en: string; ar: string }; featureKey?: 'enableOrderTracking' | 'enableWishlist' }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: { en: 'Dashboard', ar: 'لوحة التحكم' } },
  { id: 'profile', icon: User, label: { en: 'Profile Details', ar: 'تفاصيل الحساب' } },
  { id: 'orders', icon: ShoppingBag, label: { en: 'My Orders', ar: 'طلباتي' } },
  { id: 'tracking', icon: Package, label: { en: 'Order Tracking', ar: 'تتبع الطلب' }, featureKey: 'enableOrderTracking' },
  { id: 'addresses', icon: MapPin, label: { en: 'Addresses', ar: 'العناوين' } },
  { id: 'wishlist', icon: Heart, label: { en: 'Wishlist', ar: 'المفضلة' }, featureKey: 'enableWishlist' },
  { id: 'recently-viewed', icon: Clock, label: { en: 'Recently Viewed', ar: 'شوهد مؤخراً' } },
  { id: 'notifications', icon: Bell, label: { en: 'Notifications', ar: 'الإشعارات' } },
  { id: 'security', icon: Shield, label: { en: 'Security', ar: 'الأمان' } },
];

const AccountPage = () => {
  const { lang } = useLocale();
  const { settings } = useSettings();
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter sidebar items based on feature settings
  const sidebarItems = useMemo(() => {
    return allSidebarItems.filter(item => {
      if (!item.featureKey) return true;
      return settings?.[item.featureKey] !== false;
    });
  }, [settings]);

  const section = (searchParams.get('section') as AccountSection) || 'dashboard';

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/login', { replace: true });
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const setSection = (s: AccountSection) => {
    setSearchParams({ section: s });
    setMobileOpen(false);
  };

  if (isLoading || !isLoggedIn) return null;

  const SidebarContent = () => (
    <div className="space-y-1">
      {/* User info */}
      <div className="p-4 border-b border-border mb-2">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-heading text-lg font-bold mb-2">
          {user?.name?.charAt(0) || 'M'}
        </div>
        <p className="font-medium text-foreground text-sm">{user?.name || 'User'}</p>
        <p className="text-xs text-muted-foreground">{user?.email || user?.phoneNumber}</p>
      </div>

      {sidebarItems.map(item => {
        const Icon = item.icon;
        const active = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${active
                ? 'bg-brand/10 text-brand font-medium'
                : 'text-foreground hover:bg-secondary'
              }`}
          >
            <Icon size={18} />
            <span>{lang === 'ar' ? item.label.ar : item.label.en}</span>
            {active && <ChevronRight size={14} className="ms-auto" />}
          </button>
        );
      })}

      <button
        onClick={() => { logout(); navigate('/'); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors mt-4"
      >
        <LogOut size={18} />
        <span>{t('Logout', 'تسجيل خروج')}</span>
      </button>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'profile': return <AccountProfile />;
      case 'orders': return <AccountOrders />;
      case 'tracking': return <AccountTracking />;
      case 'addresses': return <AccountAddresses />;
      case 'wishlist': return <AccountWishlistSection />;
      case 'recently-viewed': return <AccountRecentlyViewed />;
      case 'notifications': return <AccountNotifications />;
      case 'security': return <AccountSecurity />;
      default: return <AccountDashboard onNavigate={setSection} />;
    }
  };

  const currentLabel = allSidebarItems.find(i => i.id === section);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">{t('Home', 'الرئيسية')}</a>
          <ChevronRight size={12} />
          <span className="text-foreground">{t('My Account', 'حسابي')}</span>
          {section !== 'dashboard' && currentLabel && (
            <>
              <ChevronRight size={12} />
              <span className="text-foreground">{lang === 'ar' ? currentLabel.label.ar : currentLabel.label.en}</span>
            </>
          )}
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t('My Account', 'حسابي')}
        </h1>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-2 sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Mobile nav trigger */}
          <div className="lg:hidden fixed bottom-4 end-4 z-30">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="bg-brand text-brand-foreground p-3 rounded-full shadow-lg">
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-[280px] p-4">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {renderSection()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
