import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { authService } from '@/services/api/authService';
import { authPageSettings } from '@/data/mock/siteSettings';
import logoImg from '@/assets/logo.png';
import signupBg from '@/assets/auth-signup-bg.jpg';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  pinCode?: string;
}

const SignupPage = () => {
  const { lang } = useLocale();
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  const settings = authPageSettings.signup;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    country: '',
    pinCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = isAr ? 'الاسم مطلوب' : 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = isAr ? 'بريد إلكتروني غير صالح' : 'Invalid email';
    if (!form.password) {
      e.password = isAr ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (form.password.length < 8) {
      e.password = isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(form.password)) {
      e.password = isAr ? 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل' : 'Password must contain at least one letter';
    } else if (!/\d/.test(form.password)) {
      e.password = isAr ? 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' : 'Password must contain at least one number';
    }

    if (!form.confirmPassword) {
      e.confirmPassword = isAr ? 'يرجى تأكيد كلمة المرور' : 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }
    if (!form.address.trim()) e.address = isAr ? 'العنوان مطلوب' : 'Address is required';
    if (!form.country.trim()) e.country = isAr ? 'الدولة مطلوبة' : 'Country is required';
    if (!form.pinCode.trim()) e.pinCode = isAr ? 'الرمز البريدي مطلوب' : 'Pin code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    const res = await authService.signup({
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber || undefined,
      address: form.address,
      country: form.country,
      pinCode: form.pinCode,
    });
    setLoading(false);
    if (res.success) {
      navigate('/login', { state: { registered: true } });
    } else {
      setServerError(res.message);
    }
  };

  const fields: { key: keyof typeof form; label: string; labelAr: string; type: string; placeholder: string; dir?: string; maxLength?: number; required?: boolean }[] = [
    { key: 'name', label: 'Full Name', labelAr: 'الاسم الكامل', type: 'text', placeholder: 'John Doe', maxLength: 100, required: true },
    { key: 'email', label: 'Email', labelAr: 'البريد الإلكتروني', type: 'email', placeholder: 'john@example.com', dir: 'ltr', maxLength: 255, required: true },
    { key: 'phoneNumber', label: 'Phone Number (Optional)', labelAr: 'رقم الهاتف (اختياري)', type: 'tel', placeholder: '+965 XXXX XXXX', dir: 'ltr', maxLength: 20, required: false },
    { key: 'address', label: 'Full Address', labelAr: 'العنوان الكامل', type: 'text', placeholder: 'Block 5, Street 10, Kuwait City', maxLength: 300, required: true },
    { key: 'country', label: 'Country', labelAr: 'الدولة', type: 'text', placeholder: 'Kuwait', maxLength: 100, required: true },
    { key: 'pinCode', label: 'Pin Code', labelAr: 'الرمز البريدي', type: 'text', placeholder: '12345', dir: 'ltr', maxLength: 10, required: true },
    { key: 'password', label: 'Password', labelAr: 'كلمة المرور', type: 'password', placeholder: '••••••••', dir: 'ltr', maxLength: 100, required: true },
    { key: 'confirmPassword', label: 'Confirm Password', labelAr: 'تأكيد كلمة المرور', type: 'password', placeholder: '••••••••', dir: 'ltr', maxLength: 100, required: true }
  ];

  return (
    <div className="min-h-screen flex" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Left image panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={signupBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-secondary p-4 sm:p-8 py-8">
        <div className="w-full max-w-md">
          {/* Mobile hero banner */}
          <div className="lg:hidden relative rounded-xl overflow-hidden mb-8 h-44">
            <img src={signupBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
              {isAr ? 'إنشاء حساب' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isAr ? 'انضم إلى ميار شوب' : 'Join Mayar Shop'}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-hero border border-border p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => {
                const isPasswordField = f.key === 'password';
                const isConfirmPasswordField = f.key === 'confirmPassword';
                const showToggle = isPasswordField || isConfirmPasswordField;
                const isVisible = isPasswordField ? showPassword : isConfirmPasswordField ? showConfirmPassword : false;
                const toggleVisibility = isPasswordField
                  ? () => setShowPassword(!showPassword)
                  : isConfirmPasswordField
                    ? () => setShowConfirmPassword(!showConfirmPassword)
                    : undefined;

                return (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {isAr ? f.labelAr : f.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showToggle ? (isVisible ? 'text' : 'password') : f.type}
                        value={form[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        dir={f.dir}
                        maxLength={f.maxLength}
                        className={`w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${showToggle ? 'pe-10' : ''}`}
                      />
                      {showToggle && (
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                    {errors[f.key] && <p className="text-destructive text-xs mt-0.5">{errors[f.key]}</p>}
                    {isPasswordField && !errors.password && form.password.length > 0 && form.password.length < 8 && (
                      <p className="text-muted-foreground text-xs mt-0.5">{isAr ? 'الحد الأدنى 8 أحرف، حرف واحد، رقم واحد' : 'Min 8 characters, 1 letter, 1 number'}</p>
                    )}
                  </div>
                );
              })}

              {serverError && <p className="text-destructive text-sm">{serverError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand text-brand-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {isAr ? 'إنشاء حساب' : 'Sign Up'}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <Link to="/login" className="text-brand font-medium hover:underline">
                  {isAr ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
