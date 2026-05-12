import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { authService } from '@/services/api/authService';
import logoImg from '@/assets/logo.png';

const ResetPasswordPage = () => {
  const { lang } = useLocale();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const isAr = lang === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 8) {
      setError(t('Password must be at least 8 characters', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'));
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError(t('Password must contain at least one letter', 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل'));
      return;
    }
    if (!/\d/.test(password)) {
      setError(t('Password must contain at least one number', 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('Passwords do not match', 'كلمات المرور غير متطابقة'));
      return;
    }

    setLoading(true);
    const res = await authService.resetPassword({ token, newPassword: password });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoImg} alt="Mayar Shop" className="h-12 mx-auto mb-4" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {t('Set New Password', 'تعيين كلمة مرور جديدة')}
          </h1>
        </div>

        <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-brand" />
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {t('Password Updated', 'تم تحديث كلمة المرور')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('Your password has been reset successfully.', 'تم إعادة تعيين كلمة المرور بنجاح.')}
              </p>
              <Link to="/login" className="inline-block mt-4 bg-brand text-brand-foreground rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
                {t('Go to Login', 'الذهاب لتسجيل الدخول')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t('New Password', 'كلمة المرور الجديدة')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                    maxLength={128}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{t('Min 8 characters, 1 letter, 1 number', 'الحد الأدنى 8 أحرف، حرف واحد، رقم واحد')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t('Confirm Password', 'تأكيد كلمة المرور')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                    maxLength={128}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t('Reset Password', 'إعادة تعيين كلمة المرور')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
