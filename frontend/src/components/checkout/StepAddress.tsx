import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { useCheckoutFields } from '@/hooks/useCheckoutFields';
import { kuwaitAreas } from '@/data/mock/checkout';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const StepAddress = () => {
  const { state, setAddress } = useCheckout();
  const { lang } = useLocale();
  const { fields } = useCheckoutFields();
  const nav = useNavigate();
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => isAr ? ar : en;

  // Helper to check if a field is visible
  const isFieldVisible = (fieldKey: string) => {
    const field = fields.find(f => f.fieldKey === fieldKey);
    return field ? field.isVisible : false; // Default to hidden if not found
  };

  // Helper to check if a field is required
  const isFieldRequired = (fieldKey: string) => {
    const field = fields.find(f => f.fieldKey === fieldKey);
    return field ? field.isRequired : false;
  };

  // Prefill from checkout state (already populated from saved address or manual entry)
  const [form, setForm] = useState(() => ({
    area: state.address.area,
    block: state.address.block,
    street: state.address.street,
    building: state.address.building,
    floor: state.address.floor,
    flat: state.address.flat,
    notes: state.address.notes,
  }));

  // Sync form with checkout state when it changes
  useEffect(() => {
    setForm({
      area: state.address.area,
      block: state.address.block,
      street: state.address.street,
      building: state.address.building,
      floor: state.address.floor,
      flat: state.address.flat,
      notes: state.address.notes,
    });
  }, [state.address]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    const req = t('Required', 'مطلوب');

    // Validate only visible and required fields
    if (isFieldVisible('area') && isFieldRequired('area') && !form.area.trim()) e.area = req;
    if (isFieldVisible('block') && isFieldRequired('block') && !form.block.trim()) e.block = req;
    if (isFieldVisible('street') && isFieldRequired('street') && !form.street.trim()) e.street = req;
    if (isFieldVisible('building') && isFieldRequired('building') && !form.building.trim()) e.building = req;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setAddress({
      area: form.area.trim(),
      block: form.block.trim(),
      street: form.street.trim(),
      building: form.building.trim(),
      floor: form.floor.trim(),
      flat: form.flat.trim(),
      notes: form.notes.trim(),
    });
    nav('/checkout/shipping');
  };

  const fieldClass = (k: string) =>
    `w-full h-10 px-3 bg-secondary border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${errors[k] ? 'border-destructive' : 'border-transparent'
    }`;

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">
        {t('Delivery address details. Contact info is from the previous step.', 'تفاصيل عنوان التوصيل. معلومات الاتصال من الخطوة السابقة.')}
      </p>

      {/* Area */}
      {isFieldVisible('area') && (
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            {t('Area', 'المنطقة')}{isFieldRequired('area') ? ' *' : ''}
          </label>
          <select value={form.area} onChange={e => set('area', e.target.value)} className={fieldClass('area')}>
            <option value="">{t('Select area', 'اختر المنطقة')}</option>
            {kuwaitAreas.map(a => (
              <option key={a.en} value={a.en}>{isAr ? a.ar : a.en}</option>
            ))}
          </select>
          {errors.area && <p className="text-[11px] text-destructive mt-0.5">{errors.area}</p>}
        </div>
      )}

      {/* Block & Street */}
      {(isFieldVisible('block') || isFieldVisible('street')) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {isFieldVisible('block') && (
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                {t('Block', 'القطعة')}{isFieldRequired('block') ? ' *' : ''}
              </label>
              <input value={form.block} onChange={e => set('block', e.target.value)} className={fieldClass('block')} maxLength={10} />
              {errors.block && <p className="text-[11px] text-destructive mt-0.5">{errors.block}</p>}
            </div>
          )}
          {isFieldVisible('street') && (
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                {t('Street', 'الشارع')}{isFieldRequired('street') ? ' *' : ''}
              </label>
              <input value={form.street} onChange={e => set('street', e.target.value)} className={fieldClass('street')} maxLength={100} />
              {errors.street && <p className="text-[11px] text-destructive mt-0.5">{errors.street}</p>}
            </div>
          )}
        </div>
      )}

      {/* Building, Floor, Flat */}
      {(isFieldVisible('building') || isFieldVisible('floor') || isFieldVisible('flat')) && (
        <div className="grid sm:grid-cols-3 gap-4">
          {isFieldVisible('building') && (
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                {t('Building', 'المبنى')}{isFieldRequired('building') ? ' *' : ''}
              </label>
              <input value={form.building} onChange={e => set('building', e.target.value)} className={fieldClass('building')} maxLength={20} />
              {errors.building && <p className="text-[11px] text-destructive mt-0.5">{errors.building}</p>}
            </div>
          )}
          {isFieldVisible('floor') && (
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                {t('Floor', 'الطابق')}{isFieldRequired('floor') ? ' *' : ''}
              </label>
              <input value={form.floor} onChange={e => set('floor', e.target.value)} className={fieldClass('floor')} maxLength={10} />
            </div>
          )}
          {isFieldVisible('flat') && (
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                {t('Flat / Office', 'شقة / مكتب')}{isFieldRequired('flat') ? ' *' : ''}
              </label>
              <input value={form.flat} onChange={e => set('flat', e.target.value)} className={fieldClass('flat')} maxLength={20} />
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {isFieldVisible('notes') && (
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            {t('Additional Notes', 'ملاحظات إضافية')}{isFieldRequired('notes') ? ' *' : ''}
          </label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} maxLength={300}
            className="w-full px-3 py-2 bg-secondary border border-transparent rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder={t('Special delivery instructions...', 'تعليمات توصيل خاصة...')}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => nav('/checkout/details')} className="h-11 px-5 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          {t('Back', 'رجوع')}
        </button>
        <button onClick={submit} className="flex-1 h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm">
          {t('Continue to Shipping', 'متابعة إلى الشحن')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepAddress;
