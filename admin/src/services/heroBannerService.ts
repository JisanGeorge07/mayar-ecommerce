import api from '@/lib/axios';
import type { HeroBanner } from '@/types/heroBanner';
import { registerSearchProvider } from './searchService';

// API response type from backend
interface HeroSlideDto {
  id: string;
  bannerName: string | null;
  slug: string | null;
  labelEnglish: string | null;
  labelArabic: string | null;
  titleEnglish: string | null;
  titleArabic: string | null;
  descriptionEnglish: string | null;
  descriptionArabic: string | null;
  ctaTextEnglish: string | null;
  ctaTextArabic: string | null;
  currentPriceKWD: number | null;
  oldPriceKWD: number | null;
  currentPriceINR: number | null;
  oldPriceINR: number | null;
  linkType: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  productTypeId: string | null;
  productId: string | null;
  customUrl: string | null;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  altText: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Convert backend DTO to frontend type
function toHeroBanner(dto: HeroSlideDto): HeroBanner {
  return {
    id: dto.id,
    banner_name: dto.bannerName || '',
    slug: dto.slug || '',
    label_en: dto.labelEnglish || '',
    label_ar: dto.labelArabic || '',
    title_en: dto.titleEnglish || '',
    title_ar: dto.titleArabic || '',
    description_en: dto.descriptionEnglish || '',
    description_ar: dto.descriptionArabic || '',
    cta_text_en: dto.ctaTextEnglish || 'Shop now',
    cta_text_ar: dto.ctaTextArabic || 'تسوق الآن',
    current_price_kwd: dto.currentPriceKWD,
    old_price_kwd: dto.oldPriceKWD,
    current_price_inr: dto.currentPriceINR,
    old_price_inr: dto.oldPriceINR,
    link_type: (dto.linkType as HeroBanner['link_type']) || 'category',
    category_id: dto.categoryId || '',
    subcategory_id: dto.subcategoryId || '',
    product_type_id: dto.productTypeId || '',
    product_id: dto.productId || '',
    custom_url: dto.customUrl || '',
    desktop_image_url: dto.desktopImageUrl || '',
    mobile_image_url: dto.mobileImageUrl || '',
    alt_text: dto.altText || '',
    sort_order: dto.sortOrder,
    is_active: dto.isActive,
    is_published: dto.isPublished,
    created_at: dto.createdAt || new Date().toISOString(),
    updated_at: dto.updatedAt || new Date().toISOString(),
  };
}

// Convert frontend type to FormData for backend (with file upload support)
function toFormData(banner: Partial<HeroBanner>, desktopFile?: File, mobileFile?: File): FormData {
  const formData = new FormData();

  if (banner.banner_name !== undefined) formData.append('BannerName', banner.banner_name);
  if (banner.slug !== undefined) formData.append('Slug', banner.slug);
  if (banner.label_en !== undefined) formData.append('LabelEnglish', banner.label_en);
  if (banner.label_ar !== undefined) formData.append('LabelArabic', banner.label_ar);
  if (banner.title_en !== undefined) formData.append('TitleEnglish', banner.title_en);
  if (banner.title_ar !== undefined) formData.append('TitleArabic', banner.title_ar);
  if (banner.description_en !== undefined) formData.append('DescriptionEnglish', banner.description_en);
  if (banner.description_ar !== undefined) formData.append('DescriptionArabic', banner.description_ar);
  if (banner.cta_text_en !== undefined) formData.append('CtaTextEnglish', banner.cta_text_en);
  if (banner.cta_text_ar !== undefined) formData.append('CtaTextArabic', banner.cta_text_ar);
  if (banner.current_price_kwd !== undefined && banner.current_price_kwd !== null)
    formData.append('CurrentPriceKWD', banner.current_price_kwd.toString());
  if (banner.old_price_kwd !== undefined && banner.old_price_kwd !== null)
    formData.append('OldPriceKWD', banner.old_price_kwd.toString());
  if (banner.current_price_inr !== undefined && banner.current_price_inr !== null)
    formData.append('CurrentPriceINR', banner.current_price_inr.toString());
  if (banner.old_price_inr !== undefined && banner.old_price_inr !== null)
    formData.append('OldPriceINR', banner.old_price_inr.toString());
  if (banner.link_type !== undefined) formData.append('LinkType', banner.link_type);
  if (banner.category_id !== undefined && banner.category_id) formData.append('CategoryId', banner.category_id);
  if (banner.subcategory_id !== undefined && banner.subcategory_id) formData.append('SubcategoryId', banner.subcategory_id);
  if (banner.product_type_id !== undefined && banner.product_type_id) formData.append('ProductTypeId', banner.product_type_id);
  if (banner.product_id !== undefined && banner.product_id) formData.append('ProductId', banner.product_id);
  if (banner.custom_url !== undefined) formData.append('CustomUrl', banner.custom_url);
  if (banner.desktop_image_url !== undefined) formData.append('DesktopImageUrl', banner.desktop_image_url);
  if (banner.mobile_image_url !== undefined) formData.append('MobileImageUrl', banner.mobile_image_url);
  if (banner.alt_text !== undefined) formData.append('AltText', banner.alt_text);
  if (banner.sort_order !== undefined) formData.append('SortOrder', banner.sort_order.toString());
  if (banner.is_active !== undefined) formData.append('IsActive', banner.is_active.toString());
  if (banner.is_published !== undefined) formData.append('IsPublished', banner.is_published.toString());

  // Add file uploads
  if (desktopFile) formData.append('DesktopImageFile', desktopFile);
  if (mobileFile) formData.append('MobileImageFile', mobileFile);

  return formData;
}

// Cache for search provider
let cachedBanners: HeroBanner[] = [];

export const heroBannerService = {
  async getBanners(): Promise<HeroBanner[]> {
    try {
      const response = await api.get<{ success: boolean; data: HeroSlideDto[] }>('/HeroSlide/get-all');
      const banners = response.data.data.map(toHeroBanner);
      cachedBanners = banners; // Update cache for search
      return banners;
    } catch (error) {
      console.error('Failed to fetch hero banners:', error);
      return [];
    }
  },

  async getActiveBanners(): Promise<HeroBanner[]> {
    try {
      const response = await api.get<{ success: boolean; data: HeroSlideDto[] }>('/HeroSlide/get-active');
      return response.data.data.map(toHeroBanner);
    } catch (error) {
      console.error('Failed to fetch active hero banners:', error);
      return [];
    }
  },

  async getBannerById(id: string): Promise<HeroBanner | undefined> {
    try {
      const response = await api.get<{ success: boolean; data: HeroSlideDto }>(`/HeroSlide/get/${id}`);
      return toHeroBanner(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hero banner:', error);
      return undefined;
    }
  },

  async createBanner(
    data: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>,
    desktopFile?: File,
    mobileFile?: File
  ): Promise<HeroBanner> {
    const formData = toFormData(data, desktopFile, mobileFile);
    const response = await api.post<{ success: boolean; data: HeroSlideDto }>('/HeroSlide/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return toHeroBanner(response.data.data);
  },

  async updateBanner(
    id: string,
    data: Partial<HeroBanner>,
    desktopFile?: File,
    mobileFile?: File
  ): Promise<HeroBanner | undefined> {
    try {
      const formData = toFormData(data, desktopFile, mobileFile);
      const response = await api.put<{ success: boolean; data: HeroSlideDto }>(`/HeroSlide/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return toHeroBanner(response.data.data);
    } catch (error) {
      console.error('Failed to update hero banner:', error);
      return undefined;
    }
  },

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean }>(`/HeroSlide/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete hero banner:', error);
      return false;
    }
  },

  async reorderBanners(orderedIds: string[]): Promise<void> {
    try {
      await api.put('/HeroSlide/reorder', { orderedIds });
    } catch (error) {
      console.error('Failed to reorder hero banners:', error);
    }
  },
};

// Register with global search
registerSearchProvider('hero-banners', (q) =>
  cachedBanners
    .filter(b =>
      b.banner_name.toLowerCase().includes(q) ||
      b.title_en.toLowerCase().includes(q) ||
      b.label_en.toLowerCase().includes(q)
    )
    .map(b => ({
      id: b.id,
      title: b.banner_name,
      subtitle: b.is_published ? 'Published' : 'Draft',
      category: 'Hero Banners',
      path: '/hero-banners',
    }))
);
