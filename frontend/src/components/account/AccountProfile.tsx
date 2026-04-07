import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/hooks/useLocale';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/api/authService';

const AccountProfile = () => {
  const { user, setUser } = useAuth();
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || 'Kuwait',
    address: user?.address || '',
    pinCode: user?.pinCode || '',
  });

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const result = await authService.updateProfile({
        name: form.name,
        phoneNumber: form.phoneNumber,
        address: form.address,
        country: form.country,
        pinCode: form.pinCode,
      });

      if (result.success && result.user) {
        setUser(result.user);
        toast({
          title: t('Success', 'نجح'),
          description: t('Profile updated successfully', 'تم تحديث الحساب بنجاح')
        });
      } else {
        toast({
          title: t('Error', 'خطأ'),
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: t('Error', 'خطأ'),
        description: t('Failed to update profile', 'فشل تحديث الحساب'),
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof typeof form; label: string; type?: string; disabled?: boolean }[] = [
    { key: 'name', label: t('Full Name', 'الاسم الكامل') },
    { key: 'email', label: t('Email', 'البريد الإلكتروني'), type: 'email', disabled: true },
    { key: 'phoneNumber', label: t('Phone Number', 'رقم الهاتف'), type: 'tel' },
    { key: 'country', label: t('Country', 'الدولة') },
    { key: 'address', label: t('Default Address', 'العنوان الافتراضي') },
    { key: 'pinCode', label: t('Pin Code', 'الرمز البريدي') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">{t('Profile Details', 'تفاصيل الحساب')}</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                disabled={f.disabled}
                className={`w-full h-10 px-3 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring ${f.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              />
              {f.disabled && f.key === 'email' && (
                <p className="text-xs text-muted-foreground mt-1">{t('Email cannot be changed', 'لا يمكن تغيير البريد الإلكتروني')}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? t('Saving...', 'جارٍ الحفظ...') : t('Save Changes', 'حفظ التعديلات')}
        </button>
      </div>
    </div>
  );
};

export default AccountProfile;
