import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/hooks/useLocale';
import { heroSlideApi, type HeroSlideDto } from '@/services/api/heroSlideService';
import { routes } from '@/lib/routes';

const AUTOPLAY_MS = 6000;

const contentVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Helper to generate link URL based on linkType using slugs
const getSlideLink = (slide: HeroSlideDto): string => {
  switch (slide.linkType) {
    case 'category':
      return slide.categorySlug ? routes.category(slide.categorySlug) : routes.shop;
    case 'subcategory':
      if (slide.categorySlug && slide.subcategorySlug) {
        return routes.subcategory(slide.categorySlug, slide.subcategorySlug);
      }
      return routes.shop;
    case 'product_type':
      if (slide.categorySlug && slide.subcategorySlug && slide.productTypeSlug) {
        return routes.productType(slide.categorySlug, slide.subcategorySlug, slide.productTypeSlug);
      }
      return routes.shop;
    case 'product':
      return slide.productSlug ? routes.product(slide.productSlug) : routes.shop;
    case 'custom_url':
      return slide.customUrl || routes.shop;
    default:
      return routes.shop;
  }
};

const HeroSlider = () => {
  const { lang, currency, formatPrice, dir } = useLocale();
  const [slides, setSlides] = useState<HeroSlideDto[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await heroSlideApi.getActive();
        setSlides(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Preload all hero images before showing slider
  useEffect(() => {
    if (slides.length === 0) return;

    let mounted = true;
    const promises = slides.map(
      (slide) =>
        new Promise<void>((resolve) => {
          const imageUrl = slide.desktopImageUrl;
          if (!imageUrl) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = imageUrl;
        })
    );
    Promise.all(promises).then(() => {
      if (mounted) setImagesLoaded(true);
    });
    return () => { mounted = false; };
  }, [slides]);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  // Autoplay
  useEffect(() => {
    if (!imagesLoaded || slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imagesLoaded, slides.length]);

  // Helper to get localized text
  const getText = (en?: string, ar?: string) => {
    return lang === 'ar' ? (ar || en || '') : (en || ar || '');
  };

  // Helper to get localized price
  const getPrice = (kwd?: number | null, inr?: number | null) => {
    if (currency === 'INR') return inr;
    return kwd;
  };

  // Horizontal slide variants — adjust for RTL
  const isRtl = dir === 'rtl';
  const slideVariants = {
    enter: (d: number) => ({
      x: `${(isRtl ? -d : d) * 100}%`,
      opacity: 1,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({
      x: `${(isRtl ? d : -d) * 100}%`,
      opacity: 1,
    }),
  };

  if (loading || !imagesLoaded || slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-secondary">
        <div className="aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const currentPrice = getPrice(slide.currentPriceKWD, slide.currentPriceINR);
  const oldPrice = getPrice(slide.oldPriceKWD, slide.oldPriceINR);
  const slideLink = getSlideLink(slide);

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <div className="relative aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
        {/* Sliding images only */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 will-change-transform"
          >
            <picture>
              {slide.mobileImageUrl && (
                <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl} />
              )}
              <img
                src={slide.desktopImageUrl}
                alt={slide.altText || getText(slide.titleEnglish, slide.titleArabic)}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Fixed promotional card – only inner content animates */}
        <div className="absolute bottom-4 start-4 md:bottom-12 md:start-12 lg:bottom-16 lg:start-16 z-10">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg md:rounded-xl px-3 py-2.5 md:p-6 shadow-hero max-w-[200px] md:max-w-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {(slide.labelEnglish || slide.labelArabic) && (
                  <p className="text-[10px] md:text-sm font-medium text-brand uppercase tracking-wider mb-0.5 md:mb-1">
                    {getText(slide.labelEnglish, slide.labelArabic)}
                  </p>
                )}
                <h2 className="text-sm md:text-xl lg:text-2xl font-heading font-bold text-foreground leading-tight mb-1 md:mb-2">
                  {getText(slide.titleEnglish, slide.titleArabic)}
                </h2>
                {(slide.descriptionEnglish || slide.descriptionArabic) && (
                  <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 line-clamp-2">
                    {getText(slide.descriptionEnglish, slide.descriptionArabic)}
                  </p>
                )}
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-4">
                  {oldPrice && (
                    <span className="text-muted-foreground line-through text-[11px] md:text-sm">
                      {formatPrice(oldPrice)}
                    </span>
                  )}
                  {currentPrice && (
                    <span className="text-brand font-bold text-sm md:text-xl">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                </div>
                <a
                  href={slideLink}
                  className="inline-flex items-center justify-center px-4 py-1.5 md:px-6 md:py-2.5 bg-header text-header-foreground text-xs md:text-sm font-medium rounded-md hover:bg-header/90 transition-colors"
                >
                  {getText(slide.ctaTextEnglish, slide.ctaTextArabic) || (lang === 'ar' ? 'تسوق الآن' : 'Shop now')}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 start-3 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors z-10"
          aria-label="Previous"
        >
          {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 end-3 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors z-10"
          aria-label="Next"
        >
          {dir === 'rtl' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-foreground/30'
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
