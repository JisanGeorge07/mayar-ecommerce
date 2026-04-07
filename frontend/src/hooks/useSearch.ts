/**
 * useSearch Hook
 * Provides search functionality using backend API data for products and categories.
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/lib/routes';
import type { TranslatedText } from '@/types';
import { productApi, type ProductDto } from '@/services/api/productService';
import { useCategories, type CatalogCategory } from './useCatalog';

// ── Search result types ─────────────────────────────────────────────────────

export type SearchResultType = 'product' | 'productType' | 'subcategory' | 'category' | 'brand';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  label: TranslatedText;
  sublabel?: TranslatedText;
  href: string;
  image?: string;
  price?: number;
  score: number;
}

// ── Search helper functions ─────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, ' ').trim();
}

function matchScore(needle: string, haystack: string): number {
  const n = normalize(needle);
  const h = normalize(haystack);
  if (h === n) return 100;
  if (h.startsWith(n)) return 90;
  if (h.includes(n)) return 70;
  const words = n.split(/\s+/);
  const matched = words.filter(w => h.includes(w)).length;
  if (matched > 0) return 30 + (matched / words.length) * 30;
  return 0;
}

function bestMatch(needle: string, text: TranslatedText | string): number {
  if (typeof text === 'string') {
    return matchScore(needle, text);
  }
  return Math.max(matchScore(needle, text.en || ''), matchScore(needle, text.ar || ''));
}

// ── Search through categories ───────────────────────────────────────────────

function searchCategories(term: string, categories: CatalogCategory[]): SearchResult[] {
  const results: SearchResult[] = [];

  for (const cat of categories) {
    const s = bestMatch(term, cat.name);
    if (s > 0) {
      results.push({
        type: 'category',
        id: cat.id,
        label: cat.name,
        href: routes.category(cat.slug),
        score: s - 5,
      });
    }

    for (const sub of cat.subcategories) {
      const ss = bestMatch(term, sub.name);
      if (ss > 0) {
        results.push({
          type: 'subcategory',
          id: sub.id,
          label: sub.name,
          sublabel: cat.name,
          href: routes.subcategory(cat.slug, sub.slug),
          score: ss - 3,
        });
      }

      for (const pt of sub.productTypes) {
        const ps = bestMatch(term, pt.name);
        if (ps > 0) {
          results.push({
            type: 'productType',
            id: pt.id,
            label: pt.name,
            sublabel: sub.name,
            href: routes.productType(cat.slug, sub.slug, pt.slug),
            score: ps - 1,
          });
        }
      }
    }
  }

  return results;
}

// ── Search through products ─────────────────────────────────────────────────

function searchProducts(term: string, products: ProductDto[]): SearchResult[] {
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const p of products) {
    const productName: TranslatedText = {
      en: p.nameEnglish || '',
      ar: p.nameArabic || '',
    };
    const productBrand: TranslatedText = {
      en: p.brandEnglish || '',
      ar: p.brandArabic || '',
    };

    const nameScore = bestMatch(term, productName);
    const brandScore = bestMatch(term, productBrand);
    const s = Math.max(nameScore, brandScore * 0.9);

    if (s > 0 && !seen.has(p.id)) {
      seen.add(p.id);
      const primaryImage = p.images?.find(img => img.isActive)?.imageUrl;

      results.push({
        type: 'product',
        id: p.id,
        label: productName,
        sublabel: productBrand,
        href: routes.product(p.slug || p.id),
        image: primaryImage,
        price: p.basePriceKWD,
        score: s + 2,
      });
    }
  }

  // Search brands (deduplicated)
  const brandSet = new Map<string, TranslatedText>();
  for (const p of products) {
    const brandEn = p.brandEnglish || '';
    if (brandEn && !brandSet.has(brandEn)) {
      brandSet.set(brandEn, { en: brandEn, ar: p.brandArabic || brandEn });
    }
  }

  for (const [, brand] of brandSet) {
    const s = bestMatch(term, brand);
    if (s > 25) {
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

  return results;
}

// ── Combined search function ────────────────────────────────────────────────

function performSearch(
  term: string,
  products: ProductDto[],
  categories: CatalogCategory[],
  limit = 8
): SearchResult[] {
  if (!term || term.trim().length < 2) return [];

  const categoryResults = searchCategories(term, categories);
  const productResults = searchProducts(term, products);

  const allResults = [...categoryResults, ...productResults];
  allResults.sort((a, b) => b.score - a.score);

  return allResults.slice(0, limit);
}

// ── React Query Hook for products ───────────────────────────────────────────

function useProducts() {
  return useQuery({
    queryKey: ['products-search'],
    queryFn: async () => {
      const response = await productApi.getAll();
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

// ── Main Search Hook ────────────────────────────────────────────────────────

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = productsLoading || categoriesLoading;

  const searchResults = useMemo(() => {
    return performSearch(searchTerm, products, categories);
  }, [searchTerm, products, categories]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    searchResults,
    isLoading,
    handleSearch,
    clearSearch,
    setSearchTerm,
  };
}

export type { SearchResult, SearchResultType };
