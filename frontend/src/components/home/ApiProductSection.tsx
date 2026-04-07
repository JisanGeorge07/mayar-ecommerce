import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ApiProductCard from '@/components/common/ApiProductCard';
import type { ProductDto } from '@/services/api/productService';

interface ApiProductSectionProps {
  titleEn: string;
  titleAr: string;
  products: ProductDto[];
  viewAllHref?: string;
  loading?: boolean;
}

const ApiProductSection = ({ titleEn, titleAr, products, viewAllHref = '/shop', loading = false }: ApiProductSectionProps) => {
  const { lang } = useLocale();

  if (loading) {
    return (
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-48 bg-secondary animate-pulse rounded" />
            <div className="h-5 w-20 bg-secondary animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-secondary animate-pulse rounded-lg aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            {lang === 'ar' ? titleAr : titleEn}
          </h2>
          {viewAllHref && (
            <Link to={viewAllHref} className="text-sm text-brand hover:underline flex items-center gap-1">
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map(product => (
            <ApiProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApiProductSection;
