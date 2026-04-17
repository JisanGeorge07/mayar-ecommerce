import { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/context/AuthContext';
import { recentlyViewedApi, type RecentlyViewedDto } from '@/services/api/recentlyViewedService';
import { productApi, type ProductDto } from '@/services/api/productService';
import ApiProductCard from '@/components/common/ApiProductCard';
import { toast } from '@/hooks/use-toast';

const AccountRecentlyViewed = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<RecentlyViewedDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchRecentlyViewed = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Get recently viewed items from backend (limit to 12)
      const recentlyViewedResponse = await recentlyViewedApi.getAllByUser(user.id, 12);

      if (recentlyViewedResponse.success && recentlyViewedResponse.data.length > 0) {
        setRecentlyViewedItems(recentlyViewedResponse.data);
        const productIds = recentlyViewedResponse.data.map(item => item.productId);

        // Fetch actual product data
        const productsResponse = await productApi.getByIds(productIds);
        if (productsResponse.data.success && productsResponse.data.data) {
          // Sort products to match the order of recently viewed
          const sortedProducts = productIds
            .map(id => productsResponse.data.data!.find(p => p.id === id))
            .filter(Boolean) as ProductDto[];

          setProducts(sortedProducts);
        }
      } else {
        setProducts([]);
        setRecentlyViewedItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch recently viewed products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyViewed();
  }, [user?.id]);

  const handleClearAll = async () => {
    if (!user?.id) return;

    setClearing(true);
    try {
      const response = await recentlyViewedApi.clearUserHistory(user.id);
      if (response.success) {
        setProducts([]);
        setRecentlyViewedItems([]);
        toast({
          title: t('Success', 'نجح'),
          description: t('Recently viewed history cleared', 'تم مسح السجل المشاهد مؤخراً'),
        });
      } else {
        toast({
          title: t('Error', 'خطأ'),
          description: t('Failed to clear history', 'فشل مسح السجل'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        title: t('Error', 'خطأ'),
        description: t('Failed to clear history', 'فشل مسح السجل'),
        variant: 'destructive',
      });
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-foreground">{t('Recently Viewed', 'شوهد مؤخراً')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-secondary animate-pulse rounded-lg aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-foreground">{t('Recently Viewed', 'شوهد مؤخراً')}</h2>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t('No recently viewed products', 'لا توجد منتجات شوهدت مؤخراً')}</p>
          <Link to="/shop" className="text-sm text-brand hover:underline">{t('Browse Products', 'تصفح المنتجات')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t('Recently Viewed', 'شوهد مؤخراً')} 
        </h2>
        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
          {clearing ? t('Clearing...', 'جارٍ المسح...') : t('Clear All', 'مسح الكل')}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <ApiProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AccountRecentlyViewed;
