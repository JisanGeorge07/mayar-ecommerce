import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/hooks/useLocale';
import { useSettings } from '@/context/SettingsContext';
import { useTrackingPopup } from '@/context/TrackingPopupContext';
import logoImg from '@/assets/logo.png';

const FloatingTrackingBar = () => {
  const { lang } = useLocale();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { isOpen, open, close } = useTrackingPopup();
  const [nearFooter, setNearFooter] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobile, setMobile] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const barRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';
  const enableOrderTracking = settings?.enableOrderTracking ?? false;

  const handleScroll = useCallback(() => {
    const newsletter = document.querySelector('[data-newsletter]');
    const footerBottom = document.querySelector('[data-footer-bottom]');
    const footer = document.querySelector('footer');
    if (!barRef.current) return;
    const barRect = barRef.current.getBoundingClientRect();
    const barBottom = barRect.bottom + 16;
    const newsletterTop = newsletter?.getBoundingClientRect().top ?? Infinity;
    const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
    setNearFooter(Math.min(newsletterTop, footerTop) < barBottom);

    // Hide when the bar would overlap the footer bottom copyright row
    const bottomRowTop = footerBottom?.getBoundingClientRect().top ?? Infinity;
    setHidden(bottomRowTop < barRect.bottom + 8);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isOpen) setError('');
  }, [isOpen]);

  const handleTrack = () => {
    if (!mobile.trim() || !trackingId.trim()) {
      setError(isAr ? 'يرجى إدخال رقم الجوال ورقم التتبع' : 'Please enter mobile number and tracking ID');
      return;
    }
    setError('');
    navigate(`/track-order?mobile=${encodeURIComponent(mobile.trim())}&id=${encodeURIComponent(trackingId.trim())}`);
    close();
    setMobile('');
    setTrackingId('');
  };

  const toggle = () => (isOpen ? close() : open());

  const buttonBg = nearFooter ? 'bg-brand' : 'bg-primary';
  const buttonHover = nearFooter ? 'hover:bg-brand/90' : 'hover:bg-primary/90';
  const textColor = nearFooter ? 'text-brand-foreground' : 'text-primary-foreground';

  // Hide entire component if order tracking is disabled
  if (!enableOrderTracking) return null;

  return (
    <div ref={barRef} className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md transition-opacity duration-200 ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <img src={logoImg} alt="Mayar" className="h-6 w-auto" loading="eager" />
                  <h3 className="text-sm font-semibold text-foreground font-display">
                    {isAr ? 'تتبع الطرد' : 'Track Package'}
                  </h3>
                </div>
                <button onClick={close} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {isAr ? 'تتبع طلبك في الوقت الحقيقي بأمان' : 'Safe & secure real-time order tracking'}
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder={isAr ? 'رقم الجوال' : 'Mobile Number'}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder={isAr ? 'رقم التتبع (مثال: MYR-2024-001)' : 'Tracking ID (e.g. MYR-2024-001)'}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
                <button
                  onClick={handleTrack}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {isAr ? 'تتبع' : 'Track'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact bar */}
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={toggle}
        className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 ${buttonBg} ${textColor} rounded-2xl shadow-lg ${buttonHover} transition-all duration-300`}
      >
        <Package size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium leading-none">{isAr ? 'تتبع الطرد' : 'Track Package'}</span>
        {isOpen ? <ChevronDown size={16} className="flex-shrink-0" /> : <ChevronUp size={16} className="flex-shrink-0" />}
      </motion.button>
    </div>
  );
};

export default FloatingTrackingBar;
