export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  status: 'active' | 'inactive';
  description?: string;
  display_order?: number;
  created_at: string;
}

export interface TopCategory {
  id: string;
  slug: string;
  titleEnglish: string;
  titleArabic: string;
  badgeEnglish?: string;
  badgeArabic?: string;
  isActive: boolean;
  description?: string;
  displayOrder?: number;
}

export interface MiddleCategory {
  id: string;
  topCategoryId: string;
  slug?: string;
  titleEnglish?: string;
  titleArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface BottomCategory {
  id: string;
  topCategoryId: string;
  middleCategoryId: string;
  slug?: string;
  titleEnglish?: string;
  titleArabic?: string;
  isActive: boolean;
  displayOrder?: number;
  description?: string;
  attributeTemplate?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  description?: string;
  display_order?: number;
}

export interface ProductType {
  id: string;
  subcategory_id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  description?: string;
  attribute_template?: string;
}

export type ProductStatus = 'draft' | 'active';
export type Gender = 'men' | 'women' | 'unisex';
export type StockStatus = 'in_stock' | 'out_of_stock' | 'low_stock';

export interface Product {
  id: string;
  category_id: string;
  subcategory_id: string;
  product_type_id: string;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  short_description: string;
  full_description: string;
  status: ProductStatus;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  gender: Gender;
  base_price_kwd: number;
  base_price_inr: number;
  compare_price_kwd: number;
  compare_price_inr: number;
  stock_status: StockStatus;
  stock_quantity: number;
  low_stock_threshold: number;
  barcode: string;
  material: string;
  fit: string;
  sleeve_type: string;
  pattern: string;
  fragrance_type: string;
  volume_ml: string;
  watch_movement: string;
  strap_type: string;
  rating: number;
  review_count: number;
  image_url?: string;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  productColorId: string;
  productSizeId: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  stockQuantity?: number;
  inStock: boolean;
  isDefault: boolean;
  // Nested objects for easier frontend consumption
  color?: ProductColor;
  size?: ProductSize;
  imageUrl?: string;
  imageFile?: File;
}

export interface ProductColor {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  hex: string;
  isActive: boolean;
}

export interface ProductSize {
  id: string;
  label: string;
  isActive: boolean;
}

export interface ProductSpecification {
  id: string;
  labelEnglish: string;
  labelArabic: string;
  valueEnglish: string;
  valueArabic: string;
  isActive: boolean;
}

export interface ProductCareInstruction {
  id: string;
  instructionEnglish: string;
  instructionArabic: string;
  isActive: boolean;
}

export interface ProductFeature {
  id: string;
  productId: string;
  trustBadgeId: string;
  isActive: boolean;
  // Trust badge details (populated from backend)
  labelEnglish?: string;
  labelArabic?: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  iconName?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string | null;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  isActive: boolean;
  file?: File;
}

export interface ProductDetailBlock {
  id: string;
  product_id: string;
  descriptionEnglish: string;
  descriptionArabic: string;
  shippingInfoEnglish: string;
  shippingInfoArabic: string;
  returnInfoEnglish: string;
  returnInfoArabic: string;
}

export interface SeoMetadata {
  id: string;
  product_id: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  twitter_title: string;
  twitter_description: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  author: string;
  date: string;
  text: string;
  rating: number;
  verified_purchase: boolean;
}

export interface TrustBadge {
  id: string;
  key?: string;
  labelEnglish?: string;
  labelArabic?: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  iconName?: string;
}

export interface RelatedProductEntry {
  id: string;
  product_id: string;
  related_product_id: string;
  type: 'related' | 'cross_sell' | 'upsell';
}

export const TRUST_BADGE_OPTIONS = [
  { key: 'free_delivery', label: 'Free Delivery', description: 'On orders over 10 KWD' },
  { key: 'easy_returns', label: 'Easy Returns', description: '14 day return policy' },
  { key: 'secure_payment', label: 'Secure Payment', description: 'Encrypted checkout' },
  { key: 'authentic', label: 'Authentic Products', description: '100% genuine' },
] as const;

// Form state for product creation
export interface ProductFormState {
  basic: Partial<Product> & {
    nameEnglish?: string;
    nameArabic?: string;
    brandEnglish?: string;
    brandArabic?: string;
    shortDescriptionEnglish?: string;
    shortDescriptionArabic?: string;
    in_stock?: boolean;
    isActive?: boolean;
  };
  variants: ProductVariant[];
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  details: Partial<ProductDetailBlock>;
  specifications: ProductSpecification[];
  careInstructions: ProductCareInstruction[];
  features: ProductFeature[];
  trustBadges: string[];
  seo: Partial<SeoMetadata>;
  reviews: ProductReview[];
  relatedProducts: RelatedProductEntry[];
}

export const INITIAL_PRODUCT_FORM: ProductFormState = {
  basic: {
    status: 'draft',
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    is_on_sale: false,
    in_stock: true,
    isActive: true,
    gender: 'unisex',
    stock_status: 'in_stock',
    stock_quantity: 0,
    low_stock_threshold: 5,
    base_price_kwd: 0,
    base_price_inr: 0,
    compare_price_kwd: 0,
    compare_price_inr: 0,
    rating: 0,
    review_count: 0,
    nameEnglish: '',
    nameArabic: '',
    brandEnglish: '',
    brandArabic: '',
    shortDescriptionEnglish: '',
    shortDescriptionArabic: '',
    slug: '',
  },
  variants: [],
  colors: [],
  sizes: [],
  images: [],
  details: {
    descriptionEnglish: '',
    descriptionArabic: '',
    shippingInfoEnglish: '',
    shippingInfoArabic: '',
    returnInfoEnglish: '',
    returnInfoArabic: '',
  },
  specifications: [],
  careInstructions: [],
  features: [],
  trustBadges: [],
  seo: {},
  reviews: [],
  relatedProducts: [],
};
