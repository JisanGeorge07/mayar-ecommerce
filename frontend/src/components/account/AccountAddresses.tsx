import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Star, X, Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { addressService, type AddressDto, type CreateAddressDto, type UpdateAddressDto } from '@/services/api/addressService';
import { kuwaitAreas } from '@/data/mock/checkout';
import { toast } from '@/hooks/use-toast';

interface EditingAddress {
  id?: string;
  label: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor: string;
  flatOffice: string;
  notes: string;
}

const emptyAddress = (): EditingAddress => ({
  label: 'Home',
  isDefault: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  area: '',
  block: '',
  street: '',
  building: '',
  floor: '',
  flatOffice: '',
  notes: '',
});

const mapDtoToEditing = (dto: AddressDto): EditingAddress => ({
  id: dto.id,
  label: dto.label,
  isDefault: dto.isDefault,
  firstName: dto.firstName || '',
  lastName: dto.lastName || '',
  email: dto.email || '',
  phone: dto.phone || '',
  area: dto.area,
  block: dto.block,
  street: dto.street,
  building: dto.building,
  floor: dto.floor || '',
  flatOffice: dto.flatOffice || '',
  notes: dto.notes || '',
});

const AccountAddresses = () => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const isAr = lang === 'ar';
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [editing, setEditing] = useState<EditingAddress | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      toast({ title: t('Failed to load addresses', 'فشل في تحميل العناوين'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast({ title: t('Address deleted', 'تم حذف العنوان') });
    } catch (error) {
      toast({ title: t('Failed to delete address', 'فشل في حذف العنوان'), variant: 'destructive' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast({ title: t('Default address updated', 'تم تحديث العنوان الافتراضي') });
    } catch (error) {
      toast({ title: t('Failed to set default address', 'فشل في تعيين العنوان الافتراضي'), variant: 'destructive' });
    }
  };

  const validate = (): boolean => {
    if (!editing) return false;
    const e: Record<string, string> = {};
    const req = t('Required', 'مطلوب');
    if (!editing.firstName.trim()) e.firstName = req;
    if (!editing.lastName.trim()) e.lastName = req;
    if (!editing.email.trim()) e.email = req;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editing.email)) e.email = t('Invalid email', 'بريد غير صالح');
    if (!editing.phone.trim()) e.phone = req;
    if (!editing.area.trim()) e.area = req;
    if (!editing.block.trim()) e.block = req;
    if (!editing.street.trim()) e.street = req;
    if (!editing.building.trim()) e.building = req;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !editing) return;

    setSaving(true);
    try {
      const isNew = !editing.id;
      const payload = {
        label: editing.label,
        isDefault: isNew && addresses.length === 0 ? true : editing.isDefault,
        firstName: editing.firstName,
        lastName: editing.lastName,
        email: editing.email,
        phone: editing.phone,
        area: editing.area,
        block: editing.block,
        street: editing.street,
        building: editing.building,
        floor: editing.floor || undefined,
        flatOffice: editing.flatOffice || undefined,
        notes: editing.notes || undefined,
      };

      if (isNew) {
        const created = await addressService.createAddress(payload as CreateAddressDto);
        if (payload.isDefault) {
          setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), created]);
        } else {
          setAddresses(prev => [...prev, created]);
        }
      } else {
        const updated = await addressService.updateAddress(editing.id!, payload as UpdateAddressDto);
        if (payload.isDefault) {
          setAddresses(prev => prev.map(a => a.id === updated.id ? updated : { ...a, isDefault: false }));
        } else {
          setAddresses(prev => prev.map(a => a.id === updated.id ? updated : a));
        }
      }

      setEditing(null);
      setErrors({});
      toast({ title: t('Address saved', 'تم حفظ العنوان') });
    } catch (error) {
      toast({ title: t('Failed to save address', 'فشل في حفظ العنوان'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setField = (k: keyof EditingAddress, v: string | boolean) =>
    setEditing(prev => prev ? { ...prev, [k]: v } : null);

  const fieldClass = (k: string) =>
    `w-full h-10 px-3 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${errors[k] ? 'border-destructive' : 'border-border'
    }`;

  const labelOptions = ['Home', 'Office', 'Other'];
  const labelTranslations: Record<string, string> = { Home: 'المنزل', Office: 'المكتب', Other: 'أخرى' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">{t('Addresses', 'العناوين')}</h2>
        {!editing && (
          <button
            onClick={() => setEditing(emptyAddress())}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-brand text-brand-foreground rounded-lg hover:bg-brand/90 transition-colors"
          >
            <Plus size={16} />
            {t('Add Address', 'إضافة عنوان')}
          </button>
        )}
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* ── Edit / Add Form ── */}
      {!loading && editing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {addresses.find(a => a.id === editing.id)
                ? t('Edit Address', 'تعديل العنوان')
                : t('Add New Address', 'إضافة عنوان جديد')}
            </h3>
            <button onClick={() => { setEditing(null); setErrors({}); }} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">{t('Label', 'التسمية')} *</label>
            <div className="flex gap-2">
              {labelOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setField('label', opt)}
                  className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${editing.label === opt ? 'border-brand bg-brand/5 text-brand font-medium' : 'border-border text-foreground hover:border-muted-foreground'
                    }`}
                >
                  {isAr ? labelTranslations[opt] : opt}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Contact Information', 'معلومات الاتصال')}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('First Name', 'الاسم الأول')} *</label>
                <input value={editing.firstName} onChange={e => setField('firstName', e.target.value)} className={fieldClass('firstName')} maxLength={50} />
                {errors.firstName && <p className="text-[11px] text-destructive mt-0.5">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Last Name', 'الاسم الأخير')} *</label>
                <input value={editing.lastName} onChange={e => setField('lastName', e.target.value)} className={fieldClass('lastName')} maxLength={50} />
                {errors.lastName && <p className="text-[11px] text-destructive mt-0.5">{errors.lastName}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Email', 'البريد الإلكتروني')} *</label>
                <input type="email" value={editing.email} onChange={e => setField('email', e.target.value)} className={fieldClass('email')} maxLength={100} />
                {errors.email && <p className="text-[11px] text-destructive mt-0.5">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Phone', 'رقم الهاتف')} *</label>
                <input type="tel" value={editing.phone} onChange={e => setField('phone', e.target.value)} className={fieldClass('phone')} placeholder="+965 XXXX XXXX" maxLength={20} />
                {errors.phone && <p className="text-[11px] text-destructive mt-0.5">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Address Details', 'تفاصيل العنوان')}</p>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">{t('Area', 'المنطقة')} *</label>
              <select value={editing.area} onChange={e => setField('area', e.target.value)} className={fieldClass('area')}>
                <option value="">{t('Select area', 'اختر المنطقة')}</option>
                {kuwaitAreas.map(a => (
                  <option key={a.en} value={a.en}>{isAr ? a.ar : a.en}</option>
                ))}
              </select>
              {errors.area && <p className="text-[11px] text-destructive mt-0.5">{errors.area}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Block', 'القطعة')} *</label>
                <input value={editing.block} onChange={e => setField('block', e.target.value)} className={fieldClass('block')} maxLength={10} />
                {errors.block && <p className="text-[11px] text-destructive mt-0.5">{errors.block}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Street', 'الشارع')} *</label>
                <input value={editing.street} onChange={e => setField('street', e.target.value)} className={fieldClass('street')} maxLength={100} />
                {errors.street && <p className="text-[11px] text-destructive mt-0.5">{errors.street}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Building', 'المبنى')} *</label>
                <input value={editing.building} onChange={e => setField('building', e.target.value)} className={fieldClass('building')} maxLength={20} />
                {errors.building && <p className="text-[11px] text-destructive mt-0.5">{errors.building}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Floor', 'الطابق')}</label>
                <input value={editing.floor || ''} onChange={e => setField('floor', e.target.value)} className={fieldClass('floor')} maxLength={10} />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">{t('Flat / Office', 'شقة / مكتب')}</label>
                <input value={editing.flatOffice || ''} onChange={e => setField('flatOffice', e.target.value)} className={fieldClass('flatOffice')} maxLength={20} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">{t('Additional Notes', 'ملاحظات إضافية')}</label>
              <textarea
                value={editing.notes || ''}
                onChange={e => setField('notes', e.target.value)}
                rows={2}
                maxLength={300}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder={t('Special delivery instructions...', 'تعليمات توصيل خاصة...')}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-brand text-brand-foreground rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {t('Save Address', 'حفظ العنوان')}
            </button>
            <button onClick={() => { setEditing(null); setErrors({}); }} className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
              {t('Cancel', 'إلغاء')}
            </button>
          </div>
        </div>
      )}

      {/* ── Address Cards ── */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-card border-2 rounded-xl p-5 relative transition-colors ${addr.isDefault ? 'border-brand' : 'border-border'}`}>
              {addr.isDefault && (
                <span className="absolute top-3 end-3 text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Star size={10} className="fill-brand" /> {t('Default', 'افتراضي')}
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-foreground text-sm">{addr.label}</p>
                  <p className="text-sm text-foreground">{addr.firstName} {addr.lastName}</p>
                  <p className="text-xs text-muted-foreground">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground">{addr.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t('Area', 'المنطقة')} {addr.area}, {t('Block', 'قطعة')} {addr.block}, {addr.street}, {t('Bldg', 'مبنى')} {addr.building}
                    {addr.floor && `, ${t('Floor', 'طابق')} ${addr.floor}`}
                    {addr.flatOffice && `, ${addr.flatOffice}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <button onClick={() => setEditing(mapDtoToEditing(addr))} className="text-xs text-brand hover:underline flex items-center gap-1"><Edit2 size={12} /> {t('Edit', 'تعديل')}</button>
                {!addr.isDefault && (
                  <>
                    <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Star size={12} /> {t('Set Default', 'تعيين افتراضي')}</button>
                    <button onClick={() => handleDelete(addr.id)} className="text-xs text-destructive hover:underline flex items-center gap-1 ms-auto"><Trash2 size={12} /> {t('Delete', 'حذف')}</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && addresses.length === 0 && !editing && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('No saved addresses yet.', 'لا توجد عناوين محفوظة بعد.')}</p>
        </div>
      )}
    </div>
  );
};

export default AccountAddresses;
