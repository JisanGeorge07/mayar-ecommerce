import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, Eye, MapPin } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { getOrderHistory } from '@/services/api/orderService';
import { downloadInvoice } from '@/services/invoiceService';
import type { OrderRecord } from '@/types/order';

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const AccountOrders = () => {
  const { lang, formatPrice } = useLocale();
  const { settings } = useSettings();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const enableOrderTracking = settings?.enableOrderTracking ?? false;

  useEffect(() => {
    getOrderHistory().then(o => { setOrders(o); setLoading(false); });
  }, []);

  if (loading) return <div className="py-10 text-center text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</div>;

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-foreground">{t('My Orders', 'طلباتي')}</h2>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t('No orders yet', 'لا توجد طلبات بعد')}</p>
          <Link to="/shop" className="text-sm text-brand hover:underline">{t('Start Shopping', 'ابدأ التسوق')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">{t('My Orders', 'طلباتي')}</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-secondary/50 border-b border-border">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('Order', 'طلب')} </span>
                  <span className="font-mono font-medium text-foreground">{order.orderNumber}</span>
                </div>
                <div className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="p-4 space-y-3">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={lang === 'ar' ? item.name.ar : item.name.en} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lang === 'ar' ? item.name.ar : item.name.en}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color && <span>{item.color}</span>}
                      {item.size && <span> · {item.size}</span>}
                      <span> · x{item.quantity}</span>
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-muted-foreground">+{order.items.length - 3} {t('more items', 'عناصر أخرى')}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t('Total:', 'الإجمالي:')}</span>
                <span className="font-bold text-foreground">{formatPrice(order.total)}</span>
                <span className="text-xs text-muted-foreground">· {lang === 'ar' ? order.payment.name.ar : order.payment.name.en}</span>
              </div>
              <div className="flex items-center gap-2">
                {enableOrderTracking && (
                  <Link
                    to={`/track-order?id=${order.trackingId}&orderId=${order.orderNumber}`}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
                  >
                    <MapPin size={13} />
                    {t('Track', 'تتبع')}
                  </Link>
                )}
                <button
                  onClick={() => downloadInvoice(order)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
                >
                  <Download size={13} />
                  {t('Invoice', 'فاتورة')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrders;
