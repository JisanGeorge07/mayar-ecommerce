import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { shippingMethods } from '@/data/mock/checkout';
import { ArrowRight, ArrowLeft, Truck, Globe } from 'lucide-react';

const icons: Record<string, typeof Truck> = { local: Truck, international: Globe };

const StepShipping = () => {
  const { state, setShippingMethod } = useCheckout();
  const { t, formatPrice, lang } = useLocale();
  const nav = useNavigate();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {shippingMethods.map(m => {
          const active = state.shippingMethodId === m.id;
          const Icon = icons[m.id] || Truck;
          return (
            <button
              key={m.id}
              onClick={() => setShippingMethod(m.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 text-start transition-colors ${
                active ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-brand text-brand-foreground' : 'bg-secondary text-muted-foreground'}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t(m.name)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(m.description)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(m.estimatedDays)}</p>
              </div>
              <span className="text-sm font-bold text-foreground flex-shrink-0">
                {m.price === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(m.price)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={() => nav('/checkout/address')} className="h-11 px-5 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          {isAr ? 'رجوع' : 'Back'}
        </button>
        <button onClick={() => nav('/checkout/payment')} className="flex-1 h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm">
          {isAr ? 'متابعة إلى الدفع' : 'Continue to Payment'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepShipping;
