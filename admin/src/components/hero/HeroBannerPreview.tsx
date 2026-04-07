import React from 'react';
import type { HeroBanner } from '@/types/heroBanner';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  banner: HeroBanner;
  lang?: 'en' | 'ar';
  currency?: 'KWD' | 'INR';
}

export default function HeroBannerPreview({ banner, lang = 'en', currency = 'KWD' }: Props) {
  const label = lang === 'ar' ? banner.label_ar : banner.label_en;
  const title = lang === 'ar' ? banner.title_ar : banner.title_en;
  const ctaText = lang === 'ar' ? banner.cta_text_ar : banner.cta_text_en;

  const currentPrice = currency === 'INR' ? banner.current_price_inr : banner.current_price_kwd;
  const oldPrice = currency === 'INR' ? banner.old_price_inr : banner.old_price_kwd;
  const currencyCode = currency;

  const hasCurrentPrice = currentPrice != null;
  const hasOldPrice = oldPrice != null && oldPrice > 0;

  return (
    <div className="w-full">
      {/* Hero container – matches storefront 2048:868 ≈ 2.36:1 ratio */}
      <div className="relative w-full overflow-hidden rounded-lg border border-border" style={{ aspectRatio: '2048 / 868' }}>
        {/* Background image */}
        {banner.desktop_image_url ? (
          <img
            src={banner.desktop_image_url}
            alt={banner.alt_text || title || 'Hero banner'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center space-y-2">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/50">
                Recommended: 2048 × 868 px wide landscape image
              </p>
            </div>
          </div>
        )}

        {/* White content card – left-aligned, vertically centered */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-6 sm:pl-10 md:pl-14">
          <div
            className="bg-white rounded-2xl shadow-xl px-6 py-7 sm:px-8 sm:py-9 max-w-[240px] sm:max-w-[280px] space-y-3"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Eyebrow label */}
            {label ? (
              <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">
                {label}
              </span>
            ) : null}

            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-gray-900">
              {title || 'Banner Title'}
            </h2>

            {/* Pricing row */}
            {(hasCurrentPrice || hasOldPrice) && (
              <div className="flex items-baseline gap-2 flex-wrap">
                {hasOldPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {oldPrice} {currencyCode}
                  </span>
                )}
                {hasCurrentPrice && (
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {currentPrice} {currencyCode}
                  </span>
                )}
              </div>
            )}

            {/* CTA button */}
            <button className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm">
              {ctaText || 'Shop now'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
