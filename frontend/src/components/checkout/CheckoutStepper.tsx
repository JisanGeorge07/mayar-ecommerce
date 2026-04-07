import { Check } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { CheckoutStep } from '@/types/checkout';

const steps: { key: CheckoutStep; en: string; ar: string }[] = [
  { key: 'details', en: 'Details', ar: 'البيانات' },
  { key: 'address', en: 'Address', ar: 'العنوان' },
  { key: 'shipping', en: 'Shipping', ar: 'الشحن' },
  { key: 'payment', en: 'Payment', ar: 'الدفع' },
];

interface Props {
  current: CheckoutStep;
}

const stepIndex = (key: CheckoutStep) => steps.findIndex(s => s.key === key);

const CheckoutStepper = ({ current }: Props) => {
  const { lang } = useLocale();
  const ci = stepIndex(current);

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-8">
      {steps.map((step, i) => {
        const done = i < ci;
        const active = i === ci;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? 'bg-brand border-brand text-brand-foreground'
                    : active
                    ? 'border-brand text-brand bg-background'
                    : 'border-border text-muted-foreground bg-background'
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${active ? 'text-brand' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {lang === 'ar' ? step.ar : step.en}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < ci ? 'bg-brand' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
