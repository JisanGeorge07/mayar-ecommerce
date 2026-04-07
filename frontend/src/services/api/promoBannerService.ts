import api from "@/lib/axios";

export interface PromoBannerDto {
  id: string;
  internalName: string;
  layoutType: 'small' | 'large';
  labelEnglish?: string;
  labelArabic?: string;
  titleEnglish?: string;
  titleArabic?: string;
  ctaTextEnglish?: string;
  ctaTextArabic?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  altText?: string;
  linkType: 'category' | 'subcategory' | 'product_type' | 'product' | 'custom_url';
  categoryId?: string;
  subcategoryId?: string;
  productTypeId?: string;
  productId?: string;
  customUrl?: string;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const promoBannerApi = {
  getAll: () => api.get<ApiResponse<PromoBannerDto[]>>("/PromoBanner/get-all"),
  getActive: () => api.get<ApiResponse<PromoBannerDto[]>>("/PromoBanner/get-active"),
  getById: (id: string) => api.get<ApiResponse<PromoBannerDto>>(`/PromoBanner/get/${id}`),
  create: (data: FormData) => api.post<ApiResponse<PromoBannerDto>>("/PromoBanner/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<PromoBannerDto>>(`/PromoBanner/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/PromoBanner/delete/${id}`),
  reorder: (orderedIds: string[]) => api.post<ApiResponse<object>>("/PromoBanner/reorder", orderedIds),
};
