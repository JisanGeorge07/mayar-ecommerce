/**
 * Global Search Service — registry-based pattern.
 * Fetches real data from backend APIs.
 *
 * Note: Hero Banners, Promo Banners, and Shop by Category providers
 * are registered in their respective service files using cached data.
 */

import { categoryService, subcategoryService, productTypeService, productService } from './index';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: string; // grouping label
  path: string; // navigation target
  icon?: string;
}

type SearchProvider = (query: string) => SearchResult[] | Promise<SearchResult[]>;

const providers: Map<string, SearchProvider> = new Map();

export function registerSearchProvider(name: string, provider: SearchProvider) {
  providers.set(name, provider);
}

export function unregisterSearchProvider(name: string) {
  providers.delete(name);
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  for (const [, provider] of providers) {
    try {
      const items = await provider(q);
      results.push(...items);
    } catch {
      // Skip failed providers
    }
  }
  return results;
}

// ---- Built-in providers ----

// Navigation modules provider
const NAV_ITEMS: SearchResult[] = [
  { id: 'nav-dash', title: 'Dashboard', category: 'Modules', path: '/dashboard' },
  { id: 'nav-cat', title: 'Categories', category: 'Modules', path: '/categories' },
  { id: 'nav-sub', title: 'Subcategories', category: 'Modules', path: '/subcategories' },
  { id: 'nav-pt', title: 'Product Types', category: 'Modules', path: '/product-types' },
  { id: 'nav-prod', title: 'Products', category: 'Modules', path: '/products' },
  { id: 'nav-new', title: 'Create Product', category: 'Modules', path: '/products/new' },
  { id: 'nav-hero', title: 'Hero Banners', category: 'Modules', path: '/hero-banners' },
  { id: 'nav-promo', title: 'Promo Banners', category: 'Modules', path: '/promo-banners' },
  { id: 'nav-shop-cat', title: 'Shop by Category', category: 'Modules', path: '/shop-by-category' },
  { id: 'nav-coupons', title: 'Coupons', category: 'Modules', path: '/coupons' },
  { id: 'nav-about', title: 'About Us', category: 'Modules', path: '/pages/about-us' },
  { id: 'nav-privacy', title: 'Privacy Policy', category: 'Modules', path: '/pages/privacy-policy' },
  { id: 'nav-contact', title: 'Contact Us', category: 'Modules', path: '/pages/contact-us' },
  { id: 'nav-shipping', title: 'Shipping Information', category: 'Modules', path: '/pages/shipping-information' },
  { id: 'nav-returns', title: 'Returns & Exchange', category: 'Modules', path: '/pages/returns-exchange' },
  { id: 'nav-terms', title: 'Terms & Conditions', category: 'Modules', path: '/pages/terms-conditions' },
  { id: 'nav-notifs', title: 'Notifications', category: 'Modules', path: '/notifications' },
  { id: 'nav-settings', title: 'Settings', category: 'Modules', path: '/settings' },
];

registerSearchProvider('navigation', (q) =>
  NAV_ITEMS.filter(i => i.title.toLowerCase().includes(q))
);

// Category/subcategory/product-type provider — fetches from API
registerSearchProvider('catalog', async (q) => {
  const [categories, subcategories, productTypes] = await Promise.all([
    categoryService.getCategories(),
    subcategoryService.getSubcategories(),
    productTypeService.getProductTypes(),
  ]);

  const results: SearchResult[] = [];

  for (const c of categories) {
    if (c.name.toLowerCase().includes(q) || c.slug.includes(q)) {
      results.push({ id: c.id, title: c.name, subtitle: 'Category', category: 'Categories', path: '/categories' });
    }
  }

  for (const s of subcategories) {
    if (s.name.toLowerCase().includes(q) || s.slug.includes(q)) {
      results.push({ id: s.id, title: s.name, subtitle: 'Subcategory', category: 'Subcategories', path: '/subcategories' });
    }
  }

  for (const pt of productTypes) {
    if (pt.name.toLowerCase().includes(q) || pt.slug.includes(q)) {
      results.push({ id: pt.id, title: pt.name, subtitle: 'Product Type', category: 'Product Types', path: '/product-types' });
    }
  }

  return results;
});

// Products provider
registerSearchProvider('products', async (q) => {
  const products = await productService.getProducts();
  const results: SearchResult[] = [];

  for (const p of products) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.slug.includes(q) ||
      p.sku?.toLowerCase().includes(q)
    ) {
      results.push({
        id: p.id,
        title: p.name,
        subtitle: p.sku || p.status,
        category: 'Products',
        path: `/products/edit/${p.id}`,
      });
    }
  }

  return results.slice(0, 10); // Limit to 10 product results
});
