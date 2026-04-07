import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { authService } from '@/services/api/authService';
import { authPageSettings } from '@/data/mock/siteSettings';
import logoImg from '@/assets/logo.png';
import loginBg from '@/assets/auth-login-bg.jpg';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const ForgotPasswordPage = () => {
  const { lang } = useLocale();
  const isAr = lang === 'ar';
  const settings = authPageSettings.login;
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(!RECAPTCHA_SITE_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(t('Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صالح'));
      return;
    }
    if (RECAPTCHA_SITE_KEY && !recaptchaChecked) {
      setError(t('Please complete the reCAPTCHA verification', 'يرجى إكمال التحقق من reCAPTCHA'));
      return;
    }
    setLoading(true);
    await authService.forgotPassword({ email, recaptchaToken: recaptchaChecked ? 'verified' : undefined });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h2 className="font-heading text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-3">
            {t(settings.heading.en, settings.heading.ar)}
          </h2>
          <p className="text-white/85 text-lg max-w-md drop-shadow">
            {t(settings.subheading.en, settings.subheading.ar)}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img src={logoImg} alt="Mayar Shop" className="h-12 mx-auto mb-4" />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t('Reset Password', 'إعادة تعيين كلمة المرور')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t('Enter your email and we\'ll send you a reset link', 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين')}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
            {sent ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 size={48} className="mx-auto text-brand" />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t('Check Your Email', 'تحقق من بريدك الإلكتروني')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    'If an account exists with this email, you will receive a password reset link shortly.',
                    'إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، ستتلقى رابط إعادة تعيين كلمة المرور قريبًا.'
                  )}
                </p>
                <Link to="/login" className="inline-block mt-4 text-brand font-medium text-sm hover:underline">
                  {t('Back to Login', 'العودة لتسجيل الدخول')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t('Email', 'البريد الإلكتروني')}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 ps-10 pe-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      dir="ltr"
                      maxLength={255}
                    />
                  </div>
                </div>

                {RECAPTCHA_SITE_KEY ? (
                  <div className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={recaptchaChecked}
                      onChange={(e) => setRecaptchaChecked(e.target.checked)}
                      className="h-5 w-5 rounded border-border text-brand focus:ring-brand accent-brand"
                    />
                    <span className="text-sm text-muted-foreground">{t("I'm not a robot", 'لست روبوتًا')}</span>
                  </div>
                ) : null}

                {error && <p className="text-destructive text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {t('Send Reset Link', 'إرسال رابط إعادة التعيين')}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-brand font-medium hover:underline">
                    {t('Back to Login', 'العودة لتسجيل الدخول')}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
