import { ShoppingBag, Heart, MapPin, Clock, Package, Edit, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSettings } from '@/context/SettingsContext';
import { useLocale } from '@/hooks/useLocale';
import { getOrderHistory } from '@/services/api/orderService';
import { addressService } from '@/services/api/addressService';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useEffect, useState } from 'react';

interface Props {
  onNavigate: (section: string) => void;
}

const AccountDashboard = ({ onNavigate }: Props) => {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const { viewedIds } = useRecentlyViewed();
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  const enableWishlist = settings?.enableWishlist ?? true;
  const enableOrderTracking = settings?.enableOrderTracking ?? false;

  useEffect(() => {
    getOrderHistory().then(o => setOrderCount(o.length));
    addressService.getAddresses().then(a => setAddressCount(a.length)).catch(() => setAddressCount(0));
  }, []);

  const allCards = [
    { icon: ShoppingBag, label: t('Total Orders', 'إجمالي الطلبات'), value: orderCount, section: 'orders', color: 'bg-brand/10 text-brand' },
    { icon: Heart, label: t('Wishlist Items', 'عناصر المفضلة'), value: wishlistCount, section: 'wishlist', color: 'bg-destructive/10 text-destructive' },
    { icon: MapPin, label: t('Saved Addresses', 'عناوين محفوظة'), value: addressCount, section: 'addresses', color: 'bg-green-500/10 text-green-600' },
    { icon: Clock, label: t('Recently Viewed', 'شوهد مؤخراً'), value: viewedIds.length, section: 'recently-viewed', color: 'bg-blue-500/10 text-blue-600' },
  ];

  const allQuickActions = [
    { icon: Eye, label: t('View Orders', 'عرض الطلبات'), section: 'orders' },
    { icon: Edit, label: t('Edit Profile', 'تعديل الحساب'), section: 'profile' },
    { icon: Heart, label: t('Manage Wishlist', 'إدارة المفضلة'), section: 'wishlist' },
    { icon: Package, label: t('Track Order', 'تتبع طلب'), section: 'tracking' },
  ];

  const cards = allCards.filter(c => {
    if (c.section === 'wishlist' && !enableWishlist) return false;
    return true;
  });
  const quickActions = allQuickActions.filter(a => {
    if (a.section === 'wishlist' && !enableWishlist) return false;
    if (a.section === 'tracking' && !enableOrderTracking) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-br from-header to-header/90 text-header-foreground rounded-xl p-6 md:p-8">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-1">
          {t('Welcome back,', 'مرحباً بعودتك،')} {user?.name || 'User'}
        </h2>
        <p className="text-header-muted text-sm">
          {user?.email && <span className="me-4">{user.email}</span>}
          {user?.phoneNumber && <span>{user.phoneNumber}</span>}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.section}
              onClick={() => onNavigate(card.section)}
              className="bg-card border border-border rounded-xl p-4 text-start hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-medium text-foreground mb-4">{t('Quick Actions', 'إجراءات سريعة')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.section}
                onClick={() => onNavigate(action.section)}
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors text-sm text-foreground"
              >
                <Icon size={16} className="text-brand" />
                <span>{action.label}</span>
                <ArrowRight size={14} className="ms-auto text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
