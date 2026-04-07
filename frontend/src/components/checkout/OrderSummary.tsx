import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { shippingMethods } from '@/data/mock/checkout';
import { ShieldCheck } from 'lucide-react';

const OrderSummary = () => {
  const { items, subtotal, discount, promoCode, promoApplied, couponInfo } = useCart();
  const { state } = useCheckout();
  const { t, formatPrice, getPrice, lang } = useLocale();
  const isAr = lang === 'ar';

  const ship = shippingMethods.find(m => m.id === state.shippingMethodId);
  // Apply free shipping if coupon is free_shipping type
  const isFreeShippingCoupon = couponInfo?.discountType === 'free_shipping';
  const shippingCost = isFreeShippingCoupon ? 0 : (ship?.price ?? 0);
  const total = subtotal - discount + shippingCost;

  // Get discount label with details
  const getDiscountLabel = () => {
    if (!promoApplied || !promoCode) return isAr ? 'خصم' : 'Discount';

    if (couponInfo) {
      if (couponInfo.discountType === 'percentage') {
        return `${isAr ? 'خصم' : 'Discount'} (${promoCode} - ${couponInfo.discountValue}%)`;
      }
      return `${isAr ? 'خصم' : 'Discount'} (${promoCode})`;
    }

    return `${isAr ? 'خصم' : 'Discount'} (${promoCode})`;
  };

  return (
    <div className="bg-card border border-border/50 rounded-lg p-5 sticky top-24 space-y-4">
      <h3 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
        {isAr ? 'ملخص الطلب' : 'Order Summary'}
      </h3>

      {/* Items */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="w-14 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0 relative">
              <img src={item.image} alt={t(item.name)} className="w-full h-full object-cover" />
              <span className="absolute -top-1 -end-1 bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground line-clamp-1">{t(item.name)}</p>
              <div className="text-[10px] text-muted-foreground">
                {item.color && <span>{item.color}</span>}
                {item.size && <span> · {item.size}</span>}
              </div>
              <p className="text-xs font-semibold text-foreground mt-0.5">{formatPrice(getPrice(item.unitPrice, item.unitPriceINR) * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-brand">
            <span>{getDiscountLabel()}</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">{isAr ? 'الشحن' : 'Shipping'}</span>
          <span className="font-medium text-foreground">{shippingCost === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border text-base">
          <span className="font-semibold text-foreground">{isAr ? 'الإجمالي' : 'Total'}</span>
          <span className="font-bold text-foreground">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck size={13} className="text-brand flex-shrink-0" />
        {isAr ? 'معاملة آمنة ومشفّرة' : 'Secure & encrypted transaction'}
      </div>
    </div>
  );
};

export default OrderSummary;
