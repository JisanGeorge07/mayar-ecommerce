import api from '@/lib/axios';
import type { PromoBannerItem } from '@/types/promoBanner';
import { registerSearchProvider } from './searchService';

// API response type from backend
interface PromoBannerDto {
  id: string;
  internalName: string;
  layoutType: string;
  labelEnglish: string | null;
  labelArabic: string | null;
  titleEnglish: string | null;
  titleArabic: string | null;
  ctaTextEnglish: string | null;
  ctaTextArabic: string | null;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  altText: string | null;
  linkType: string;
  categoryId: string | null;
  subcategoryId: string | null;
  productTypeId: string | null;
  productId: string | null;
  customUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Convert backend DTO to frontend type
function toPromoBannerItem(dto: PromoBannerDto): PromoBannerItem {
  return {
    id: dto.id,
    internal_name: dto.internalName || '',
    layout_type: (dto.layoutType as PromoBannerItem['layout_type']) || 'small',
    label_en: dto.labelEnglish || '',
    label_ar: dto.labelArabic || '',
    title_en: dto.titleEnglish || '',
    title_ar: dto.titleArabic || '',
    cta_text_en: dto.ctaTextEnglish || 'Shop now',
    cta_text_ar: dto.ctaTextArabic || 'تسوق الآن',
    desktop_image_url: dto.desktopImageUrl || '',
    mobile_image_url: dto.mobileImageUrl || '',
    alt_text: dto.altText || '',
    link_type: (dto.linkType as PromoBannerItem['link_type']) || 'category',
    category_id: dto.categoryId || '',
    subcategory_id: dto.subcategoryId || '',
    product_type_id: dto.productTypeId || '',
    product_id: dto.productId || '',
    custom_url: dto.customUrl || '',
    sort_order: dto.sortOrder,
    is_active: dto.isActive,
    is_published: dto.isPublished,
    created_at: dto.createdAt || new Date().toISOString(),
    updated_at: dto.updatedAt || new Date().toISOString(),
  };
}

// Convert frontend type to FormData for backend (with file upload support)
function toFormData(
  banner: Partial<Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'>>,
  desktopFile?: File,
  mobileFile?: File
): FormData {
  const formData = new FormData();

  if (banner.internal_name !== undefined) formData.append('InternalName', banner.internal_name);
  if (banner.layout_type !== undefined) formData.append('LayoutType', banner.layout_type);
  if (banner.label_en !== undefined) formData.append('LabelEnglish', banner.label_en);
  if (banner.label_ar !== undefined) formData.append('LabelArabic', banner.label_ar);
  if (banner.title_en !== undefined) formData.append('TitleEnglish', banner.title_en);
  if (banner.title_ar !== undefined) formData.append('TitleArabic', banner.title_ar);
  if (banner.cta_text_en !== undefined) formData.append('CtaTextEnglish', banner.cta_text_en);
  if (banner.cta_text_ar !== undefined) formData.append('CtaTextArabic', banner.cta_text_ar);
  if (banner.alt_text !== undefined) formData.append('AltText', banner.alt_text);
  if (banner.link_type !== undefined) formData.append('LinkType', banner.link_type);
  if (banner.category_id !== undefined && banner.category_id) formData.append('CategoryId', banner.category_id);
  if (banner.subcategory_id !== undefined && banner.subcategory_id) formData.append('SubcategoryId', banner.subcategory_id);
  if (banner.product_type_id !== undefined && banner.product_type_id) formData.append('ProductTypeId', banner.product_type_id);
  if (banner.product_id !== undefined && banner.product_id) formData.append('ProductId', banner.product_id);
  if (banner.custom_url !== undefined) formData.append('CustomUrl', banner.custom_url);
  if (banner.desktop_image_url !== undefined) formData.append('DesktopImageUrl', banner.desktop_image_url);
  if (banner.mobile_image_url !== undefined) formData.append('MobileImageUrl', banner.mobile_image_url);
  if (banner.sort_order !== undefined) formData.append('SortOrder', banner.sort_order.toString());
  if (banner.is_active !== undefined) formData.append('IsActive', banner.is_active.toString());
  if (banner.is_published !== undefined) formData.append('IsPublished', banner.is_published.toString());

  // Add file uploads
  if (desktopFile) formData.append('DesktopImageFile', desktopFile);
  if (mobileFile) formData.append('MobileImageFile', mobileFile);

  return formData;
}

// Cache for search provider
let cachedBanners: PromoBannerItem[] = [];

export const promoBannerService = {
  async getItems(): Promise<PromoBannerItem[]> {
    try {
      const response = await api.get<{ success: boolean; data: PromoBannerDto[] }>('/PromoBanner/get-all');
      const banners = response.data.data.map(toPromoBannerItem);
      cachedBanners = banners; // Update cache for search
      return banners;
    } catch (error) {
      console.error('Failed to fetch promo banners:', error);
      return [];
    }
  },

  async getActiveItems(): Promise<PromoBannerItem[]> {
    try {
      const response = await api.get<{ success: boolean; data: PromoBannerDto[] }>('/PromoBanner/get-active');
      return response.data.data.map(toPromoBannerItem);
    } catch (error) {
      console.error('Failed to fetch active promo banners:', error);
      return [];
    }
  },

  async getItemById(id: string): Promise<PromoBannerItem | undefined> {
    try {
      const response = await api.get<{ success: boolean; data: PromoBannerDto }>(`/PromoBanner/get/${id}`);
      return toPromoBannerItem(response.data.data);
    } catch (error) {
      console.error('Failed to fetch promo banner:', error);
      return undefined;
    }
  },

  async createItem(
    data: Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'>,
    desktopFile?: File,
    mobileFile?: File
  ): Promise<PromoBannerItem> {
    const formData = toFormData(data, desktopFile, mobileFile);
    const response = await api.post<{ success: boolean; data: PromoBannerDto }>('/PromoBanner/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return toPromoBannerItem(response.data.data);
  },

  async updateItem(
    id: string,
    data: Partial<PromoBannerItem>,
    desktopFile?: File,
    mobileFile?: File
  ): Promise<PromoBannerItem | undefined> {
    try {
      const formData = toFormData(data, desktopFile, mobileFile);
      const response = await api.put<{ success: boolean; data: PromoBannerDto }>(`/PromoBanner/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return toPromoBannerItem(response.data.data);
    } catch (error) {
      console.error('Failed to update promo banner:', error);
      return undefined;
    }
  },

  async deleteItem(id: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean }>(`/PromoBanner/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete promo banner:', error);
      return false;
    }
  },

  async reorderItems(orderedIds: string[]): Promise<void> {
    try {
      await api.post('/PromoBanner/reorder', orderedIds);
    } catch (error) {
      console.error('Failed to reorder promo banners:', error);
    }
  },
};

// Register with global search
registerSearchProvider('promo-banners', (q) =>
  cachedBanners
    .filter(i => i.internal_name.toLowerCase().includes(q) || i.title_en.toLowerCase().includes(q) || i.label_en.toLowerCase().includes(q))
    .map(i => ({ id: i.id, title: i.internal_name, subtitle: `${i.layout_type === 'large' ? 'Large' : 'Small'} · ${i.is_published ? 'Published' : 'Draft'}`, category: 'Promo Banners', path: '/promo-banners' }))
);
