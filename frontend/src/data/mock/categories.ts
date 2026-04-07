import type { TranslatedText } from '@/types';

export interface SubcategoryItem {
  id: string;
  categoryId: string;
  slug: string;
  name: TranslatedText;
}

export interface ProductTypeItem {
  id: string;
  categoryId: string;
  subcategorySlug: string;
  slug: string;
  name: TranslatedText;
}

export interface FullCategory {
  id: string;
  slug: string;
  name: TranslatedText;
  description?: TranslatedText;
  subcategories: SubcategoryItem[];
}

export const fullCategories: FullCategory[] = [
  {
    id: 'women', slug: 'women',
    name: { en: 'Women', ar: 'نساء' },
    description: { en: "Shop the latest women's fashion", ar: 'تسوقي أحدث الأزياء النسائية' },
    subcategories: [
      { id: 'w-dresses', categoryId: 'women', slug: 'dresses', name: { en: 'Dresses', ar: 'فساتين' } },
      { id: 'w-tops', categoryId: 'women', slug: 'tops', name: { en: 'Tops', ar: 'بلايز' } },
      { id: 'w-handbags', categoryId: 'women', slug: 'handbags', name: { en: 'Handbags', ar: 'حقائب يد' } },
      { id: 'w-heels', categoryId: 'women', slug: 'heels', name: { en: 'Heels', ar: 'كعب' } },
      { id: 'w-jewelry', categoryId: 'women', slug: 'jewelry', name: { en: 'Jewelry', ar: 'مجوهرات' } },
      { id: 'w-skirts', categoryId: 'women', slug: 'skirts', name: { en: 'Skirts', ar: 'تنانير' } },
      { id: 'w-trousers', categoryId: 'women', slug: 'trousers', name: { en: 'Trousers', ar: 'بناطيل' } },
      { id: 'w-outerwear', categoryId: 'women', slug: 'outerwear', name: { en: 'Outerwear', ar: 'ملابس خارجية' } },
      { id: 'w-knitwear', categoryId: 'women', slug: 'knitwear', name: { en: 'Knitwear', ar: 'تريكو' } },
      { id: 'w-abayas', categoryId: 'women', slug: 'abayas', name: { en: 'Abayas', ar: 'عبايات' } },
      { id: 'w-kaftans', categoryId: 'women', slug: 'kaftans', name: { en: 'Kaftans', ar: 'قفاطين' } },
      { id: 'w-coord-sets', categoryId: 'women', slug: 'coord-sets', name: { en: 'Coord Sets', ar: 'أطقم' } },
      { id: 'w-boots', categoryId: 'women', slug: 'boots', name: { en: 'Boots', ar: 'بوتات' } },
    ],
  },
  {
    id: 'men', slug: 'men',
    name: { en: 'Men', ar: 'رجال' },
    description: { en: 'Premium menswear collection', ar: 'مجموعة ملابس رجالية فاخرة' },
    subcategories: [
      { id: 'm-shirts', categoryId: 'men', slug: 'shirts', name: { en: 'Shirts', ar: 'قمصان' } },
      { id: 'm-tshirts', categoryId: 'men', slug: 't-shirts', name: { en: 'T-Shirts', ar: 'تيشيرتات' } },
      { id: 'm-blazers', categoryId: 'men', slug: 'blazers', name: { en: 'Blazers', ar: 'بليزرات' } },
      { id: 'm-sneakers', categoryId: 'men', slug: 'sneakers', name: { en: 'Sneakers', ar: 'سنيكرز' } },
      { id: 'm-trousers', categoryId: 'men', slug: 'trousers', name: { en: 'Trousers', ar: 'بناطيل' } },
      { id: 'm-jeans', categoryId: 'men', slug: 'jeans', name: { en: 'Jeans', ar: 'جينز' } },
      { id: 'm-outerwear', categoryId: 'men', slug: 'outerwear', name: { en: 'Outerwear', ar: 'ملابس خارجية' } },
      { id: 'm-knitwear', categoryId: 'men', slug: 'knitwear', name: { en: 'Knitwear', ar: 'تريكو' } },
      { id: 'm-polos', categoryId: 'men', slug: 'polos', name: { en: 'Polos', ar: 'بولو' } },
      { id: 'm-belts', categoryId: 'men', slug: 'belts', name: { en: 'Belts', ar: 'أحزمة' } },
    ],
  },
  {
    id: 'beauty', slug: 'beauty',
    name: { en: 'Beauty', ar: 'جمال' },
    description: { en: 'Discover beauty essentials', ar: 'اكتشفي أساسيات الجمال' },
    subcategories: [
      { id: 'b-makeup', categoryId: 'beauty', slug: 'makeup', name: { en: 'Makeup', ar: 'مكياج' } },
      { id: 'b-skincare', categoryId: 'beauty', slug: 'skincare', name: { en: 'Skincare', ar: 'عناية بالبشرة' } },
      { id: 'b-bathbody', categoryId: 'beauty', slug: 'bath-body', name: { en: 'Bath & Body', ar: 'استحمام وعناية' } },
      { id: 'b-haircare', categoryId: 'beauty', slug: 'hair-care', name: { en: 'Hair Care', ar: 'عناية بالشعر' } },
      { id: 'b-tools', categoryId: 'beauty', slug: 'beauty-tools', name: { en: 'Beauty Tools', ar: 'أدوات تجميل' } },
    ],
  },
  {
    id: 'accessories', slug: 'accessories',
    name: { en: 'Accessories', ar: 'إكسسوارات' },
    description: { en: 'Complete your look', ar: 'أكملي إطلالتك' },
    subcategories: [
      { id: 'a-handbags', categoryId: 'accessories', slug: 'handbags', name: { en: 'Handbags', ar: 'حقائب يد' } },
      { id: 'a-wallets', categoryId: 'accessories', slug: 'wallets', name: { en: 'Wallets', ar: 'محافظ' } },
      { id: 'a-backpacks', categoryId: 'accessories', slug: 'backpacks', name: { en: 'Backpacks', ar: 'حقائب ظهر' } },
      { id: 'a-jewellery', categoryId: 'accessories', slug: 'jewellery', name: { en: 'Jewellery', ar: 'مجوهرات' } },
      { id: 'a-sunglasses', categoryId: 'accessories', slug: 'sunglasses', name: { en: 'Sunglasses', ar: 'نظارات شمسية' } },
    ],
  },
  {
    id: 'watches', slug: 'watches',
    name: { en: 'Watches', ar: 'ساعات' },
    description: { en: 'Timepieces for every occasion', ar: 'ساعات لكل مناسبة' },
    subcategories: [
      { id: 'wt-men', categoryId: 'watches', slug: 'mens-watches', name: { en: "Men's Watches", ar: 'ساعات رجالية' } },
      { id: 'wt-women', categoryId: 'watches', slug: 'womens-watches', name: { en: "Women's Watches", ar: 'ساعات نسائية' } },
      { id: 'wt-smart', categoryId: 'watches', slug: 'smart-watches', name: { en: 'Smart Watches', ar: 'ساعات ذكية' } },
      { id: 'wt-classic', categoryId: 'watches', slug: 'classic-watches', name: { en: 'Classic Watches', ar: 'ساعات كلاسيكية' } },
    ],
  },
  {
    id: 'fragrance', slug: 'fragrance',
    name: { en: 'Fragrance', ar: 'عطور' },
    description: { en: 'Luxury fragrances', ar: 'عطور فاخرة' },
    subcategories: [
      { id: 'fr-perfumes', categoryId: 'fragrance', slug: 'perfumes', name: { en: 'Perfumes', ar: 'عطور' } },
      { id: 'fr-oriental', categoryId: 'fragrance', slug: 'oriental-scents', name: { en: 'Oriental Scents', ar: 'عطور شرقية' } },
      { id: 'fr-giftsets', categoryId: 'fragrance', slug: 'gift-sets', name: { en: 'Gift Sets', ar: 'أطقم هدايا' } },
      { id: 'fr-mist', categoryId: 'fragrance', slug: 'mist-sprays', name: { en: 'Mist & Sprays', ar: 'بخاخات' } },
    ],
  },
  {
    id: 'home-living', slug: 'home-living',
    name: { en: 'Home & Living', ar: 'المنزل' },
    description: { en: 'Elevate your living space', ar: 'ارتقِ بمساحتك' },
    subcategories: [
      { id: 'hl-decor', categoryId: 'home-living', slug: 'decor', name: { en: 'Decor', ar: 'ديكور' } },
      { id: 'hl-candles', categoryId: 'home-living', slug: 'candles', name: { en: 'Candles', ar: 'شموع' } },
      { id: 'hl-storage', categoryId: 'home-living', slug: 'storage', name: { en: 'Storage', ar: 'تخزين' } },
      { id: 'hl-tabletop', categoryId: 'home-living', slug: 'tabletop', name: { en: 'Tabletop', ar: 'أدوات مائدة' } },
    ],
  },
];

// Product types for subcategories with enough products per type
export const productTypes: ProductTypeItem[] = [
  // Women > Dresses
  { id: 'pt-casual-dresses', categoryId: 'women', subcategorySlug: 'dresses', slug: 'casual-dresses', name: { en: 'Casual Dresses', ar: 'فساتين كاجوال' } },
  { id: 'pt-formal-dresses', categoryId: 'women', subcategorySlug: 'dresses', slug: 'formal-dresses', name: { en: 'Formal Dresses', ar: 'فساتين رسمية' } },
  // Men > Sneakers
  { id: 'pt-running', categoryId: 'men', subcategorySlug: 'sneakers', slug: 'running', name: { en: 'Running Shoes', ar: 'أحذية جري' } },
  { id: 'pt-casual-sneakers', categoryId: 'men', subcategorySlug: 'sneakers', slug: 'casual', name: { en: 'Casual Sneakers', ar: 'سنيكرز كاجوال' } },
  { id: 'pt-hi-top', categoryId: 'men', subcategorySlug: 'sneakers', slug: 'hi-top', name: { en: 'Hi-Top Sneakers', ar: 'سنيكرز عالية' } },
  // Beauty > Makeup
  { id: 'pt-lipstick', categoryId: 'beauty', subcategorySlug: 'makeup', slug: 'lipstick', name: { en: 'Lipstick', ar: 'أحمر شفاه' } },
  { id: 'pt-eye-makeup', categoryId: 'beauty', subcategorySlug: 'makeup', slug: 'eye-makeup', name: { en: 'Eye Makeup', ar: 'مكياج عيون' } },
  { id: 'pt-face-makeup', categoryId: 'beauty', subcategorySlug: 'makeup', slug: 'face-makeup', name: { en: 'Face Makeup', ar: 'مكياج وجه' } },
  // Accessories > Handbags
  { id: 'pt-tote-bags', categoryId: 'accessories', subcategorySlug: 'handbags', slug: 'tote-bags', name: { en: 'Tote Bags', ar: 'حقائب توت' } },
  { id: 'pt-crossbody', categoryId: 'accessories', subcategorySlug: 'handbags', slug: 'crossbody', name: { en: 'Crossbody Bags', ar: 'حقائب كروس' } },
  { id: 'pt-shoulder', categoryId: 'accessories', subcategorySlug: 'handbags', slug: 'shoulder-bags', name: { en: 'Shoulder Bags', ar: 'حقائب كتف' } },
  // Watches > Men's Watches
  { id: 'pt-dress-watches', categoryId: 'watches', subcategorySlug: 'mens-watches', slug: 'dress-watches', name: { en: 'Dress Watches', ar: 'ساعات رسمية' } },
  { id: 'pt-sport-watches', categoryId: 'watches', subcategorySlug: 'mens-watches', slug: 'sport-watches', name: { en: 'Sport Watches', ar: 'ساعات رياضية' } },
];

export const getCategoryById = (id: string) => fullCategories.find(c => c.id === id);
export const getCategoryBySlug = (slug: string) => fullCategories.find(c => c.slug === slug);
export const getSubcategoriesByCategoryId = (catId: string) =>
  fullCategories.find(c => c.id === catId)?.subcategories || [];
export const getSubcategoryById = (subId: string) => {
  for (const cat of fullCategories) {
    const sub = cat.subcategories.find(s => s.id === subId);
    if (sub) return sub;
  }
  return undefined;
};
export const getSubcategoryBySlug = (catSlug: string, subSlug: string) => {
  const cat = getCategoryBySlug(catSlug);
  return cat?.subcategories.find(s => s.slug === subSlug);
};
export const getProductTypesBySubcategory = (catId: string, subSlug: string) =>
  productTypes.filter(pt => pt.categoryId === catId && pt.subcategorySlug === subSlug);
export const getProductTypeBySlug = (catId: string, subSlug: string, typeSlug: string) =>
  productTypes.find(pt => pt.categoryId === catId && pt.subcategorySlug === subSlug && pt.slug === typeSlug);
