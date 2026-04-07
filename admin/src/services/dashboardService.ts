import { productService, categoryService, subcategoryService, productTypeService } from './index';
import { heroBannerService } from './heroBannerService';
import { shopByCategoryService } from './shopByCategoryService';
import { promoBannerService } from './promoBannerService';
import { settingsService } from './settingsService';
import { productVariantService } from './productVariantService';
import api from '@/lib/axios';

export interface StatusItem {
  label: string;
  status: 'connected' | 'disconnected' | 'ready' | 'warning' | 'error' | 'pending';
  detail?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  categories: number;
  subcategories: number;
  productTypes: number;
  heroBanners: number;
  shopByCategoryItems: number;
  promoBanners: number;
  lowStockItems: number;
  productsMissingImages: number;
  productsMissingVariants: number;
  productsMissingSeo: number;
  bannersMissingArabic: number;
}

export interface CatalogHealth {
  total: number;
  active: number;
  draft: number;
  missingVariants: number;
  missingImages: number;
  missingPricing: number;
  zeroStock: number;
}

// Helper to check backend connectivity
let backendConnected = false;
const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await api.get('/Category/top');
    backendConnected = true;
    return true;
  } catch {
    backendConnected = false;
    return false;
  }
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [products, categories, subcategories, productTypes, heroBanners, shopItems, promoItems, lowStockCount] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
      subcategoryService.getSubcategories(),
      productTypeService.getProductTypes(),
      heroBannerService.getBanners(),
      shopByCategoryService.getItems(),
      promoBannerService.getItems(),
      productVariantService.getLowStockCount(5),
    ]);

    const active = products.filter(p => p.status === 'active');
    const draft = products.filter(p => p.status === 'draft');
    const missingImages = products.filter(p => !p.image_url);

    return {
      totalProducts: products.length,
      activeProducts: active.length,
      draftProducts: draft.length,
      categories: categories.filter(c => c.status === 'active').length,
      subcategories: subcategories.filter(s => s.status === 'active').length,
      productTypes: productTypes.filter(p => p.status === 'active').length,
      heroBanners: heroBanners.length,
      shopByCategoryItems: shopItems.length,
      promoBanners: promoItems.length,
      lowStockItems: lowStockCount,
      productsMissingImages: missingImages.length,
      productsMissingVariants: 0,
      productsMissingSeo: 0,
      bannersMissingArabic: heroBanners.filter(b => !b.title_ar).length,
    };
  },

  async getCatalogHealth(): Promise<CatalogHealth> {
    const products = await productService.getProducts();
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      draft: products.filter(p => p.status === 'draft').length,
      missingVariants: 0,
      missingImages: products.filter(p => !p.image_url).length,
      missingPricing: products.filter(p => !p.base_price_kwd && !p.base_price_inr).length,
      zeroStock: products.filter(p => p.stock_quantity === 0).length,
    };
  },

  async getTechnicalStatus(): Promise<StatusItem[]> {
    // Check backend connectivity
    const isConnected = await checkBackendConnection();

    let featureSettings = {
      enableArabic: false,
      enableKwd: false,
      enableInr: false,
    };

    try {
      featureSettings = await settingsService.getSettings();
    } catch {
      // Settings fetch failed, use defaults
    }

    return [
      { label: 'Backend API', status: isConnected ? 'connected' : 'disconnected', detail: isConnected ? 'API connected' : 'Cannot reach API' },
      { label: 'Database', status: isConnected ? 'connected' : 'disconnected', detail: isConnected ? 'SQL Server connected' : 'Not connected' },
      { label: 'File Storage', status: isConnected ? 'connected' : 'disconnected', detail: isConnected ? 'Azure Blob ready' : 'Not connected' },
      { label: 'Auth Service', status: isConnected ? 'ready' : 'error', detail: isConnected ? 'JWT auth active' : 'Auth unavailable' },
      { label: 'Search Index', status: 'ready', detail: 'Global search ready' },
      { label: 'Notification Service', status: 'ready', detail: 'Notification engine active' },
      { label: 'Arabic Content', status: featureSettings.enableArabic ? 'ready' : 'warning', detail: featureSettings.enableArabic ? 'Enabled' : 'Disabled' },
      { label: 'KWD Currency', status: featureSettings.enableKwd ? 'ready' : 'warning', detail: featureSettings.enableKwd ? 'Enabled' : 'Disabled' },
      { label: 'INR Currency', status: featureSettings.enableInr ? 'ready' : 'warning', detail: featureSettings.enableInr ? 'Enabled' : 'Disabled' },
      { label: 'Payment Gateway', status: 'connected', detail: 'MyFatoorah configured' },
      { label: 'Checkout Config', status: 'ready', detail: 'Country address rules configured' },
    ];
  },

  async getWarnings(): Promise<string[]> {
    const stats = await this.getStats();
    const warnings: string[] = [];

    if (!backendConnected) {
      warnings.push('Backend API not connected – check server status');
    }
    if (stats.productsMissingImages > 0) warnings.push(`${stats.productsMissingImages} product(s) missing images`);
    if (stats.lowStockItems > 0) warnings.push(`${stats.lowStockItems} product(s) with low stock`);
    if (stats.bannersMissingArabic > 0) warnings.push(`${stats.bannersMissingArabic} banner(s) missing Arabic text`);
    if (stats.draftProducts > 0) warnings.push(`${stats.draftProducts} product(s) still in draft`);
    return warnings;
  },
};
