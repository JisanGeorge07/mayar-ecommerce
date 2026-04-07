import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import ApiProductSection from '@/components/home/ApiProductSection';
import { useLocale } from '@/hooks/useLocale';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { productApi, type ProductDto } from '@/services/api/productService';
import { mapProductDtoToProductItem } from '@/utils/productMapper';
import type { ProductItem } from '@/types/product';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLocale();
  const { viewedIds, addViewed } = useRecentlyViewed();

  // State
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [productDto, setProductDto] = useState<ProductDto | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductDto[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if we've already added this product to recently viewed
  const hasAddedToViewed = useRef(false);

  // Fetch product by slug
  const fetchProduct = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    hasAddedToViewed.current = false;

    try {
      const response = await productApi.getBySlug(slug);
      if (response.data.success && response.data.data) {
        const dto = response.data.data;
        // Check if product is active and has active status
        if (!dto.isActive || dto.status !== 'active') {
          setError('Product not available');
          return;
        }
        setProductDto(dto);
        setProduct(mapProductDtoToProductItem(dto));
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch related products (same bottom category)
  const fetchRelatedProducts = useCallback(async (dto: ProductDto) => {
    setRelatedLoading(true);
    try {
      const response = await productApi.getFiltered({
        bottomCategoryId: dto.bottomCategoryId || undefined,
        middleCategoryId: !dto.bottomCategoryId ? dto.middleCategoryId : undefined,
        topCategoryId: !dto.bottomCategoryId && !dto.middleCategoryId ? dto.topCategoryId : undefined,
        pageSize: 9,
        page: 1,
      });

      if (response.data.success && response.data.data) {
        const filtered = response.data.data.items.filter(p => p.id !== dto.id && p.isActive && p.status === 'active');
        setRelatedProducts(filtered.slice(0, 8));
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  }, []);

  // Fetch recently viewed products - pass viewedIds as parameter to avoid dependency
  const fetchRecentlyViewed = useCallback(async (currentProductId: string, currentViewedIds: string[]) => {
    const idsToFetch = currentViewedIds.filter(id => id !== currentProductId).slice(0, 8);
    if (idsToFetch.length === 0) {
      setRecentlyViewedProducts([]);
      setRecentlyViewedLoading(false);
      return;
    }

    setRecentlyViewedLoading(true);
    try {
      const response = await productApi.getByIds(idsToFetch);
      if (response.data.success && response.data.data) {
        const activeProducts = response.data.data.filter(p => p.isActive && p.status === 'active');
        setRecentlyViewedProducts(activeProducts);
      }
    } catch (err) {
      console.error('Failed to fetch recently viewed:', err);
    } finally {
      setRecentlyViewedLoading(false);
    }
  }, []);

  // Effect: Fetch product when slug changes
  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [fetchProduct]);

  // Effect: Add to recently viewed and fetch related when product loads
  useEffect(() => {
    if (productDto && !hasAddedToViewed.current) {
      hasAddedToViewed.current = true;
      addViewed(productDto.id);
      fetchRelatedProducts(productDto);
      // Fetch recently viewed with current viewedIds (before the new one is added)
      fetchRecentlyViewed(productDto.id, viewedIds);
    }
  }, [productDto, addViewed, fetchRelatedProducts, fetchRecentlyViewed, viewedIds]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <main className="container py-6">
          <div className="h-5 w-64 bg-secondary animate-pulse rounded mb-6" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div className="aspect-square bg-secondary animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
              <div className="h-8 w-3/4 bg-secondary animate-pulse rounded" />
              <div className="h-4 w-32 bg-secondary animate-pulse rounded" />
              <div className="h-6 w-40 bg-secondary animate-pulse rounded" />
              <div className="h-20 w-full bg-secondary animate-pulse rounded" />
              <div className="h-12 w-full bg-secondary animate-pulse rounded" />
              <div className="h-12 w-full bg-secondary animate-pulse rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><MainHeader /><NavBar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
            {lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/shop" className="text-brand hover:underline">
            {lang === 'ar' ? 'تصفح المتجر' : 'Browse Shop'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />

      <main className="container py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-foreground whitespace-nowrap">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-foreground whitespace-nowrap">
            {lang === 'ar' ? 'المتجر' : 'Shop'}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground truncate">{t(product.name)}</span>
        </nav>

        {/* Product main */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />
      </main>

      {/* Related Products */}
      <ApiProductSection
        titleEn="Related Products"
        titleAr="منتجات مشابهة"
        products={relatedProducts}
        viewAllHref="/shop"
        loading={relatedLoading}
      />

      {/* Recently Viewed */}
      <ApiProductSection
        titleEn="Recently Viewed"
        titleAr="شاهدتها مؤخراً"
        products={recentlyViewedProducts}
        viewAllHref="/shop"
        loading={recentlyViewedLoading}
      />

      <Footer />
    </div>
  );
};

export default ProductPage;
