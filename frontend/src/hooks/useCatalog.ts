/**
 * useCatalog Hook
 * Fetches category hierarchy from backend API and transforms it for navigation components.
 */

import { useQuery } from '@tanstack/react-query';
import { routes } from '@/lib/routes';
import type { TranslatedText } from '@/types';
import {
  topCategoryApi,
  middleCategoryApi,
  bottomCategoryApi,
  type CatalogCategory,
  type CatalogSubcategory,
  type CatalogProductType,
  type TopCategoryDto,
  type MiddleCategoryDto,
  type BottomCategoryDto,
} from '@/services/api/categoryService';
import { productApi } from '@/services/api/productService';

// ── Generated mega menu types ──────────────────────────────────────────────

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

// ── Transform API data to CatalogCategory format ───────────────────────────

interface TransformResult {
  categories: CatalogCategory[];
  navItems: GeneratedMegaMenu[];
}

async function fetchAndTransformCatalog(): Promise<TransformResult> {
  // Fetch all data in parallel
  const [topCatsRes, middleCatsRes, bottomCatsRes, productsRes] = await Promise.all([
    topCategoryApi.getAll(),
    middleCategoryApi.getAll(),
    bottomCategoryApi.getAll(),
    productApi.getAll(),
  ]);

  const topCategories = topCatsRes.data?.data || [];
  const middleCategories = middleCatsRes.data?.data || [];
  const bottomCategories = bottomCatsRes.data?.data || [];
  const products = productsRes.data?.data || [];

  // Build product count maps
  // Count products by bottomCategoryId (Product Type)
  const productCountByBottom = new Map<string, number>();
  products.forEach(p => {
    if (p.bottomCategoryId) {
      const current = productCountByBottom.get(p.bottomCategoryId) || 0;
      productCountByBottom.set(p.bottomCategoryId, current + 1);
    }
  });

  // Build lookup maps
  const topCatMap = new Map<string, TopCategoryDto>();
  topCategories.forEach(tc => topCatMap.set(tc.id, tc));

  const middleCatMap = new Map<string, MiddleCategoryDto>();
  middleCategories.forEach(mc => middleCatMap.set(mc.id, mc));

  // Group middle categories by top category
  const middleByTop = new Map<string, MiddleCategoryDto[]>();
  middleCategories.forEach(mc => {
    const list = middleByTop.get(mc.topCategoryId) || [];
    list.push(mc);
    middleByTop.set(mc.topCategoryId, list);
  });

  // Group bottom categories by middle category
  const bottomByMiddle = new Map<string, BottomCategoryDto[]>();
  bottomCategories.forEach(bc => {
    const list = bottomByMiddle.get(bc.middleCategoryId) || [];
    list.push(bc);
    bottomByMiddle.set(bc.middleCategoryId, list);
  });

  // Build catalog categories
  const categories: CatalogCategory[] = topCategories
    .filter(tc => tc.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map(tc => {
      const middles = (middleByTop.get(tc.id) || [])
        .filter(mc => mc.isActive)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      const subcategories: CatalogSubcategory[] = middles.map(mc => {
        const bottoms = (bottomByMiddle.get(mc.id) || [])
          .filter(bc => bc.isActive)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

        const productTypes: CatalogProductType[] = bottoms.map(bc => ({
          id: bc.id,
          slug: bc.slug || '',
          name: {
            en: bc.titleEnglish || '',
            ar: bc.titleArabic || '',
          },
          // Product count for this product type (bottom category)
          productCount: productCountByBottom.get(bc.id) || 0,
        }));

        return {
          id: mc.id,
          slug: mc.slug || '',
          name: {
            en: mc.titleEnglish || '',
            ar: mc.titleArabic || '',
          },
          categoryId: tc.id,
          categorySlug: tc.slug || '',
          productTypes,
          // Subcategory shows count of product types it contains
          productCount: productTypes.length,
        };
      });

      return {
        id: tc.id,
        slug: tc.slug || '',
        name: {
          en: tc.titleEnglish || '',
          ar: tc.titleArabic || '',
        },
        badge: (tc.badgeEnglish || tc.badgeArabic) ? {
          en: tc.badgeEnglish || '',
          ar: tc.badgeArabic || '',
        } : undefined,
        subcategories,
        // Category shows count of subcategories
        productCount: subcategories.length,
      };
    });

  // Build nav items from mega menu API with proper routes
  const navItems: GeneratedMegaMenu[] = [
    { id: 'home', label: { en: 'Home', ar: 'الرئيسية' }, slug: '/', type: 'link', sections: [] },
  ];

  // Transform mega menu items to nav items with correct routing
  for (const cat of categories) {
    const sections: GeneratedMegaSection[] = cat.subcategories.map(sub => ({
      id: `${cat.id}-${sub.slug}`,
      title: sub.name,
      links: [
        // "All" link for the subcategory itself
        {
          id: `${cat.id}-${sub.slug}-all`,
          label: { en: `All ${sub.name.en}`, ar: `كل ${sub.name.ar}` },
          href: routes.subcategory(cat.slug, sub.slug),
        },
        // Product type links
        ...sub.productTypes.map(pt => ({
          id: `${cat.id}-${sub.slug}-${pt.slug}`,
          label: pt.name,
          href: routes.productType(cat.slug, sub.slug, pt.slug),
        })),
      ],
    }));

    navItems.push({
      id: cat.id,
      label: cat.name,
      slug: routes.category(cat.slug),
      type: sections.length > 0 ? 'mega' : 'link',
      badge: cat.badge,
      sections,
    });
  }

  return { categories, navItems };
}

// ── React Query Hook ───────────────────────────────────────────────────────

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: fetchAndTransformCatalog,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
}

// ── Helper hooks ───────────────────────────────────────────────────────────

export function useNavbarItems() {
  const { data, isLoading, error } = useCatalog();
  return {
    navItems: data?.navItems || [],
    isLoading,
    error,
  };
}

export function useCategories() {
  const { data, isLoading, error } = useCatalog();
  return {
    categories: data?.categories || [],
    isLoading,
    error,
  };
}

export function useCategoryBySlug(slug: string) {
  const { categories, isLoading, error } = useCategories();
  const category = categories.find(c => c.slug === slug);
  return { category, isLoading, error };
}

export function useSubcategoriesByCategory(categorySlug: string) {
  const { category, isLoading, error } = useCategoryBySlug(categorySlug);
  return {
    subcategories: category?.subcategories || [],
    isLoading,
    error,
  };
}

export function useProductTypesBySubcategory(categorySlug: string, subcategorySlug: string) {
  const { subcategories, isLoading, error } = useSubcategoriesByCategory(categorySlug);
  const subcategory = subcategories.find(s => s.slug === subcategorySlug);
  return {
    productTypes: subcategory?.productTypes || [],
    isLoading,
    error,
  };
}

export type { CatalogCategory, CatalogSubcategory, CatalogProductType };
