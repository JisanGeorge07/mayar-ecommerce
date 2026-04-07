import { Phone, Mail, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/hooks/useLocale';

const AccountSecurity = () => {
  const { user } = useAuth();
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const items = [
    { icon: Phone, label: t('Registered Phone', 'الهاتف المسجل'), value: user?.phone || '—' },
    { icon: Mail, label: t('Registered Email', 'البريد المسجل'), value: user?.email || '—' },
    { icon: Clock, label: t('Last Login', 'آخر دخول'), value: new Date().toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { icon: Shield, label: t('Account Status', 'حالة الحساب'), value: t('Active', 'نشط') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-foreground">{t('Security & Login', 'الأمان وتسجيل الدخول')}</h2>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-sm text-muted-foreground">
          {t(
            'To update your login details, please contact support. Phone and email changes require OTP verification for security.',
            'لتحديث بيانات تسجيل الدخول، يرجى التواصل مع الدعم. تغيير الهاتف والبريد يتطلب رمز تحقق.'
          )}
        </p>
      </div>
    </div>
  );
};

export default AccountSecurity;
