import api from "@/lib/axios";

export interface HeroSlideDto {
  id: string;
  bannerName?: string;
  slug?: string;
  labelEnglish?: string;
  labelArabic?: string;
  titleEnglish?: string;
  titleArabic?: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  ctaTextEnglish?: string;
  ctaTextArabic?: string;
  currentPriceKWD?: number | null;
  oldPriceKWD?: number | null;
  currentPriceINR?: number | null;
  oldPriceINR?: number | null;
  linkType?: string;
  categoryId?: string;
  subcategoryId?: string;
  productTypeId?: string;
  productId?: string;
  customUrl?: string;
  // Slugs for URL building
  categorySlug?: string;
  subcategorySlug?: string;
  productTypeSlug?: string;
  productSlug?: string;
  desktopImageFile?: File;
  mobileImageFile?: File;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  altText?: string;
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

export const heroSlideApi = {
  getAll: () => api.get<ApiResponse<HeroSlideDto[]>>("/HeroSlide/get-all"),
  getActive: () => api.get<ApiResponse<HeroSlideDto[]>>("/HeroSlide/get-active"),
  getById: (id: string) => api.get<ApiResponse<HeroSlideDto>>(`/HeroSlide/get/${id}`),
  create: (data: FormData) => api.post<ApiResponse<HeroSlideDto>>("/HeroSlide/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<HeroSlideDto>>(`/HeroSlide/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/HeroSlide/delete/${id}`),
  reorder: (orderedIds: string[]) => api.put<ApiResponse<object>>("/HeroSlide/reorder", { orderedIds }),
};
