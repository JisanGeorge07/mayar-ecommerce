import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/hooks/useLocale";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Index from "./pages/Index.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrackingPage from "./pages/TrackingPage.tsx";
import AdminProductPage from "./pages/AdminProductPage.tsx";
import FloatingTrackingBar from "./components/tracking/FloatingTrackingBar.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { CheckoutProvider } from "./context/CheckoutContext.tsx";
import CartDrawer from "./components/cart/CartDrawer.tsx";
import { TrackingPopupProvider } from "./context/TrackingPopupContext.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import PaymentRedirectingPage from "./pages/PaymentRedirectingPage.tsx";
import PaymentHostedPage from "./pages/PaymentHostedPage.tsx";
import PaymentCallbackPage from "./pages/PaymentCallbackPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import LegalPage from "./pages/LegalPage.tsx";
import SalePage from "./pages/SalePage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import CareersPage from "./pages/CareersPage.tsx";
import TrackingPopupGlobal from "./components/tracking/TrackingPopupGlobal.tsx";

const queryClient = new QueryClient();

const HomeOnlyTrackingBar = () => {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <FloatingTrackingBar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <LocaleProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <CheckoutProvider>
                <TrackingPopupProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/product/:slug" element={<ProductPage />} />
                        {/* SEO-friendly shop routes */}
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/shop/category/:categorySlug" element={<ShopPage />} />
                        <Route path="/shop/category/:categorySlug/subcategory/:subcategorySlug" element={<ShopPage />} />
                        <Route path="/shop/category/:categorySlug/subcategory/:subcategorySlug/type/:typeSlug" element={<ShopPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/track-order" element={<TrackingPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout/details" element={<CheckoutPage />} />
                        <Route path="/checkout/address" element={<CheckoutPage />} />
                        <Route path="/checkout/shipping" element={<CheckoutPage />} />
                        <Route path="/checkout/payment" element={<CheckoutPage />} />
                        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                        <Route path="/payment/redirecting" element={<PaymentRedirectingPage />} />
                        <Route path="/payment/hosted" element={<PaymentHostedPage />} />
                        <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/sale" element={<SalePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/privacy-policy" element={<LegalPage />} />
                        <Route path="/terms-conditions" element={<LegalPage />} />
                        <Route path="/returns-exchange" element={<LegalPage />} />
                        <Route path="/shipping-info" element={<LegalPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <HomeOnlyTrackingBar />
                      <CartDrawer />
                      <TrackingPopupGlobal />
                    </BrowserRouter>
                  </TooltipProvider>
                </TrackingPopupProvider>
              </CheckoutProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </LocaleProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
