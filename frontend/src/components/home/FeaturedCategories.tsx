import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { shopByCategoryApi, type ShopByCategoryDto } from '@/services/api/shopByCategoryService';
import { topCategoryApi, middleCategoryApi, bottomCategoryApi } from '@/services/api/categoryService';
import { routes } from '@/lib/routes';

interface CategoryMappings {
  topCategories: Map<string, string>; // id -> slug
  middleCategories: Map<string, { slug: string; topCategorySlug: string }>;
  bottomCategories: Map<string, { slug: string; topCategorySlug: string; middleCategorySlug: string }>;
  products: Map<string, string>; // id -> slug
}

const FeaturedCategories = () => {
  const { lang } = useLocale();
  const [items, setItems] = useState<ShopByCategoryDto[]>([]);
  const [mappings, setMappings] = useState<CategoryMappings>({
    topCategories: new Map(),
    middleCategories: new Map(),
    bottomCategories: new Map(),
    products: new Map(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shop by category items and category mappings in parallel
        const [shopByRes, topRes, middleRes, bottomRes] = await Promise.all([
          shopByCategoryApi.getActive(),
          topCategoryApi.getAll(),
          middleCategoryApi.getAll(),
          bottomCategoryApi.getAll(),
        ]);

        if (shopByRes.data.success && shopByRes.data.data) {
          setItems(shopByRes.data.data);
        }

        // Build category mappings for URL generation
        const topCategories = topRes.data.data || [];
        const middleCategories = middleRes.data.data || [];
        const bottomCategories = bottomRes.data.data || [];

        const topMap = new Map<string, string>();
        topCategories.forEach(tc => {
          if (tc.slug) topMap.set(tc.id, tc.slug);
        });

        const middleMap = new Map<string, { slug: string; topCategorySlug: string }>();
        middleCategories.forEach(mc => {
          if (mc.slug) {
            const topSlug = topMap.get(mc.topCategoryId) || '';
            middleMap.set(mc.id, { slug: mc.slug, topCategorySlug: topSlug });
          }
        });

        const bottomMap = new Map<string, { slug: string; topCategorySlug: string; middleCategorySlug: string }>();
        bottomCategories.forEach(bc => {
          if (bc.slug) {
            const middle = middleMap.get(bc.middleCategoryId);
            bottomMap.set(bc.id, {
              slug: bc.slug,
              topCategorySlug: middle?.topCategorySlug || '',
              middleCategorySlug: middle?.slug || '',
            });
          }
        });

        setMappings({
          topCategories: topMap,
          middleCategories: middleMap,
          bottomCategories: bottomMap,
          products: new Map(), // Products would need separate fetch if needed
        });
      } catch (error) {
        console.error('Failed to fetch featured categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate the correct URL based on linkType
  const getItemHref = (item: ShopByCategoryDto): string => {
    switch (item.linkType) {
      case 'category': {
        if (item.categoryId) {
          const slug = mappings.topCategories.get(item.categoryId);
          if (slug) return routes.category(slug);
        }
        return routes.shop;
      }
      case 'subcategory': {
        if (item.subcategoryId) {
          const middle = mappings.middleCategories.get(item.subcategoryId);
          if (middle && middle.topCategorySlug) {
            return routes.subcategory(middle.topCategorySlug, middle.slug);
          }
        }
        return routes.shop;
      }
      case 'product_type': {
        if (item.productTypeId) {
          const bottom = mappings.bottomCategories.get(item.productTypeId);
          if (bottom && bottom.topCategorySlug && bottom.middleCategorySlug) {
            return routes.productType(bottom.topCategorySlug, bottom.middleCategorySlug, bottom.slug);
          }
        }
        return routes.shop;
      }
      case 'product': {
        if (item.productId) {
          const slug = mappings.products.get(item.productId);
          if (slug) return routes.product(slug);
        }
        return routes.shop;
      }
      case 'custom_url': {
        return item.customUrl || routes.shop;
      }
      default:
        return routes.shop;
    }
  };

  const getItemTitle = (item: ShopByCategoryDto): string => {
    if (lang === 'ar' && item.titleArabic) {
      return item.titleArabic;
    }
    return item.titleEnglish;
  };

  // Don't render if no items
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="pt-10 pb-4 md:pt-16 md:pb-6">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            {lang === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category'}
          </h2>
          <Link to="/shop" className="text-sm text-brand hover:underline flex items-center gap-1">
            {lang === 'ar' ? 'عرض الكل' : 'View All'}
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-20 md:w-24">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary animate-pulse" />
                <div className="h-4 w-16 bg-secondary animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {items.map(item => (
              <Link
                key={item.id}
                to={getItemHref(item)}
                className="flex flex-col items-center gap-2 group w-20 md:w-24"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-brand transition-colors flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.altText || getItemTitle(item)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                      {getItemTitle(item).charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-brand transition-colors text-center min-h-[2em] flex items-start justify-center">
                  {getItemTitle(item)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
