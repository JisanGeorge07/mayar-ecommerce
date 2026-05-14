import { useState, useEffect } from 'react';
import { Bell, Package, Truck, Tag, User, Check } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { notificationService, type NotificationItem } from '@/services/notificationService';

const typeIcons = { order: Package, delivery: Truck, promo: Tag, account: User };
const typeColors = { order: 'bg-blue-500/10 text-blue-600', delivery: 'bg-green-500/10 text-green-600', promo: 'bg-brand/10 text-brand', account: 'bg-purple-500/10 text-purple-600' };

const AccountNotifications = () => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t('Notifications', 'الإشعارات')}
          {unreadCount > 0 && <span className="ms-2 text-sm font-normal text-brand">({unreadCount} {t('new', 'جديد')})</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-brand hover:underline flex items-center gap-1">
            <Check size={14} /> {t('Mark all read', 'تعيين الكل مقروء')}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('No notifications', 'لا توجد إشعارات')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div key={n.id} className={`bg-card border rounded-xl p-4 flex items-start gap-3 ${n.read ? 'border-border' : 'border-brand/30 bg-brand/5'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type] || 'bg-muted text-muted-foreground'}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{lang === 'ar' ? n.title.ar : n.title.en}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{lang === 'ar' ? n.message.ar : n.message.en}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {new Date(n.date).toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountNotifications;
