/**
 * Payment Callback / Result Page
 *
 * Handles the redirect back from MyFatoorah hosted payment.
 * Order is already created before payment, so this page:
 * 1. Verifies payment status
 * 2. Updates order status via backend API
 * 3. Clears cart and checkout state
 * 4. Redirects to success page
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2, RotateCcw, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { verifyMyFatoorahPayment, getPendingPayment, clearPendingPayment } from '@/services/payment/myfatoorahService';
import { getOrderById } from '@/services/api/orderService';
import type { PaymentInvoiceStatus } from '@/types/payment';
import type { OrderRecord } from '@/types/order';

type PageState = 'verifying' | 'success' | 'failed' | 'pending' | 'cancelled';

interface PaymentError {
  message?: string;
  code?: string;
}

const PaymentCallbackPage = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { lang, formatPrice } = useLocale();
  const { clearCart } = useCart();
  const { resetCheckout } = useCheckout();
  const isAr = lang === 'ar';

  const [pageState, setPageState] = useState<PageState>('verifying');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);

  const paymentId = params.get('paymentId') || '';
  const statusParam = params.get('status') || '';

  useEffect(() => {
    const process = async () => {
      try {
        // Get pending payment data (includes orderId)
        const pending = getPendingPayment();

        // Verify payment status
        const result = await verifyMyFatoorahPayment(paymentId);
        const status = (statusParam || result.invoiceStatus) as PaymentInvoiceStatus;

        if (status === 'PAID') {
          // Payment successful - backend payment service already updated order status
          // Get order details
          let orderData: OrderRecord | null = null;

          if (pending?.orderId) {
            try {
              orderData = await getOrderById(pending.orderId);
            } catch (err) {
              console.error('Failed to fetch order:', err);
            }
          }

          // Create fallback order object if API call failed
          if (!orderData && pending) {
            orderData = {
              id: pending.orderId,
              orderNumber: pending.orderNumber || result.orderNumber,
              trackingId: pending.trackingId || '',
              createdAt: pending.createdAt || new Date().toISOString(),
              customer: {
                firstName: pending.customerName?.split(' ')[0] || '',
                lastName: pending.customerName?.split(' ').slice(1).join(' ') || '',
                email: pending.customerEmail || '',
                phone: '',
              },
              address: { area: '', block: '', street: '', building: '' },
              shipping: { id: '', name: { en: '', ar: '' }, fee: 0, estimate: { en: '', ar: '' } },
              payment: { id: 'myfatoorah', name: { en: 'MyFatoorah', ar: 'ماي فاتورة' } },
              items: [],
              subtotal: pending.amount || 0,
              shippingTotal: 0,
              discountTotal: 0,
              total: pending.amount || result.paidAmount || 0,
              status: 'confirmed',
            };
          }

          setOrder(orderData);

          // Clear cart and checkout only on successful payment
          await clearCart();
          resetCheckout();
          clearPendingPayment();
          setPageState('success');
        } else if (status === 'PENDING') {
          setPageState('pending');
        } else if (status === 'CANCELED') {
          setPageState('cancelled');
        } else {
          // Payment failed - store error details for display
          if (result.errorMessage || result.errorCode) {
            setPaymentError({
              message: result.errorMessage,
              code: result.errorCode,
            });
            console.error('Payment failed:', result.errorMessage, result.errorCode);
          }
          setPageState('failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setPageState('failed');
      }
    };

    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateConfig: Record<Exclude<PageState, 'verifying'>, {
    icon: typeof CheckCircle;
    iconClass: string;
    bgClass: string;
    title: { en: string; ar: string };
    desc: { en: string; ar: string };
  }> = {
    success: {
      icon: CheckCircle,
      iconClass: 'text-green-600',
      bgClass: 'bg-green-50',
      title: { en: 'Payment Successful!', ar: 'تم الدفع بنجاح!' },
      desc: { en: 'Your payment has been processed and your order is confirmed.', ar: 'تمت معالجة الدفع وتم تأكيد طلبك.' },
    },
    failed: {
      icon: XCircle,
      iconClass: 'text-red-500',
      bgClass: 'bg-red-50',
      title: { en: 'Payment Failed', ar: 'فشل الدفع' },
      desc: { en: 'Your payment could not be processed. Please try again or use a different method.', ar: 'لم يتم معالجة الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة أخرى.' },
    },
    pending: {
      icon: Clock,
      iconClass: 'text-amber-500',
      bgClass: 'bg-amber-50',
      title: { en: 'Payment Pending', ar: 'الدفع معلق' },
      desc: { en: 'Your payment is being processed. We will notify you once it is confirmed.', ar: 'جاري معالجة الدفع. سنعلمك فور تأكيده.' },
    },
    cancelled: {
      icon: AlertTriangle,
      iconClass: 'text-gray-500',
      bgClass: 'bg-gray-50',
      title: { en: 'Payment Cancelled', ar: 'تم إلغاء الدفع' },
      desc: { en: 'You cancelled the payment. Your order has been saved and you can retry payment.', ar: 'لقد ألغيت الدفع. تم حفظ طلبك ويمكنك إعادة المحاولة.' },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />

      <main className="container py-10 md:py-16 max-w-lg mx-auto text-center">
        {pageState === 'verifying' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20"
          >
            <Loader2 size={40} className="animate-spin text-brand mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {isAr ? 'جاري التحقق من الدفع...' : 'Verifying your payment...'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(() => {
              const cfg = stateConfig[pageState];
              const Icon = cfg.icon;
              return (
                <>
                  <div className={`w-20 h-20 rounded-full ${cfg.bgClass} flex items-center justify-center mx-auto mb-5`}>
                    <Icon size={40} className={cfg.iconClass} />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {isAr ? cfg.title.ar : cfg.title.en}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                    {isAr ? cfg.desc.ar : cfg.desc.en}
                  </p>
                </>
              );
            })()}

            {/* Order info for success */}
            {pageState === 'success' && order && (
              <div className="bg-card border border-border/50 rounded-lg p-5 mb-6 text-start">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">{isAr ? 'رقم الطلب' : 'Order Number'}</p>
                    <p className="font-bold text-foreground font-numeric">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{isAr ? 'الإجمالي' : 'Total Paid'}</p>
                    <p className="font-bold text-foreground font-numeric">{formatPrice(order.total)}</p>
                  </div>
                  {order.trackingId && (
                    <div>
                      <p className="text-muted-foreground">{isAr ? 'رقم التتبع' : 'Tracking ID'}</p>
                      <p className="font-bold text-foreground font-numeric">{order.trackingId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">{isAr ? 'الحالة' : 'Status'}</p>
                    <span className="inline-flex text-[10px] font-bold uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      {isAr ? 'مدفوع' : 'Paid'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment ref for pending */}
            {pageState === 'pending' && paymentId && (
              <div className="bg-card border border-border/50 rounded-lg p-4 mb-6 text-xs">
                <span className="text-muted-foreground">{isAr ? 'مرجع الدفع' : 'Payment Ref'}: </span>
                <span className="font-bold text-foreground font-numeric">{paymentId}</span>
              </div>
            )}

            {/* Error details for failed payments */}
            {pageState === 'failed' && paymentError?.message && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-start">
                <p className="text-xs text-red-600 font-medium mb-1">
                  {isAr ? 'سبب الفشل:' : 'Reason:'}
                </p>
                <p className="text-sm text-red-700">{paymentError.message}</p>
                {paymentError.code && (
                  <p className="text-xs text-red-500 mt-1">
                    {isAr ? 'كود الخطأ:' : 'Error Code:'} {paymentError.code}
                  </p>
                )}
              </div>
            )}

            {/* Payment ID for debugging */}
            {pageState === 'failed' && paymentId && (
              <div className="bg-card border border-border/50 rounded-lg p-4 mb-6 text-xs">
                <span className="text-muted-foreground">{isAr ? 'مرجع الدفع' : 'Payment Ref'}: </span>
                <span className="font-bold text-foreground font-numeric">{paymentId}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {pageState === 'success' && order && (
                <>
                  <button
                    onClick={() => nav('/checkout/success', { state: order })}
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors text-sm"
                  >
                    {isAr ? 'عرض تفاصيل الطلب' : 'View Order Details'}
                  </button>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag size={15} />
                    {isAr ? 'متابعة التسوق' : 'Continue Shopping'}
                  </Link>
                </>
              )}

              {(pageState === 'failed' || pageState === 'cancelled') && (
                <>
                  <button
                    onClick={() => nav('/checkout/payment')}
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw size={15} />
                    {isAr ? 'إعادة المحاولة' : 'Retry Payment'}
                  </button>
                  <Link
                    to="/cart"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors text-sm flex items-center justify-center"
                  >
                    {isAr ? 'العودة للسلة' : 'Back to Cart'}
                  </Link>
                </>
              )}

              {pageState === 'pending' && (
                <>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag size={15} />
                    {isAr ? 'متابعة التسوق' : 'Continue Shopping'}
                  </Link>
                  <Link
                    to="/account"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors text-sm flex items-center justify-center"
                  >
                    {isAr ? 'حسابي' : 'My Account'}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCallbackPage;
