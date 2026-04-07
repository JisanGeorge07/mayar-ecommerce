import { useState, useCallback } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { newsletterApi } from '@/services/api/newsletterService';
import { Mail, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'idle' | 'loading' | 'success';

const NewsletterBlock = () => {
  const { lang } = useLocale();
  const { user, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');

  const validate = (v: string) => {
    if (!v.trim()) return lang === 'ar' ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setError('');
    setPhase('loading');

    try {
      const userId = isLoggedIn && user?.id ? user.id : undefined;
      const response = await newsletterApi.subscribe(email.trim(), userId);

      if (response.data.success) {
        setPhase('success');
      } else {
        setError(response.data.message || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again'));
        setPhase('idle');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again');
      setError(errorMessage);
      setPhase('idle');
    }
  }, [email, lang, isLoggedIn, user]);

  return (
    <section data-newsletter className="py-12 md:py-20 bg-header text-header-foreground">
      <div className="container text-center max-w-xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {phase === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.3 }}
                >
                  <Check size={32} className="text-brand" strokeWidth={3} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="font-heading text-xl md:text-2xl font-bold"
              >
                {lang === 'ar' ? 'شكراً لانضمامك إلى ميار' : 'Thank you for joining Mayar'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-header-muted text-sm leading-relaxed max-w-sm text-justify"
              >
                {lang === 'ar'
                  ? 'سنبقيك على اطلاع بأحدث العروض الحصرية والوصولات الجديدة والمجموعات المميزة من ميار شوب.'
                  : "We'll keep you updated with exclusive offers, fresh arrivals, and premium new collections from Mayar Shop."}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Mail size={32} className="mx-auto mb-4 text-brand" />
              <h2 className="font-heading text-xl md:text-2xl font-bold mb-2">
                {lang === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
              </h2>
              <p className="text-header-muted text-sm mb-6">
                {lang === 'ar'
                  ? 'احصل على آخر العروض والمنتجات الجديدة مباشرة في بريدك'
                  : 'Get the latest offers and new arrivals delivered to your inbox'}
              </p>
              <form onSubmit={handleSubmit} noValidate className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    disabled={phase === 'loading'}
                    className="flex-1 h-11 px-4 rounded-md bg-header-foreground/10 border border-header-muted/20 text-header-foreground placeholder:text-header-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60 transition-opacity"
                  />
                  <button
                    type="submit"
                    disabled={phase === 'loading'}
                    className="h-11 px-6 bg-brand text-brand-foreground font-medium text-sm rounded-md hover:bg-brand/90 transition-all flex-shrink-0 disabled:opacity-80 flex items-center gap-2 min-w-[110px] justify-center"
                  >
                    {phase === 'loading' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      lang === 'ar' ? 'اشترك' : 'Subscribe'
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-brand font-medium text-start"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsletterBlock;
