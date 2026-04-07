import { useRef } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Copy, Download, Printer, Mail, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { toast } from '@/hooks/use-toast';
import { printInvoice, downloadInvoice } from '@/services/invoiceService';
import type { OrderRecord } from '@/types/order';

const CheckoutSuccessPage = () => {
  const { lang, formatPrice, t } = useLocale();
  const location = useLocation();
  const order = location.state as OrderRecord | undefined;
  const isAr = lang === 'ar';

  if (!order) return <Navigate to="/" replace />;

  const date = new Date(order.createdAt).toLocaleDateString(
    isAr ? 'ar-KW' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: isAr ? 'تم النسخ' : 'Copied!', duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />

      <main className="container py-10 md:py-16 max-w-3xl mx-auto">
        {/* ─── Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={44} className="text-brand" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {isAr ? 'شكراً لطلبك!' : 'Thank You for Your Order!'}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {isAr
              ? 'تم تأكيد طلبك وسيتم شحنه قريباً. سنرسل لك تأكيداً بالبريد الإلكتروني.'
              : 'Your order has been confirmed and will be shipped shortly. A confirmation has been sent to your email.'}
          </p>
        </motion.div>

        {/* ─── Order & Tracking IDs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-card border border-border/50 rounded-lg p-5 grid sm:grid-cols-3 gap-4 mb-5"
        >
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{isAr ? 'رقم الطلب' : 'Order Number'}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{order.orderNumber}</span>
              <button onClick={() => copy(order.orderNumber)} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"><Copy size={12} /></button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{isAr ? 'رقم التتبع' : 'Tracking ID'}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{order.trackingId}</span>
              <button onClick={() => copy(order.trackingId)} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"><Copy size={12} /></button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{isAr ? 'تاريخ الطلب' : 'Order Date'}</p>
            <span className="text-sm font-medium text-foreground">{date}</span>
          </div>
        </motion.div>

        {/* ─── Order Items Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-card border border-border/50 rounded-lg p-5 mb-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingBag size={15} className="text-brand" />
            {isAr ? 'المنتجات المطلوبة' : 'Ordered Items'}
          </h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                <div className="w-16 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                  <img src={item.image} alt={t(item.name)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{t(item.name)}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-0.5">
                    {item.color && <span>{item.color}</span>}
                    {item.size && <span>· {isAr ? 'المقاس' : 'Size'}: {item.size}</span>}
                    <span>· x{item.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground">{formatPrice(item.unitPrice)} × {item.quantity}</span>
                    <span className="text-sm font-bold text-foreground">{formatPrice(item.lineTotal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals inside item card */}
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span className="font-medium text-foreground">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-brand">
                <span>{isAr ? 'الخصم' : 'Discount'}{order.promoCode && ` (${order.promoCode})`}</span>
                <span>-{formatPrice(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isAr ? 'الشحن' : 'Shipping'}</span>
              <span className="font-medium text-foreground">
                {order.shippingTotal === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border text-base">
              <span className="font-semibold text-foreground">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="font-bold text-foreground">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Delivery & Payment Cards ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="grid sm:grid-cols-2 gap-4 mb-5"
        >
          {/* Delivery address */}
          <div className="bg-card border border-border/50 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</h3>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-medium">{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.address.area}, {isAr ? 'قطعة' : 'Block'} {order.address.block}</p>
              <p>{isAr ? 'شارع' : 'Street'} {order.address.street}, {isAr ? 'مبنى' : 'Bldg'} {order.address.building}</p>
              {(order.address.floor || order.address.flatOffice) && (
                <p>
                  {order.address.floor && `${isAr ? 'الطابق' : 'Floor'} ${order.address.floor}`}
                  {order.address.flatOffice && ` · ${order.address.flatOffice}`}
                </p>
              )}
              <div className="pt-2 mt-2 border-t border-border/40">
                <p className="text-foreground">{t(order.shipping.name)}</p>
                <p>{t(order.shipping.estimate)}</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-card border border-border/50 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">{isAr ? 'طريقة الدفع' : 'Payment Method'}</h3>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <p className="text-foreground font-medium">{t(order.payment.name)}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
              <div className="pt-2 mt-2 border-t border-border/40">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  order.status === 'confirmed' ? 'bg-brand/10 text-brand' : 'bg-green-50 text-green-700'
                }`}>
                  {order.status === 'confirmed' ? (isAr ? 'مؤكد' : 'Confirmed') : order.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Email confirmation note ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="flex items-start gap-3 bg-brand/5 border border-brand/15 rounded-lg px-4 py-3 mb-8"
        >
          <Mail size={16} className="text-brand flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAr
              ? `تم إرسال إيصال الطلب إلى بريدك الإلكتروني ${order.customer.email}. يرجى التحقق من صندوق الوارد أو مجلد البريد المهمل.`
              : `A receipt has been sent to ${order.customer.email}. Please check your inbox or spam folder for the order confirmation.`}
          </p>
        </motion.div>

        {/* ─── Action Buttons ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <button
            onClick={() => downloadInvoice(order)}
            className="h-11 border border-border font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm text-foreground"
          >
            <Download size={15} />
            <span className="hidden sm:inline">{isAr ? 'تحميل' : 'Download'}</span>
            <span className="sm:hidden">{isAr ? 'تحميل' : 'Save'}</span>
          </button>
          <button
            onClick={() => printInvoice(order)}
            className="h-11 border border-border font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm text-foreground"
          >
            <Printer size={15} />
            <span>{isAr ? 'طباعة' : 'Print'}</span>
          </button>
          <Link
            to={`/track-order?id=${encodeURIComponent(order.trackingId)}&orderId=${encodeURIComponent(order.orderNumber)}`}
            className="h-11 border border-border font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm text-foreground"
          >
            <Package size={15} />
            <span>{isAr ? 'تتبع' : 'Track'}</span>
          </Link>
          <Link
            to="/shop"
            className="h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isAr ? 'تسوق' : 'Shop'}
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;
