import api from '@/lib/axios';
import type { ShopByCategoryItem } from '@/types/shopByCategory';
import { registerSearchProvider } from './searchService';

// API response type from backend
interface ShopByCategoryDto {
  id: string;
  internalName: string;
  titleEnglish: string;
  titleArabic: string;
  imageUrl: string | null;
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
  createdAt: string;
  updatedAt: string;
}

// Convert backend DTO to frontend type
function toShopByCategoryItem(dto: ShopByCategoryDto): ShopByCategoryItem {
  return {
    id: dto.id,
    internal_name: dto.internalName,
    title_en: dto.titleEnglish,
    title_ar: dto.titleArabic,
    image_url: dto.imageUrl || '',
    alt_text: dto.altText || '',
    link_type: dto.linkType as ShopByCategoryItem['link_type'],
    category_id: dto.categoryId || '',
    subcategory_id: dto.subcategoryId || '',
    product_type_id: dto.productTypeId || '',
    product_id: dto.productId || '',
    custom_url: dto.customUrl || '',
    sort_order: dto.sortOrder,
    is_active: dto.isActive,
    is_published: dto.isPublished,
    created_at: dto.createdAt,
    updated_at: dto.updatedAt,
  };
}

// Convert frontend type to FormData for backend (with file upload support)
function toFormData(item: Partial<ShopByCategoryItem>, imageFile?: File): FormData {
  const formData = new FormData();

  if (item.internal_name !== undefined) formData.append('InternalName', item.internal_name);
  if (item.title_en !== undefined) formData.append('TitleEnglish', item.title_en);
  if (item.title_ar !== undefined && item.title_ar) formData.append('TitleArabic', item.title_ar);
  if (item.image_url !== undefined && item.image_url) formData.append('ImageUrl', item.image_url);
  if (item.alt_text !== undefined && item.alt_text) formData.append('AltText', item.alt_text);
  if (item.link_type !== undefined) formData.append('LinkType', item.link_type);

  // Only append GUID fields if they have valid values
  if (item.category_id !== undefined && item.category_id && item.category_id.trim() !== '') {
    formData.append('CategoryId', item.category_id);
  }
  if (item.subcategory_id !== undefined && item.subcategory_id && item.subcategory_id.trim() !== '') {
    formData.append('SubcategoryId', item.subcategory_id);
  }
  if (item.product_type_id !== undefined && item.product_type_id && item.product_type_id.trim() !== '') {
    formData.append('ProductTypeId', item.product_type_id);
  }
  if (item.product_id !== undefined && item.product_id && item.product_id.trim() !== '') {
    formData.append('ProductId', item.product_id);
  }
  if (item.custom_url !== undefined && item.custom_url) formData.append('CustomUrl', item.custom_url);

  if (item.sort_order !== undefined) formData.append('SortOrder', item.sort_order.toString());
  if (item.is_active !== undefined) formData.append('IsActive', item.is_active.toString());
  if (item.is_published !== undefined) formData.append('IsPublished', item.is_published.toString());

  // Add file upload
  if (imageFile) formData.append('ImageFile', imageFile);

  return formData;
}

// Cache for search provider
let cachedItems: ShopByCategoryItem[] = [];

export const shopByCategoryService = {
  async getItems(): Promise<ShopByCategoryItem[]> {
    try {
      const response = await api.get<{ success: boolean; data: ShopByCategoryDto[] }>('/ShopByCategory/get-all');
      const items = response.data.data.map(toShopByCategoryItem);
      cachedItems = items; // Update cache for search
      return items;
    } catch (error) {
      console.error('Failed to fetch shop by category items:', error);
      return [];
    }
  },

  async getActiveItems(): Promise<ShopByCategoryItem[]> {
    try {
      const response = await api.get<{ success: boolean; data: ShopByCategoryDto[] }>('/ShopByCategory/get-active');
      return response.data.data.map(toShopByCategoryItem);
    } catch (error) {
      console.error('Failed to fetch active shop by category items:', error);
      return [];
    }
  },

  async getItemById(id: string): Promise<ShopByCategoryItem | undefined> {
    try {
      const response = await api.get<{ success: boolean; data: ShopByCategoryDto }>(`/ShopByCategory/get/${id}`);
      return toShopByCategoryItem(response.data.data);
    } catch (error) {
      console.error('Failed to fetch shop by category item:', error);
      return undefined;
    }
  },

  async createItem(
    data: Omit<ShopByCategoryItem, 'id' | 'created_at' | 'updated_at'>,
    imageFile?: File
  ): Promise<ShopByCategoryItem> {
    try {
      console.log('Creating item with data:', data);
      console.log('Image file:', imageFile);

      const formData = toFormData(data, imageFile);

      // Create a copy of formData for debugging
      const formDataEntries = [];
      for (const [key, value] of formData.entries()) {
        formDataEntries.push({ key, value });
      }
      console.log('FormData entries:', formDataEntries);

      const response = await api.post<{ success: boolean; data: ShopByCategoryDto }>(
        '/ShopByCategory/create',
        formData,
        {
          transformRequest: [(data) => {
            // Return FormData as-is and let browser handle Content-Type
            return data;
          }],
        }
      );

      console.log('Backend response:', response.data);
      return toShopByCategoryItem(response.data.data);
    } catch (error: any) {
      console.error('Error creating item:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async updateItem(
    id: string,
    data: Partial<ShopByCategoryItem>,
    imageFile?: File
  ): Promise<ShopByCategoryItem | undefined> {
    try {
      const formData = toFormData(data, imageFile);
      const response = await api.put<{ success: boolean; data: ShopByCategoryDto }>(
        `/ShopByCategory/update/${id}`,
        formData,
        {
          transformRequest: [(data) => {
            // Return FormData as-is and let browser handle Content-Type
            return data;
          }],
        }
      );
      return toShopByCategoryItem(response.data.data);
    } catch (error) {
      console.error('Failed to update shop by category item:', error);
      return undefined;
    }
  },

  async deleteItem(id: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean }>(`/ShopByCategory/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete shop by category item:', error);
      return false;
    }
  },

  async reorderItems(orderedIds: string[]): Promise<void> {
    try {
      await api.put('/ShopByCategory/reorder', { orderedIds });
    } catch (error) {
      console.error('Failed to reorder shop by category items:', error);
    }
  },
};

// Register with global search
registerSearchProvider('shop-by-category', (q) =>
  cachedItems
    .filter(i => i.internal_name.toLowerCase().includes(q) || i.title_en.toLowerCase().includes(q))
    .map(i => ({
      id: i.id,
      title: i.internal_name,
      subtitle: i.is_published ? 'Published' : 'Draft',
      category: 'Shop by Category',
      path: '/shop-by-category',
    }))
);
