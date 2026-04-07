import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLocale } from '@/hooks/useLocale';
import { shippingMethods, paymentMethods } from '@/data/mock/checkout';
import { createMyFatoorahPayment, savePendingPayment } from '@/services/payment/myfatoorahService';
import { createOrder } from '@/services/api/orderService';
import { getMyFatoorahPaymentAmount } from '@/utils/currencyConversion';
import { ArrowLeft, Shield, Loader2, Wallet } from 'lucide-react';

/**
 * Get the callback base URL for MyFatoorah.
 * Use VITE_PAYMENT_CALLBACK_BASE_URL (e.g., ngrok URL) to make 3DS work in development.
 * If not set, falls back to window.location.origin.
 */
const getCallbackBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_PAYMENT_CALLBACK_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    console.log('Using custom callback URL for 3DS:', envUrl);
    return envUrl.trim();
  }
  return window.location.origin;
};

const StepPayment = () => {
  const { state, setPaymentMethod, setAgreedToTerms } = useCheckout();
  const { items, subtotal, discount, promoCode, promoApplied, couponInfo } = useCart();
  const { t, formatPrice, lang, currency } = useLocale();
  const nav = useNavigate();
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ship = shippingMethods.find(m => m.id === state.shippingMethodId) || shippingMethods[0];
  const pm = paymentMethods.find(m => m.id === 'myfatoorah') || paymentMethods[0];
  // Apply free shipping if coupon is free_shipping type
  const isFreeShippingCoupon = couponInfo?.discountType === 'free_shipping';
  const shippingCost = isFreeShippingCoupon ? 0 : (ship?.price ?? 0);
  const total = subtotal - discount + shippingCost;

  // Auto-select MyFatoorah on mount
  useEffect(() => {
    if (state.paymentMethodId !== 'myfatoorah') {
      setPaymentMethod('myfatoorah');
    }
  }, [state.paymentMethodId, setPaymentMethod]);

  const placeOrder = async () => {
    setError('');
    if (!state.agreedToTerms) {
      setError(isAr ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      console.log('Step 1: Creating order...');
      // Step 1: Create order in the backend with the correct currency
      const order = await createOrder(
        state,
        items,
        ship,
        pm,
        {
          subtotal,
          discount,
          shippingCost,
          total,
          promoCode: promoApplied ? promoCode : undefined,
          couponCodeId: promoApplied ? couponInfo?.id : undefined,
        },
        currency // Pass the actual currency (INR or KWD)
      );

      console.log('✓ Order created successfully:', {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingId: order.trackingId
      });

      // Step 2: Convert INR to KWD for MyFatoorah (MyFatoorah doesn't support INR)
      // UI will continue showing INR, but MyFatoorah receives KWD
      const paymentAmount = getMyFatoorahPaymentAmount(total, currency);

      console.log('Step 2: Currency conversion:', {
        originalAmount: total,
        originalCurrency: currency,
        paymentAmount: paymentAmount.amount,
        paymentCurrency: paymentAmount.currency
      });

      // Step 3: Save order info for payment callback (keep original currency for UI)
      savePendingPayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        trackingId: order.trackingId,
        amount: total, // Original amount for UI display
        currency: currency, // Original currency for UI display
        paymentAmount: paymentAmount.amount, // Converted amount sent to MyFatoorah
        paymentCurrency: paymentAmount.currency, // KWD for MyFatoorah
        customerName: `${state.customer.firstName} ${state.customer.lastName}`,
        customerEmail: state.customer.email,
        createdAt: new Date().toISOString(),
      });

      console.log('Step 3: Initiating payment with orderId:', order.id);

      // Get callback base URL - use ngrok URL if configured for 3DS to work
      const callbackBase = getCallbackBaseUrl();

      // Step 4: Initiate payment with KWD amount (converted from INR if needed)
      const result = await createMyFatoorahPayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: paymentAmount.amount, // Use converted KWD amount
        currency: paymentAmount.currency, // Always KWD for MyFatoorah
        countryCode: '965', // Always use Kuwait for KWD payments
        customerName: `${state.customer.firstName} ${state.customer.lastName}`,
        customerEmail: state.customer.email,
        customerMobile: state.customer.phone,
        callbackUrl: `${callbackBase}/payment/callback`,
        errorUrl: `${callbackBase}/payment/callback?status=FAILED`,
        items: items.map(item => ({
          name: t(item.name),
          quantity: item.quantity,
          unitPrice: currency === 'INR'
            ? getMyFatoorahPaymentAmount(item.unitPrice, 'INR').amount
            : item.unitPrice, // Convert item prices too if INR
        })),
      });

      console.log('✓ Payment initiated successfully');

      // Step 5: Redirect to payment page
      nav('/payment/redirecting', { state: { paymentUrl: result.paymentUrl } });
    } catch (err: any) {
      console.error('❌ Order/Payment failed:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);

      const errorMsg = err.response?.data?.message || err.message || (isAr ? 'فشل بدء الدفع. حاول مرة أخرى.' : 'Failed to initiate payment. Please try again.');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* MyFatoorah — single payment method */}
      <div className="border-2 border-brand bg-brand/5 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center flex-shrink-0">
            <Wallet size={18} />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">MyFatoorah</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr ? 'دفع آمن عبر ماي فاتورة' : 'Secure payment via MyFatoorah'}
            </p>
          </div>
          <Shield size={16} className="text-brand flex-shrink-0" />
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 rounded border-border text-brand focus:ring-brand"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          {isAr ? (
            <>
              أوافق على{' '}
              <Link to="/terms-conditions" target="_blank" className="text-brand underline hover:text-brand/80">
                الشروط والأحكام
              </Link>
              {' '}و{' '}
              <Link to="/privacy-policy" target="_blank" className="text-brand underline hover:text-brand/80">
                سياسة الخصوصية
              </Link>
            </>
          ) : (
            <>
              I agree to the{' '}
              <Link to="/terms-conditions" target="_blank" className="text-brand underline hover:text-brand/80">
                Terms &amp; Conditions
              </Link>
              {' '}and{' '}
              <Link to="/privacy-policy" target="_blank" className="text-brand underline hover:text-brand/80">
                Privacy Policy
              </Link>
            </>
          )}
        </span>
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={() => nav('/checkout/shipping')}
          className="h-11 px-5 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          {isAr ? 'رجوع' : 'Back'}
        </button>
        <button
          onClick={placeOrder}
          disabled={loading}
          className="flex-1 h-12 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isAr ? 'جاري إنشاء الطلب...' : 'Creating order...'}
            </>
          ) : (
            <>
              {isAr ? 'ادفع الآن' : 'Pay Now'} — {formatPrice(total)}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepPayment;
