import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import SortControls from '@/components/shop/SortControls';
import { useLocale } from '@/hooks/useLocale';
import { productApi } from '@/services/api/productService';
import { mapProductDtosToProductItems } from '@/utils/productMapper';
import type { SortOption, ProductItem } from '@/types/product';

const ITEMS_PER_PAGE = 12;

const SalePage = () => {
  const { lang, currency } = useLocale();
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  // Fetch sale products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getFiltered({
          isOnSale: true,
          status: 'active',
          sortBy: sort,
          page,
          pageSize: ITEMS_PER_PAGE,
          currency,
        });

        if (response.data.success && response.data.data) {
          const mapped = mapProductDtosToProductItems(response.data.data.items);
          setProducts(mapped);
          setTotalCount(response.data.data.totalCount);
        }
      } catch (error) {
        console.error('Failed to fetch sale products:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sort, page, currency]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [sort]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><MainHeader /><NavBar />

      <main className="container py-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">{t('Home', 'الرئيسية')}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{t('Sale', 'تخفيضات')}</span>
        </nav>

        <div className="mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('Sale', 'تخفيضات')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Shop our best deals and discounted items.', 'تسوق أفضل العروض والمنتجات المخفضة.')}
          </p>
        </div>

        <SortControls
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewChange={setViewMode}
          resultCount={totalCount}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length > 0 ? (
          <div className={`mt-6 grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'
            }`}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} compact={viewMode === 'compact'} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">{t('No sale items available right now.', 'لا توجد منتجات مخفضة حالياً.')}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${p === page ? 'bg-header text-header-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SalePage;
