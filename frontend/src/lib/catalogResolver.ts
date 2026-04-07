/**
 * Catalog Link Resolver
 *
 * Maps mega-menu link IDs (e.g. "w-dresses", "m-sneakers") to real catalog
 * routes built from fullCategories / productTypes.
 *
 * Strategy:
 *  1. Infer parent category from the link-ID prefix (w- → women, m- → men …).
 *  2. Strip prefix and try to match against subcategory slugs.
 *  3. If no subcategory match, try product-type slugs.
 *  4. Fall back to the category page.
 */

import { fullCategories, productTypes } from '@/data/mock/categories';
import { routes } from '@/lib/routes';

// Prefix → category slug mapping
const PREFIX_MAP: Record<string, string> = {
  'w-': 'women',
  'm-': 'men',
  'b-': 'beauty',
  'a-': 'accessories',
  's-': 'shop',      // "shop" mega menu — generic
  'wt-': 'watches',
  'fr-': 'fragrance',
  'hl-': 'home-living',
};

// Sort prefixes longest-first so "wt-" is tested before "w-"
const SORTED_PREFIXES = Object.keys(PREFIX_MAP).sort((a, b) => b.length - a.length);

function inferCategory(linkId: string): { catSlug: string; remainder: string } | null {
  for (const prefix of SORTED_PREFIXES) {
    if (linkId.startsWith(prefix)) {
      return { catSlug: PREFIX_MAP[prefix], remainder: linkId.slice(prefix.length) };
    }
  }
  return null;
}

// Normalise a link remainder to a slug that might match subcategory/type
// e.g. "dresses" → "dresses", "sports_shoes" → "sports-shoes"
const normalise = (s: string) => s.replace(/_/g, '-').toLowerCase();

// Known manual overrides for links that can't be auto-resolved
const MANUAL_OVERRIDES: Record<string, string> = {
  // Shop mega-menu generic links
  'new-arrivals': '/shop',
  'trending-now': '/shop',
  'best-sellers': '/shop',
  'just-landed': '/shop',
  'online-exclusive': '/shop',
  'value-packs': '/shop',
};

/**
 * Resolve a mega-menu link ID to a real catalog route.
 */
export function resolveMegaMenuLink(linkId: string): string {
  // Manual overrides first
  if (MANUAL_OVERRIDES[linkId]) return MANUAL_OVERRIDES[linkId];

  const inferred = inferCategory(linkId);
  if (!inferred) {
    // If the linkId itself is a category slug
    const cat = fullCategories.find(c => c.slug === linkId || c.id === linkId);
    if (cat) return routes.category(cat.slug);
    return routes.shop;
  }

  const { catSlug, remainder } = inferred;

  // "shop" prefix = generic Shop mega panel — try to match across all categories
  if (catSlug === 'shop') {
    return resolveAcrossAllCategories(remainder);
  }

  const category = fullCategories.find(c => c.slug === catSlug);
  if (!category) return routes.shop;

  const norm = normalise(remainder);

  // Try subcategory match
  const sub = category.subcategories.find(s =>
    s.slug === norm ||
    s.slug === remainder ||
    s.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === norm
  );
  if (sub) return routes.subcategory(category.slug, sub.slug);

  // Try product type match within this category
  const pt = productTypes.find(p =>
    p.categoryId === category.id && (p.slug === norm || p.slug === remainder)
  );
  if (pt) {
    const parentSub = category.subcategories.find(s => s.slug === pt.subcategorySlug) ||
                      category.subcategories.find(s => s.id === pt.subcategorySlug);
    if (parentSub) return routes.productType(category.slug, parentSub.slug, pt.slug);
  }

  // Generic fallback: jump to category
  return routes.category(category.slug);
}

/** For "shop" mega-menu links, search across all categories */
function resolveAcrossAllCategories(remainder: string): string {
  const norm = normalise(remainder);
  for (const cat of fullCategories) {
    const sub = cat.subcategories.find(s =>
      s.slug === norm ||
      s.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === norm
    );
    if (sub) return routes.subcategory(cat.slug, sub.slug);
  }
  // Try product types
  for (const pt of productTypes) {
    if (pt.slug === norm) {
      const cat = fullCategories.find(c => c.id === pt.categoryId);
      if (cat) {
        const sub = cat.subcategories.find(s => s.slug === pt.subcategorySlug);
        if (sub) return routes.productType(cat.slug, sub.slug, pt.slug);
      }
    }
  }
  return routes.shop;
}
