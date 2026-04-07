export type PromoBannerLinkType = 'category' | 'subcategory' | 'product_type' | 'product' | 'custom_url';
export type PromoBannerLayoutType = 'small' | 'large';

export interface PromoBannerItem {
  id: string;
  internal_name: string;
  layout_type: PromoBannerLayoutType;
  label_en: string;
  label_ar: string;
  title_en: string;
  title_ar: string;
  cta_text_en: string;
  cta_text_ar: string;
  desktop_image_url: string;
  mobile_image_url: string;
  alt_text: string;
  link_type: PromoBannerLinkType;
  category_id: string;
  subcategory_id: string;
  product_type_id: string;
  product_id: string;
  custom_url: string;
  sort_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const INITIAL_PROMO_BANNER: Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'> = {
  internal_name: '',
  layout_type: 'small',
  label_en: '',
  label_ar: '',
  title_en: '',
  title_ar: '',
  cta_text_en: 'Shop now',
  cta_text_ar: 'تسوق الآن',
  desktop_image_url: '',
  mobile_image_url: '',
  alt_text: '',
  link_type: 'category',
  category_id: '',
  subcategory_id: '',
  product_type_id: '',
  product_id: '',
  custom_url: '',
  sort_order: 0,
  is_active: true,
  is_published: false,
};
