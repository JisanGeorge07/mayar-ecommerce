import type { TranslatedText } from './index';

export interface ProductImage {
  id: string;
  url: string;
  alt: TranslatedText;
  isPrimary?: boolean;
  colorId?: string;
}

export interface ProductColor {
  id: string;
  name: TranslatedText;
  hex: string;
}

export interface ProductSize {
  id: string;
  label: string;
  stock: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorId: string;
  sizeId: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  stockQuantity?: number;
  inStock: boolean;
  isDefault: boolean;
  sku?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface ProductFeature {
  id: string;
  iconName?: string;
  label: TranslatedText;
}

export interface ProductItem {
  id: string;
  slug: string;
  brand: TranslatedText;
  name: TranslatedText;
  shortDescription: TranslatedText;
  fullDescription: TranslatedText;
  categoryId: string;
  subcategoryId?: string;
  productTypeId?: string;
  collectionIds?: string[];
  tags?: string[];
  gender?: 'women' | 'men' | 'unisex';
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  basePriceKWD: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  material?: TranslatedText;
  features?: ProductFeature[];
  specifications?: { label: TranslatedText; value: TranslatedText }[];
  shippingInfo?: TranslatedText;
  returnInfo?: TranslatedText;
  careInstructions?: TranslatedText[];
  reviews: ReviewItem[];
  relatedProductIds: string[];
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: TranslatedText;
  description?: TranslatedText;
  image?: string;
  parentId?: string;
  productCount?: number;
}

export interface PromoBanner {
  id: string;
  title: TranslatedText;
  subtitle?: TranslatedText;
  image: string;
  ctaLabel: TranslatedText;
  ctaHref: string;
  bgColor?: string;
}

export interface FeaturedCategory {
  id: string;
  name: TranslatedText;
  image: string;
  href: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  gender?: string;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
  priceRange?: [number, number];
  isOnSale?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  rating?: number;
}
