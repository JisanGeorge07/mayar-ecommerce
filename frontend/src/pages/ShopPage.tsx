import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import ApiProductCard from '@/components/common/ApiProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import SortControls from '@/components/shop/SortControls';
import { useLocale } from '@/hooks/useLocale';
import { productApi, type ProductDto, type ShopDataDto, type ProductFilterRequest } from '@/services/api/productService';
import { topCategoryApi, middleCategoryApi, bottomCategoryApi } from '@/services/api/categoryService';
import type { ProductFilters, SortOption, ProductColor, CategoryItem } from '@/types/product';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { routes } from '@/lib/routes';

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const { lang, currency } = useLocale();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get category slugs from URL path params
  const { categorySlug, subcategorySlug, typeSlug } = useParams<{
    categorySlug?: string;
    subcategorySlug?: string;
    typeSlug?: string;
  }>();

  // Data states
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [shopData, setShopData] = useState<ShopDataDto | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Category ID mapping (slug -> id)
  const [categoryIdMap, setCategoryIdMap] = useState<Map<string, string>>(new Map());
  const [subcategoryIdMap, setSubcategoryIdMap] = useState<Map<string, { id: string; topCategoryId: string }>>(new Map());
  const [productTypeIdMap, setProductTypeIdMap] = useState<Map<string, { id: string; middleCategoryId: string }>>(new Map());

  // Filter and UI states
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Get sale param from query string
  const saleParam = searchParams.get('sale');
  const sortParam = searchParams.get('sort') as SortOption | null;
  const filterParam = searchParams.get('filter'); // 'new', 'bestseller', etc.

  // Initialize sort from URL params
  useEffect(() => {
    if (sortParam && ['newest', 'price-asc', 'price-desc', 'rating', 'popular'].includes(sortParam)) {
      setSort(sortParam);
    }
  }, [sortParam]);

  // Fetch category mappings (slug -> id) on mount
  useEffect(() => {
    const fetchCategoryMappings = async () => {
      try {
        const [topRes, middleRes, bottomRes] = await Promise.all([
          topCategoryApi.getAll(),
          middleCategoryApi.getAll(),
          bottomCategoryApi.getAll(),
        ]);

        const topCategories = topRes.data?.data || [];
        const middleCategories = middleRes.data?.data || [];
        const bottomCategories = bottomRes.data?.data || [];

        // Build slug -> id maps
        const catMap = new Map<string, string>();
        topCategories.forEach(tc => {
          if (tc.slug) catMap.set(tc.slug, tc.id);
        });
        setCategoryIdMap(catMap);

        const subMap = new Map<string, { id: string; topCategoryId: string }>();
        middleCategories.forEach(mc => {
          if (mc.slug) subMap.set(mc.slug, { id: mc.id, topCategoryId: mc.topCategoryId });
        });
        setSubcategoryIdMap(subMap);

        const typeMap = new Map<string, { id: string; middleCategoryId: string }>();
        bottomCategories.forEach(bc => {
          if (bc.slug) typeMap.set(bc.slug, { id: bc.id, middleCategoryId: bc.middleCategoryId });
        });
        setProductTypeIdMap(typeMap);
      } catch (error) {
        console.error('Failed to fetch category mappings:', error);
      }
    };
    fetchCategoryMappings();
  }, []);

  // Get category IDs from slugs
  const topCategoryId = categorySlug ? categoryIdMap.get(categorySlug) : undefined;
  const middleCategoryId = subcategorySlug ? subcategoryIdMap.get(subcategorySlug)?.id : undefined;
  const bottomCategoryId = typeSlug ? productTypeIdMap.get(typeSlug)?.id : undefined;

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters: ProductFilters = {};
    if (saleParam === 'true') {
      newFilters.isOnSale = true;
    }
    // Handle filter param (new, bestseller)
    if (filterParam === 'new') {
      newFilters.isNew = true;
      // Set default sort to newest for new arrivals
      if (!sortParam) setSort('newest');
    } else if (filterParam === 'bestseller') {
      newFilters.isBestSeller = true;
      // Set default sort to popular for bestsellers
      if (!sortParam) setSort('popular');
    }
    // Set categoryId for FilterSidebar selection
    if (categorySlug) {
      newFilters.categoryId = categorySlug;
    }
    setFilters(newFilters);
  }, [saleParam, filterParam, categorySlug, sortParam]);

  // Fetch shop data (categories, brands, colors, price range) on mount
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await productApi.getShopData();
        if (response.data.success && response.data.data) {
          setShopData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      }
    };
    fetchShopData();
  }, []);

  // Fetch products when filters, sort, page, or category changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filterRequest: ProductFilterRequest = {
        topCategoryId: topCategoryId,
        middleCategoryId: middleCategoryId,
        bottomCategoryId: bottomCategoryId,
        colors: filters.colors,
        sizes: filters.sizes,
        brands: filters.brands,
        minPrice: filters.priceRange?.[0],
        maxPrice: filters.priceRange?.[1],
        currency: currency, // Pass current currency for price filtering
        isOnSale: filters.isOnSale,
        isNew: filters.isNew,
        isBestSeller: filters.isBestSeller,
        inStock: filters.inStock,
        sortBy: sort,
        page,
        pageSize: ITEMS_PER_PAGE,
      };

      const response = await productApi.getFiltered(filterRequest);
      if (response.data.success && response.data.data) {
        const activeProducts = response.data.data.items.filter(p => p.isActive && p.status === 'active');
        setProducts(activeProducts);
        setTotalCount(activeProducts.length);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [topCategoryId, middleCategoryId, bottomCategoryId, filters, sort, page, currency]);

  useEffect(() => {
    if (shopData && categoryIdMap.size > 0) {
      fetchProducts();
    }
  }, [fetchProducts, shopData, categoryIdMap]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset page when filters or sort changes
  useEffect(() => {
    setPage(1);
  }, [filters, sort, categorySlug, subcategorySlug, typeSlug]);

  // Reset price range filter when currency changes (prices differ between currencies)
  useEffect(() => {
    if (filters.priceRange) {
      setFilters(prev => ({ ...prev, priceRange: undefined }));
    }
  }, [currency]);

  // Convert shop data to FilterSidebar format
  const shopCategories: CategoryItem[] = useMemo(() => {
    if (!shopData) return [];
    return shopData.categories.map(c => ({
      id: c.slug, // Use slug as ID for URL compatibility
      slug: c.slug,
      name: { en: c.name.en || '', ar: c.name.ar || '' },
      productCount: c.productCount,
    }));
  }, [shopData]);

  const allBrands = useMemo(() => shopData?.brands || [], [shopData]);

  const allColors: ProductColor[] = useMemo(() => {
    if (!shopData) return [];
    return shopData.colors.map(c => ({
      id: c.id,
      name: { en: c.name.en || '', ar: c.name.ar || '' },
      hex: c.hex,
    }));
  }, [shopData]);

  const priceRange: [number, number] = useMemo(() => {
    if (!shopData) return [0, 1000];
    // Use the correct price range based on selected currency
    if (currency === 'INR') {
      return [Math.floor(shopData.minPriceINR || 0), Math.ceil(shopData.maxPriceINR || 10000)];
    }
    return [Math.floor(shopData.minPriceKWD || 0), Math.ceil(shopData.maxPriceKWD || 100)];
  }, [shopData, currency]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  // Handle category filter change - navigate to new URL
  const handleFiltersChange = (newFilters: ProductFilters) => {
    // If category changed, navigate to new path
    if (newFilters.categoryId !== filters.categoryId) {
      if (newFilters.categoryId) {
        navigate(routes.category(newFilters.categoryId));
      } else {
        navigate(routes.shop);
      }
      // Update other filters without categoryId (it will be set from URL)
      const { categoryId, ...otherFilters } = newFilters;
      setFilters(otherFilters);
    } else {
      setFilters(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate(routes.shop);
    setFilters({});
  };

  // Quick filter chips
  const chips = [
    {
      label: t('All', 'الكل'),
      active: !categorySlug && !filters.isOnSale && !filters.isNew && !filters.isBestSeller,
      onClick: () => {
        navigate(routes.shop);
        setFilters({});
      }
    },
    {
      label: t('New Arrivals', 'وصل حديثاً'),
      active: !!filters.isNew,
      onClick: () => {
        navigate('/shop?filter=new');
        setFilters({ isNew: true });
      }
    },
    {
      label: t('On Sale', 'تخفيضات'),
      active: !!filters.isOnSale,
      onClick: () => {
        navigate('/shop?sale=true');
        setFilters({ isOnSale: true });
      }
    },
    {
      label: t('Best Sellers', 'الأكثر مبيعاً'),
      active: !!filters.isBestSeller,
      onClick: () => {
        navigate('/shop?filter=bestseller');
        setFilters({ isBestSeller: true });
      }
    },
  ];

  // Get current category/subcategory/type names for breadcrumbs
  const currentCategoryName = useMemo(() => {
    if (!categorySlug || !shopData) return null;
    const cat = shopData.categories.find(c => c.slug === categorySlug);
    return cat ? (lang === 'ar' ? cat.name.ar : cat.name.en) : null;
  }, [categorySlug, shopData, lang]);

  // Build breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs = [
      { label: t('Home', 'الرئيسية'), href: '/' },
      { label: t('Shop', 'المتجر'), href: routes.shop },
    ];

    if (categorySlug && currentCategoryName) {
      crumbs.push({
        label: currentCategoryName,
        href: routes.category(categorySlug),
      });
    }

    // TODO: Add subcategory and type breadcrumbs when we have name mappings

    return crumbs;
  }, [categorySlug, currentCategoryName, t]);

  // Page title
  const pageTitle = useMemo(() => {
    if (typeSlug) return typeSlug.replace(/-/g, ' ');
    if (subcategorySlug) return subcategorySlug.replace(/-/g, ' ');
    if (currentCategoryName) return currentCategoryName;
    return t('Shop All', 'تسوق الكل');
  }, [typeSlug, subcategorySlug, currentCategoryName, t]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />

      <main className="container py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} />}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="hover:text-foreground">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 capitalize">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Discover our curated collection of premium fashion and lifestyle.', 'اكتشف مجموعتنا المختارة من الأزياء الفاخرة ونمط الحياة.')}
          </p>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {chips.map(chip => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${chip.active
                ? 'bg-header text-header-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <FilterSidebar
              filters={{ ...filters, categoryId: categorySlug }}
              onChange={handleFiltersChange}
              categories={shopCategories}
              brands={allBrands}
              colors={allColors}
              priceRange={priceRange}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <SortControls
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewChange={setViewMode}
              resultCount={totalCount}
              onFilterToggle={() => setFilterOpen(true)}
            />

            {/* Loading state */}
            {loading ? (
              <div className="mt-6 grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary animate-pulse rounded-lg aspect-[3/4]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              /* Product grid */
              <div className={`mt-6 grid gap-4 md:gap-6 ${viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3'
                : 'grid-cols-2 md:grid-cols-4'
                }`}>
                {products.map(product => (
                  <ApiProductCard key={product.id} product={product} compact={viewMode === 'compact'} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">{t('No products match your filters.', 'لا توجد منتجات مطابقة.')}</p>
                <button onClick={clearAllFilters} className="mt-2 text-sm text-brand hover:underline">
                  {t('Clear filters', 'مسح التصفية')}
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${p === page
                      ? 'bg-header text-header-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side={lang === 'ar' ? 'right' : 'left'} className="w-[300px] overflow-y-auto">
          <FilterSidebar
            filters={{ ...filters, categoryId: categorySlug }}
            onChange={(f) => { handleFiltersChange(f); setFilterOpen(false); }}
            categories={shopCategories}
            brands={allBrands}
            colors={allColors}
            priceRange={priceRange}
            onClose={() => setFilterOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default ShopPage;
