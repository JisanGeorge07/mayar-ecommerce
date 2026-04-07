import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { getOrderHistory } from '@/services/api/orderService';
import type { OrderRecord } from '@/types/order';

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const AccountTracking = () => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderHistory().then(o => { setOrders(o); setLoading(false); });
  }, []);

  if (loading) return <div className="py-10 text-center text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</div>;

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-foreground">{t('Order Tracking', 'تتبع الطلبات')}</h2>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('No orders to track', 'لا توجد طلبات للتتبع')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">{t('Order Tracking', 'تتبع الطلبات')}</h2>

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Package size={18} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Tracking:', 'رقم التتبع:')} <span className="font-mono">{order.trackingId}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                {order.status}
              </span>
              <Link
                to={`/track-order?id=${order.trackingId}&orderId=${order.orderNumber}`}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 transition-colors"
              >
                <MapPin size={13} />
                {t('Track Order', 'تتبع')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountTracking;
