import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import SubcategoriesPage from "./pages/SubcategoriesPage";
import ProductTypesPage from "./pages/ProductTypesPage";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import ViewProductPage from "./pages/ViewProductPage";
import NotificationsPage from "./pages/NotificationsPage";
import HeroBannersPage from "./pages/HeroBannersPage";
import ShopByCategoryPage from "./pages/ShopByCategoryPage";
import PromoBannersPage from "./pages/PromoBannersPage";
import SettingsPage from "./pages/SettingsPage";
import AboutUsPage from "./pages/AboutUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";
import ContactUsPage from "./pages/ContactUsPage";
import ShippingInformationPage from "./pages/ShippingInformationPage";
import ReturnsExchangePage from "./pages/ReturnsExchangePage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import CouponsPage from "./pages/CouponsPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const queryClient = new QueryClient();

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </NotificationProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedAdmin><DashboardPage /></ProtectedAdmin>} />
            <Route path="/categories" element={<ProtectedAdmin><CategoriesPage /></ProtectedAdmin>} />
            <Route path="/subcategories" element={<ProtectedAdmin><SubcategoriesPage /></ProtectedAdmin>} />
            <Route path="/product-types" element={<ProtectedAdmin><ProductTypesPage /></ProtectedAdmin>} />
            <Route path="/products" element={<ProtectedAdmin><ProductsPage /></ProtectedAdmin>} />
            <Route path="/products/new" element={<ProtectedAdmin><CreateProductPage /></ProtectedAdmin>} />
            <Route path="/products/edit/:id" element={<ProtectedAdmin><EditProductPage /></ProtectedAdmin>} />
            <Route path="/products/view/:id" element={<ProtectedAdmin><ViewProductPage /></ProtectedAdmin>} />
            <Route path="/notifications" element={<ProtectedAdmin><NotificationsPage /></ProtectedAdmin>} />
            <Route path="/hero-banners" element={<ProtectedAdmin><HeroBannersPage /></ProtectedAdmin>} />
            <Route path="/shop-by-category" element={<ProtectedAdmin><ShopByCategoryPage /></ProtectedAdmin>} />
            <Route path="/promo-banners" element={<ProtectedAdmin><PromoBannersPage /></ProtectedAdmin>} />
            <Route path="/settings" element={<ProtectedAdmin><SettingsPage /></ProtectedAdmin>} />
            <Route path="/coupons" element={<ProtectedAdmin><CouponsPage /></ProtectedAdmin>} />
            <Route path="/menus" element={<ProtectedAdmin><MenuPage /></ProtectedAdmin>} />
            <Route path="/orders" element={<ProtectedAdmin><OrdersPage /></ProtectedAdmin>} />
            <Route path="/orders/:id" element={<ProtectedAdmin><OrderDetailPage /></ProtectedAdmin>} />
            <Route path="/pages/about-us" element={<ProtectedAdmin><AboutUsPage /></ProtectedAdmin>} />
            <Route path="/pages/privacy-policy" element={<ProtectedAdmin><PrivacyPolicyPage /></ProtectedAdmin>} />
            <Route path="/pages/contact-us" element={<ProtectedAdmin><ContactUsPage /></ProtectedAdmin>} />
            <Route path="/pages/shipping-information" element={<ProtectedAdmin><ShippingInformationPage /></ProtectedAdmin>} />
            <Route path="/pages/returns-exchange" element={<ProtectedAdmin><ReturnsExchangePage /></ProtectedAdmin>} />
            <Route path="/pages/terms-conditions" element={<ProtectedAdmin><TermsConditionsPage /></ProtectedAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
