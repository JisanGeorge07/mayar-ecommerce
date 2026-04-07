import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { promoBannerApi, PromoBannerDto } from '@/services/api/promoBannerService';
import { topCategoryApi, middleCategoryApi, bottomCategoryApi, TopCategoryDto, MiddleCategoryDto, BottomCategoryDto } from '@/services/api/categoryService';
import { routes } from '@/lib/routes';

interface CategoryLookup {
  top: Map<string, TopCategoryDto>;
  middle: Map<string, MiddleCategoryDto>;
  bottom: Map<string, BottomCategoryDto>;
}

const PromoBanners = () => {
  const { lang } = useLocale();
  const [promoBanners, setPromoBanners] = useState<PromoBannerDto[]>([]);
  const [categories, setCategories] = useState<CategoryLookup>({ top: new Map(), middle: new Map(), bottom: new Map() });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, topRes, middleRes, bottomRes] = await Promise.all([
          promoBannerApi.getActive(),
          topCategoryApi.getAll(),
          middleCategoryApi.getAll(),
          bottomCategoryApi.getAll(),
        ]);

        if (bannersRes.data.success && bannersRes.data.data) {
          setPromoBanners(bannersRes.data.data);
        }

        const topMap = new Map<string, TopCategoryDto>();
        const middleMap = new Map<string, MiddleCategoryDto>();
        const bottomMap = new Map<string, BottomCategoryDto>();

        if (topRes.data.success && topRes.data.data) {
          topRes.data.data.forEach(c => topMap.set(c.id, c));
        }
        if (middleRes.data.success && middleRes.data.data) {
          middleRes.data.data.forEach(c => middleMap.set(c.id, c));
        }
        if (bottomRes.data.success && bottomRes.data.data) {
          bottomRes.data.data.forEach(c => bottomMap.set(c.id, c));
        }

        setCategories({ top: topMap, middle: middleMap, bottom: bottomMap });
      } catch (error) {
        console.error('Failed to fetch promo banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBannerUrl = (banner: PromoBannerDto): string => {
    switch (banner.linkType) {
      case 'category': {
        if (!banner.categoryId) return '#';
        const category = categories.top.get(banner.categoryId);
        return category?.slug ? routes.category(category.slug) : '#';
      }
      case 'subcategory': {
        if (!banner.categoryId || !banner.subcategoryId) return '#';
        const category = categories.top.get(banner.categoryId);
        const subcategory = categories.middle.get(banner.subcategoryId);
        return category?.slug && subcategory?.slug
          ? routes.subcategory(category.slug, subcategory.slug)
          : '#';
      }
      case 'product_type': {
        if (!banner.categoryId || !banner.subcategoryId || !banner.productTypeId) return '#';
        const category = categories.top.get(banner.categoryId);
        const subcategory = categories.middle.get(banner.subcategoryId);
        const productType = categories.bottom.get(banner.productTypeId);
        return category?.slug && subcategory?.slug && productType?.slug
          ? routes.productType(category.slug, subcategory.slug, productType.slug)
          : '#';
      }
      case 'product': {
        // For products, we'd need to fetch product details - use custom URL for now
        return banner.customUrl || '#';
      }
      case 'custom_url': {
        return banner.customUrl || '#';
      }
      default:
        return '#';
    }
  };

  const getLabel = (banner: PromoBannerDto) =>
    lang === 'ar' ? banner.labelArabic : banner.labelEnglish;

  const getTitle = (banner: PromoBannerDto) =>
    lang === 'ar' ? banner.titleArabic : banner.titleEnglish;

  const getCtaText = (banner: PromoBannerDto) =>
    lang === 'ar' ? banner.ctaTextArabic : banner.ctaTextEnglish;

  const getImageUrl = (banner: PromoBannerDto) => {
    // Use mobile image on small screens if available
    if (typeof window !== 'undefined' && window.innerWidth < 768 && banner.mobileImageUrl) {
      return banner.mobileImageUrl;
    }
    return banner.desktopImageUrl;
  };

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`animate-pulse bg-muted rounded-lg aspect-[16/9] md:aspect-[2/1] ${i === 3 ? 'md:col-span-2' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (promoBanners.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16 bg-secondary/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {promoBanners.map((promo) => (
            <Link
              key={promo.id}
              to={getBannerUrl(promo)}
              className={`group relative overflow-hidden rounded-lg ${promo.layoutType === 'large' ? 'md:col-span-2' : ''}`}
            >
              <div className="aspect-[16/9] md:aspect-[2/1]">
                <img
                  src={getImageUrl(promo)}
                  alt={promo.altText || getTitle(promo) || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-0 start-0 p-5 md:p-8">
                  {getLabel(promo) && (
                    <p className="text-xs md:text-sm text-brand-warm font-medium mb-1">{getLabel(promo)}</p>
                  )}
                  <h3 className="text-lg md:text-2xl font-heading font-bold text-background mb-2">{getTitle(promo)}</h3>
                  <span className="inline-flex items-center px-4 py-2 bg-background text-foreground text-xs md:text-sm font-medium rounded-md group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                    {getCtaText(promo) || (lang === 'ar' ? 'تسوق الآن' : 'Shop now')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
