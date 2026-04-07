/**
 * Shared Catalog Service
 * Single source of truth for categories, subcategories, product types, and search.
 * All navigation (navbar, mega menu, All Categories, mobile menu, filters, search)
 * must use this service instead of separate static data.
 */

import { fullCategories, productTypes } from '@/data/mock/categories';
import type { FullCategory, SubcategoryItem, ProductTypeItem } from '@/data/mock/categories';
import { products } from '@/data/mock/products';
import type { ProductItem } from '@/types/product';
import type { TranslatedText } from '@/types';
import { routes } from '@/lib/routes';

// ── Catalog tree types ──────────────────────────────────────────────

export interface CatalogProductType {
  id: string;
  slug: string;
  name: TranslatedText;
  productCount: number;
}

export interface CatalogSubcategory {
  id: string;
  slug: string;
  name: TranslatedText;
  categoryId: string;
  productTypes: CatalogProductType[];
  productCount: number;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: TranslatedText;
  description?: TranslatedText;
  subcategories: CatalogSubcategory[];
  productCount: number;
}

export interface CatalogTree {
  categories: CatalogCategory[];
  totalProducts: number;
}

// ── Search result types ─────────────────────────────────────────────

export type SearchResultType = 'product' | 'productType' | 'subcategory' | 'category' | 'brand';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  label: TranslatedText;
  sublabel?: TranslatedText;
  href: string;
  image?: string;
  price?: number;
  score: number; // higher = better match
}

// ── Build catalog tree (cached) ─────────────────────────────────────

let _cachedTree: CatalogTree | null = null;

export function getCatalogTree(): CatalogTree {
  if (_cachedTree) return _cachedTree;

  const categories: CatalogCategory[] = fullCategories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);

    const subcategories: CatalogSubcategory[] = cat.subcategories
      .map(sub => {
        const subProducts = catProducts.filter(p => p.subcategoryId === sub.slug);
        const subPts = productTypes
          .filter(pt => pt.categoryId === cat.id && pt.subcategorySlug === sub.slug)
          .map(pt => ({
            id: pt.id,
            slug: pt.slug,
            name: pt.name,
            productCount: subProducts.filter(p => p.productTypeId === pt.slug).length,
          }))
          .filter(pt => pt.productCount > 0);

        return {
          id: sub.id,
          slug: sub.slug,
          name: sub.name,
          categoryId: cat.id,
          productTypes: subPts,
          productCount: subProducts.length,
        };
      })
      .filter(sub => sub.productCount > 0);

    return {
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      subcategories,
      productCount: catProducts.length,
    };
  }).filter(cat => cat.productCount > 0);

  _cachedTree = { categories, totalProducts: products.length };
  return _cachedTree;
}

// ── Lookup helpers ──────────────────────────────────────────────────

export function getCategories(): CatalogCategory[] {
  return getCatalogTree().categories;
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return getCategories().find(c => c.slug === slug);
}

export function getSubcategoriesByCategory(categorySlug: string): CatalogSubcategory[] {
  return getCategoryBySlug(categorySlug)?.subcategories || [];
}

export function getProductTypesBySubcategory(categorySlug: string, subcategorySlug: string): CatalogProductType[] {
  const sub = getSubcategoriesByCategory(categorySlug).find(s => s.slug === subcategorySlug);
  return sub?.productTypes || [];
}

export function getProductsByCategory(categorySlug: string): ProductItem[] {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return products.filter(p => p.categoryId === cat.id);
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): ProductItem[] {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return products.filter(p => p.categoryId === cat.id && p.subcategoryId === subcategorySlug);
}

export function getProductsByProductType(categorySlug: string, subcategorySlug: string, typeSlug: string): ProductItem[] {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return products.filter(p => p.categoryId === cat.id && p.subcategoryId === subcategorySlug && p.productTypeId === typeSlug);
}

// ── Mega menu generation from catalog ───────────────────────────────

export interface GeneratedMegaSection {
  id: string;
  title: TranslatedText;
  links: { id: string; label: TranslatedText; href: string }[];
}

export interface GeneratedMegaMenu {
  id: string;
  label: TranslatedText;
  slug: string;
  type: 'link' | 'mega';
  badge?: TranslatedText;
  sections: GeneratedMegaSection[];
}

export function generateNavbarItems(): GeneratedMegaMenu[] {
  const tree = getCatalogTree();
  const items: GeneratedMegaMenu[] = [
    { id: 'home', label: { en: 'Home', ar: 'الرئيسية' }, slug: '/', type: 'link', sections: [] },
  ];

  for (const cat of tree.categories) {
    const sections: GeneratedMegaSection[] = cat.subcategories.map(sub => ({
      id: `${cat.id}-${sub.slug}`,
      title: sub.name,
      links: [
        // "All" link for the subcategory itself
        { id: `${cat.id}-${sub.slug}-all`, label: { en: `All ${sub.name.en}`, ar: `كل ${sub.name.ar}` }, href: routes.subcategory(cat.slug, sub.slug) },
        // Product type links
        ...sub.productTypes.map(pt => ({
          id: `${cat.id}-${sub.slug}-${pt.slug}`,
          label: pt.name,
          href: routes.productType(cat.slug, sub.slug, pt.slug),
        })),
      ],
    }));

    items.push({
      id: cat.id,
      label: cat.name,
      slug: routes.category(cat.slug),
      type: sections.length > 0 ? 'mega' : 'link',
      sections,
    });
  }

  items.push({
    id: 'sale',
    label: { en: 'Sale', ar: 'تخفيضات' },
    slug: '/sale',
    type: 'link',
    badge: { en: 'Hot', ar: 'عرض' },
    sections: [],
  });

  return items;
}

// ── Search ──────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, ' ').trim();
}

function matchScore(needle: string, haystack: string): number {
  const n = normalize(needle);
  const h = normalize(haystack);
  if (h === n) return 100;
  if (h.startsWith(n)) return 90;
  if (h.includes(n)) return 70;
  // word-level partial match
  const words = n.split(/\s+/);
  const matched = words.filter(w => h.includes(w)).length;
  if (matched > 0) return 30 + (matched / words.length) * 30;
  return 0;
}

function bestMatch(needle: string, text: TranslatedText): number {
  return Math.max(matchScore(needle, text.en), matchScore(needle, text.ar));
}

export function searchCatalog(term: string, limit = 20): SearchResult[] {
  if (!term || term.trim().length < 2) return [];
  const results: SearchResult[] = [];
  const tree = getCatalogTree();

  // Search categories
  for (const cat of tree.categories) {
    const s = bestMatch(term, cat.name);
    if (s > 0) results.push({ type: 'category', id: cat.id, label: cat.name, href: routes.category(cat.slug), score: s - 5 });

    // Search subcategories
    for (const sub of cat.subcategories) {
      const ss = bestMatch(term, sub.name);
      if (ss > 0) results.push({ type: 'subcategory', id: sub.id, label: sub.name, sublabel: cat.name, href: routes.subcategory(cat.slug, sub.slug), score: ss - 3 });

      // Search product types
      for (const pt of sub.productTypes) {
        const ps = bestMatch(term, pt.name);
        if (ps > 0) results.push({ type: 'productType', id: pt.id, label: pt.name, sublabel: sub.name, href: routes.productType(cat.slug, sub.slug, pt.slug), score: ps - 1 });
      }
    }
  }

  // Search products
  const seen = new Set<string>();
  for (const p of products) {
    const nameScore = bestMatch(term, p.name);
    const brandScore = bestMatch(term, p.brand);
    const s = Math.max(nameScore, brandScore * 0.9);
    if (s > 0 && !seen.has(p.id)) {
      seen.add(p.id);
      results.push({
        type: 'product',
        id: p.id,
        label: p.name,
        sublabel: p.brand,
        href: routes.product(p.slug),
        image: p.images[0]?.url,
        price: p.basePriceKWD,
        score: s + 2, // products rank slightly higher for same match quality
      });
    }
  }

  // Search brands (deduplicated)
  const brandSet = new Map<string, { en: string; ar: string }>();
  for (const p of products) {
    if (!brandSet.has(p.brand.en)) brandSet.set(p.brand.en, p.brand);
  }
  for (const [, brand] of brandSet) {
    const s = bestMatch(term, brand);
    if (s > 25) {
      // Check if we already have this as a product result
      results.push({
        type: 'brand',
        id: `brand-${brand.en}`,
        label: brand,
        sublabel: { en: 'Brand', ar: 'علامة تجارية' },
        href: `/shop?brand=${encodeURIComponent(brand.en)}`,
        score: s - 8,
      });
    }
  }

  // Sort by score descending, take top N
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function getSearchSuggestions(term: string): SearchResult[] {
  return searchCatalog(term, 8);
}
