import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/context/CheckoutContext';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { useCheckoutFields } from '@/hooks/useCheckoutFields';
import { User, ArrowRight, MapPin, Check, Loader2 } from 'lucide-react';
import type { SavedAddress } from '@/types/checkout';

const StepDetails = () => {
  const { state, setCustomer, savedAddresses, loadingAddresses, applySavedAddress, clearSelectedAddress } = useCheckout();
  const { isLoggedIn } = useAuth();
  const { lang } = useLocale();
  const { fields, loading: fieldsLoading } = useCheckoutFields();
  const nav = useNavigate();
  const isAr = lang === 'ar';
  const tr = (en: string, ar: string) => isAr ? ar : en;

  // Get only email and phone fields that are visible
  const dynamicFields = fields.filter(f =>
    ['email', 'phone'].includes(f.fieldKey) && f.isVisible
  );

  const [form, setForm] = useState(() => ({ ...state.customer }));
  const [selAddrId, setSelAddrId] = useState<string>(state.selectedAddressId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync selAddrId with checkout state
  useEffect(() => {
    setSelAddrId(state.selectedAddressId || '');
  }, [state.selectedAddressId]);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelAddrId(addr.id);
    // Apply address fields and update form with contact info
    applySavedAddress(addr);
    // Update local form state with address contact info
    if (addr.firstName) setForm(f => ({ ...f, firstName: addr.firstName! }));
    if (addr.lastName) setForm(f => ({ ...f, lastName: addr.lastName! }));
    if (addr.email) setForm(f => ({ ...f, email: addr.email! }));
    if (addr.phone) setForm(f => ({ ...f, phone: addr.phone! }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    // Always validate firstName and lastName (hardcoded fields)
    if (!form.firstName.trim()) e.firstName = tr('Required', 'مطلوب');
    if (!form.lastName.trim()) e.lastName = tr('Required', 'مطلوب');

    // Validate dynamic fields based on configuration
    dynamicFields.forEach(field => {
      if (!field.isRequired) return;

      const value = form[field.fieldKey as keyof typeof form] || '';
      if (!value.trim()) {
        e[field.fieldKey] = tr('Required', 'مطلوب');
        return;
      }

      // Email validation
      if (field.fieldKey === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        e[field.fieldKey] = tr('Invalid email', 'بريد غير صالح');
      }

      // Phone validation
      if (field.fieldKey === 'phone' && !/^\+?[\d\s-]{7,15}$/.test(value.replace(/\s/g, ''))) {
        e[field.fieldKey] = tr('Invalid phone', 'رقم غير صالح');
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setCustomer({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    nav('/checkout/address');
  };

  const fieldClass = (k: string) =>
    `w-full h-10 px-3 bg-secondary border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${errors[k] ? 'border-destructive' : 'border-transparent'
    }`;

  return (
    <div className="space-y-6">
      {!isLoggedIn && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs bg-secondary/60 px-3 py-2 rounded-md">
          <User size={14} />
          {tr('Guest checkout — no account required', 'الدفع كضيف — لا يتطلب حساب')}
        </div>
      )}

      {/* Saved Addresses — logged-in only */}
      {isLoggedIn && loadingAddresses && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs py-4">
          <Loader2 size={14} className="animate-spin" />
          {tr('Loading saved addresses...', 'جاري تحميل العناوين...')}
        </div>
      )}

      {isLoggedIn && !loadingAddresses && savedAddresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {tr('Select a saved address', 'اختر عنواناً محفوظاً')}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {savedAddresses.map(addr => {
              const active = selAddrId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelectAddress(addr)}
                  className={`w-full text-start p-3.5 rounded-lg border-2 transition-colors relative ${active ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'
                    }`}
                >
                  {active && (
                    <span className="absolute top-2.5 end-2.5 w-5 h-5 rounded-full bg-brand text-brand-foreground flex items-center justify-center">
                      <Check size={12} />
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-medium bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                        {tr('Default', 'افتراضي')}
                      </span>
                    )}
                  </div>
                  {(addr.firstName || addr.lastName) && (
                    <p className="text-xs text-foreground">
                      {addr.firstName} {addr.lastName}
                    </p>
                  )}
                  {addr.phone && (
                    <p className="text-xs text-muted-foreground">{addr.phone}</p>
                  )}
                  {addr.email && (
                    <p className="text-xs text-muted-foreground">{addr.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {tr('Area', 'المنطقة')} {addr.area}, {tr('Block', 'قطعة')} {addr.block}, {addr.street}, {tr('Bldg', 'مبنى')} {addr.building}
                    {addr.floor && `, ${tr('Floor', 'طابق')} ${addr.floor}`}
                    {addr.flatOffice && `, ${addr.flatOffice}`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Details */}
      {/* First Name & Last Name - Always shown (hardcoded) */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{tr('First Name', 'الاسم الأول')} *</label>
          <input value={form.firstName} onChange={e => set('firstName', e.target.value)} className={fieldClass('firstName')} placeholder={tr('John', 'محمد')} maxLength={50} />
          {errors.firstName && <p className="text-[11px] text-destructive mt-0.5">{errors.firstName}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">{tr('Last Name', 'الاسم الأخير')} *</label>
          <input value={form.lastName} onChange={e => set('lastName', e.target.value)} className={fieldClass('lastName')} placeholder={tr('Doe', 'العلي')} maxLength={50} />
          {errors.lastName && <p className="text-[11px] text-destructive mt-0.5">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email & Phone - Dynamic based on settings */}
      {fieldsLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-xs py-4">
          <Loader2 size={14} className="animate-spin" />
          {tr('Loading fields...', 'جاري تحميل الحقول...')}
        </div>
      ) : (
        <>
          {dynamicFields.map((field) => {
            const inputType = field.fieldKey === 'email' ? 'email' : field.fieldKey === 'phone' ? 'tel' : 'text';
            const label = isAr ? (field.fieldLabelArabic || field.fieldLabel) : field.fieldLabel;
            const requiredMark = field.isRequired ? ' *' : '';

            return (
              <div key={field.fieldKey}>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  {label}{requiredMark}
                </label>
                <input
                  type={inputType}
                  value={form[field.fieldKey as keyof typeof form]}
                  onChange={e => set(field.fieldKey as keyof typeof form, e.target.value)}
                  className={fieldClass(field.fieldKey)}
                  placeholder={field.fieldKey === 'email' ? 'email@example.com' : field.fieldKey === 'phone' ? '+965 XXXX XXXX' : ''}
                  maxLength={field.fieldKey === 'phone' ? 20 : 100}
                />
                {errors[field.fieldKey] && <p className="text-[11px] text-destructive mt-0.5">{errors[field.fieldKey]}</p>}
              </div>
            );
          })}
        </>
      )}

      <button onClick={submit} className="w-full h-11 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm">
        {tr('Continue to Address', 'متابعة إلى العنوان')}
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default StepDetails;
