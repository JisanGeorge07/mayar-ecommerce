import { useState, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import NavBar from '@/components/layout/NavBar';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import ProductSection from '@/components/home/ProductSection';
import PromoBanners from '@/components/home/PromoBanners';
import NewsletterBlock from '@/components/home/NewsletterBlock';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import { useSettings } from '@/context/SettingsContext';
import { productApi } from '@/services/api/productService';
import { mapProductDtosToProductItems } from '@/utils/productMapper';
import type { ProductItem } from '@/types/product';

const Index = () => {
  const { settings } = useSettings();
  const [bestSellers, setBestSellers] = useState<ProductItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        const products = response.data.data || [];
        const activeProducts = products.filter(p => p.isActive && p.status === 'active');
        const mappedProducts = mapProductDtosToProductItems(activeProducts);

        setBestSellers(mappedProducts.filter(p => p.isBestSeller));
        setNewArrivals(mappedProducts.filter(p => p.isNew));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-background">
        <TopBar />
        <MainHeader />
        <NavBar />
        <main>
          <HeroSlider />
          <FeaturedCategories />
          {bestSellers.length > 0 && (
            <ProductSection
              titleEn="Best Sellers"
              titleAr="الأكثر مبيعاً"
              products={bestSellers}
              viewAllHref="/shop?filter=bestseller"
            />
          )}
          <PromoBanners />
          {newArrivals.length > 0 && (
            <ProductSection
              titleEn="New Arrivals"
              titleAr="وصل حديثاً"
              products={newArrivals}
              viewAllHref="/shop?filter=new"
            />
          )}
          {settings?.enableNewsletter && <NewsletterBlock />}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
