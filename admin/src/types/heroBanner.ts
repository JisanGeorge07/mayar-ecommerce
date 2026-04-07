export type HeroBannerStatus = 'draft' | 'published';
export type HeroBannerLinkType = 'category' | 'subcategory' | 'product_type' | 'product' | 'custom_url';

export interface HeroBanner {
  id: string;
  banner_name: string;
  slug: string;
  // Bilingual labels
  label_en: string;
  label_ar: string;
  // Bilingual titles
  title_en: string;
  title_ar: string;
  // Bilingual descriptions
  description_en: string;
  description_ar: string;
  // Bilingual CTA
  cta_text_en: string;
  cta_text_ar: string;
  // Multi-currency pricing
  current_price_kwd: number | null;
  old_price_kwd: number | null;
  current_price_inr: number | null;
  old_price_inr: number | null;
  // Link target
  link_type: HeroBannerLinkType;
  category_id: string;
  subcategory_id: string;
  product_type_id: string;
  product_id: string;
  custom_url: string;
  // Media
  desktop_image_url: string;
  mobile_image_url: string;
  alt_text: string;
  // Admin
  sort_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const INITIAL_HERO_BANNER: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'> = {
  banner_name: '',
  slug: '',
  label_en: '',
  label_ar: '',
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  cta_text_en: 'Shop now',
  cta_text_ar: 'تسوق الآن',
  current_price_kwd: null,
  old_price_kwd: null,
  current_price_inr: null,
  old_price_inr: null,
  link_type: 'category',
  category_id: '',
  subcategory_id: '',
  product_type_id: '',
  product_id: '',
  custom_url: '',
  desktop_image_url: '',
  mobile_image_url: '',
  alt_text: '',
  sort_order: 0,
  is_active: true,
  is_published: false,
};
