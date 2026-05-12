import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import { authPageSettings } from '@/data/mock/siteSettings';
import logoImg from '@/assets/logo.png';
import loginBg from '@/assets/auth-login-bg.jpg';

const LoginPage = () => {
  const { lang } = useLocale();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = lang === 'ar';
  const registered = (location.state as any)?.registered;
  const settings = authPageSettings.login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(isAr ? 'أدخل بريد إلكتروني صالح' : 'Enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const res = await authService.login({ email, password });
    setLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Left image panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h2 className="font-heading text-3xl xl:text-4xl font-bold text-white drop-shadow-lg mb-3">
            {isAr ? settings.heading.ar : settings.heading.en}
          </h2>
          <p className="text-white/85 text-lg max-w-md drop-shadow">
            {isAr ? settings.subheading.ar : settings.subheading.en}
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile hero banner */}
          <div className="lg:hidden relative rounded-xl overflow-hidden mb-8 h-48">
            <img src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex flex-col justify-end h-full p-5">
              <h2 className="font-heading text-xl font-bold text-white drop-shadow mb-1">
                {isAr ? settings.heading.ar : settings.heading.en}
              </h2>
              <p className="text-white/80 text-sm drop-shadow">
                {isAr ? settings.subheading.ar : settings.subheading.en}
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <Link to="/">
              <img src={logoImg} alt="Mayar Shop" className="h-12 mx-auto mb-4" />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {isAr ? 'تسجيل الدخول' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isAr ? 'أدخل بريدك الإلكتروني وكلمة المرور للمتابعة' : 'Enter your email and password to continue'}
            </p>
          </div>

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm text-center">
              {isAr
                ? 'تم إنشاء حسابك بنجاح! سجّل الدخول باستخدام بريدك الإلكتروني.'
                : 'Account created successfully! Log in with your email.'}
            </div>
          )}

          <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                    className="w-full h-11 ps-10 pe-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                 <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {isAr ?'كلمة المرور': 'Password'}
                  </label>
                  <Link to="/forgot-password" className="text-xs text-brand hover:underline">
                    {isAr ?'نسيت كلمة المرور؟': 'Forgot Password?'}
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   
                    className="w-full h-11 ps-10 pe-10 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                {isAr ? 'تسجيل الدخول' : 'Login'}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <Link to="/signup" className="text-brand font-medium hover:underline">
                  {isAr ? 'إنشاء حساب' : 'Sign Up'}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
