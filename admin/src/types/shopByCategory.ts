export type LinkType = 'category' | 'subcategory' | 'product_type' | 'product' | 'custom_url';

export interface ShopByCategoryItem {
  id: string;
  internal_name: string;
  title_en: string;
  title_ar: string;
  image_url: string;
  alt_text: string;
  link_type: LinkType;
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

export const INITIAL_SHOP_BY_CATEGORY: Omit<ShopByCategoryItem, 'id' | 'created_at' | 'updated_at'> = {
  internal_name: '',
  title_en: '',
  title_ar: '',
  image_url: '',
  alt_text: '',
  link_type: 'category',
  category_id: '',
  subcategory_id: '',
  product_type_id: '',
  product_id: '',
  custom_url: '',
  sort_order: 1,
  is_active: true,
  is_published: false,
};
