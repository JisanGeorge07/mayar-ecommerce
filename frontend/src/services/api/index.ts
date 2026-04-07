/**
 * API Service Layer
 * Currently uses mock data. Replace with ASP.NET Core Web API endpoints when ready.
 */

import type { SiteSettings, HeroSlide, NavItem, Category, Currency, CartSummary, UserMenuItem } from '@/types';
import type { NavMenuItem } from '@/types/navigation';
import type { ProductItem, CategoryItem, PromoBanner, FeaturedCategory, ProductFilters, SortOption } from '@/types/product';
import { siteSettings, currencies, userMenuItems, cartSummary } from '@/data/mock/siteSettings';
import { navItems, categories } from '@/data/mock/navigation';
import { heroSlides } from '@/data/mock/heroSlides';
import { megaMenuItems } from '@/data/mock/megaMenuData';
import { products, getProductBySlug, getRelatedProducts, getBestSellers, getNewArrivals, getFeaturedProducts, getSaleProducts } from '@/data/mock/products';
import { featuredCategories } from '@/data/mock/featuredCategories';
import { promoBanners } from '@/data/mock/promotions';

// Export API services
export { aboutService } from './aboutService';
export { contactService } from './contactService';
export { contentPageService } from './contentPageService';
export { couponService } from './couponService';
export { settingsService } from './settingsService';

const delay = <T>(data: T, ms = 100): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// Shop categories for filters
const shopCategories: CategoryItem[] = [
  { id: 'women', slug: 'women', name: { en: 'Women', ar: 'نساء' }, productCount: products.filter(p => p.categoryId === 'women').length },
  { id: 'men', slug: 'men', name: { en: 'Men', ar: 'رجال' }, productCount: products.filter(p => p.categoryId === 'men').length },
  { id: 'accessories', slug: 'accessories', name: { en: 'Accessories', ar: 'إكسسوارات' }, productCount: products.filter(p => p.categoryId === 'accessories').length },
  { id: 'shoes', slug: 'shoes', name: { en: 'Shoes', ar: 'أحذية' }, productCount: products.filter(p => p.categoryId === 'shoes').length },
  { id: 'beauty', slug: 'beauty', name: { en: 'Beauty', ar: 'جمال' }, productCount: products.filter(p => p.categoryId === 'beauty').length },
];

function applyFiltersAndSort(items: ProductItem[], filters: ProductFilters, sort: SortOption): ProductItem[] {
  let result = [...items];

  if (filters.categoryId) result = result.filter(p => p.categoryId === filters.categoryId);
  if (filters.subcategoryId) result = result.filter(p => p.subcategoryId === filters.subcategoryId);
  if (filters.gender) result = result.filter(p => p.gender === filters.gender);
  if (filters.colors?.length) result = result.filter(p => p.colors.some(c => filters.colors!.includes(c.id)));
  if (filters.sizes?.length) result = result.filter(p => p.sizes.some(s => filters.sizes!.includes(s.id)));
  if (filters.brands?.length) result = result.filter(p => filters.brands!.includes(p.brand.en));
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter(p => p.basePriceKWD >= min && p.basePriceKWD <= max);
  }
  if (filters.isOnSale) result = result.filter(p => p.isOnSale);
  if (filters.inStock !== undefined && filters.inStock) result = result.filter(p => p.inStock);
  if (filters.rating) result = result.filter(p => p.rating >= filters.rating!);

  switch (sort) {
    case 'price-asc': result.sort((a, b) => a.basePriceKWD - b.basePriceKWD); break;
    case 'price-desc': result.sort((a, b) => b.basePriceKWD - a.basePriceKWD); break;
    case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    case 'newest':
    default: result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
  }

  return result;
}

export const api = {
  getSiteSettings: () => delay<SiteSettings>(siteSettings),
  getCurrencies: () => delay<Record<string, Currency>>(currencies),
  getUserMenuItems: () => delay<UserMenuItem[]>(userMenuItems),
  getCartSummary: () => delay<CartSummary>(cartSummary),
  getNavItems: () => delay<NavItem[]>(navItems),
  getCategories: () => delay<Category[]>(categories),
  getHeroSlides: () => delay<HeroSlide[]>(heroSlides),
  getNavigationMenu: () => delay<NavMenuItem[]>(megaMenuItems),
  getMegaMenuBySlug: (slug: string) =>
    delay<NavMenuItem | undefined>(megaMenuItems.find((i) => i.slug === `/${slug}` || i.slug === slug)),

  // Products
  getProducts: (filters: ProductFilters = {}, sort: SortOption = 'newest') =>
    delay(applyFiltersAndSort(products, filters, sort)),
  getProductBySlug: (slug: string) => delay(getProductBySlug(slug)),
  getRelatedProducts: (productId: string) => delay(getRelatedProducts(productId)),
  getBestSellers: () => delay(getBestSellers()),
  getNewArrivals: () => delay(getNewArrivals()),
  getFeaturedProducts: () => delay(getFeaturedProducts()),
  getSaleProducts: () => delay(getSaleProducts()),
  getRecentlyViewed: (ids: string[]) => delay(ids.map(id => products.find(p => p.id === id)).filter(Boolean) as ProductItem[]),

  // Home page
  getFeaturedCategories: () => delay<FeaturedCategory[]>(featuredCategories),
  getPromoBanners: () => delay<PromoBanner[]>(promoBanners),

  // Shop
  getShopCategories: () => delay<CategoryItem[]>(shopCategories),
  getAvailableBrands: () => {
    const brands = [...new Set(products.map(p => p.brand.en))].sort();
    return delay(brands);
  },
  getAvailableColors: () => {
    const colorsMap = new Map<string, { id: string; name: { en: string; ar: string }; hex: string }>();
    products.forEach(p => p.colors.forEach(c => colorsMap.set(c.id, c)));
    return delay([...colorsMap.values()]);
  },
};
