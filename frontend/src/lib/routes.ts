/**
 * Centralized route helpers for SEO-friendly path-based URLs.
 * All internal links must use these helpers instead of query params.
 * Future CMS slugs will work automatically.
 */

export const routes = {
  home: '/',
  shop: '/shop',
  sale: '/sale',

  /** /shop/category/:categorySlug */
  category: (categorySlug: string) => `/shop/category/${categorySlug}`,

  /** /shop/category/:categorySlug/subcategory/:subcategorySlug */
  subcategory: (categorySlug: string, subcategorySlug: string) =>
    `/shop/category/${categorySlug}/subcategory/${subcategorySlug}`,

  /** /shop/category/:catSlug/subcategory/:subSlug/type/:typeSlug */
  productType: (categorySlug: string, subcategorySlug: string, typeSlug: string) =>
    `/shop/category/${categorySlug}/subcategory/${subcategorySlug}/type/${typeSlug}`,

  /** /product/:productSlug */
  product: (productSlug: string) => `/product/${productSlug}`,

  login: '/login',
  signup: '/signup',
  account: '/account',
  cart: '/cart',
  trackOrder: '/track-order',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  privacyPolicy: '/privacy-policy',
  termsConditions: '/terms-conditions',
  returnsExchange: '/returns-exchange',
  shippingInfo: '/shipping-info',
};

/**
 * Parse legacy query-param URLs and return the new path-based URL.
 * Returns null if not a legacy URL.
 */
export function getLegacyRedirect(pathname: string, search: string): string | null {
  if (pathname !== '/shop' || !search) return null;
  const params = new URLSearchParams(search);
  const category = params.get('category');
  const sub = params.get('sub');
  const type = params.get('type');
  const sale = params.get('sale');

  if (sale === 'true' && !category) return routes.sale;
  if (!category) return null;

  if (type && sub) return routes.productType(category, sub, type);
  if (sub) return routes.subcategory(category, sub);
  return routes.category(category);
}
