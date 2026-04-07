import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import OrderSummary from '@/components/checkout/OrderSummary';
import StepDetails from '@/components/checkout/StepDetails';
import StepAddress from '@/components/checkout/StepAddress';
import StepShipping from '@/components/checkout/StepShipping';
import StepPayment from '@/components/checkout/StepPayment';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/context/CartContext';
import type { CheckoutStep } from '@/types/checkout';

const pathToStep: Record<string, CheckoutStep> = {
  '/checkout/details': 'details',
  '/checkout/address': 'address',
  '/checkout/shipping': 'shipping',
  '/checkout/payment': 'payment',
};

const CheckoutPage = () => {
  const { lang } = useLocale();
  const { items } = useCart();
  const nav = useNavigate();
  const location = useLocation();
  const isAr = lang === 'ar';

  const step = pathToStep[location.pathname] || 'details';

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) nav('/cart', { replace: true });
  }, [items.length, nav]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />

      <main className="container py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">{isAr ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-foreground">{isAr ? 'السلة' : 'Cart'}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{isAr ? 'إتمام الشراء' : 'Checkout'}</span>
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
          {isAr ? 'إتمام الشراء' : 'Checkout'}
        </h1>

        <CheckoutStepper current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2">
            {step === 'details' && <StepDetails />}
            {step === 'address' && <StepAddress />}
            {step === 'shipping' && <StepShipping />}
            {step === 'payment' && <StepPayment />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
