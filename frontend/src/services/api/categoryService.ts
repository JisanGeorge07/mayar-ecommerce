import api from "@/lib/axios";
import type { TranslatedText } from "@/types";

export interface TopCategoryDto {
  id: string;
  slug?: string;
  imageFile?: File;
  imageUrl?: string;
  imageAlt?: string;
  titleEnglish?: string;
  titleArabic?: string;
  badgeEnglish?: string;
  badgeArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface MiddleCategoryDto {
  id: string;
  topCategoryId: string;
  slug?: string;
  imageFile?: File;
  imageUrl?: string;
  imageAlt?: string;
  titleEnglish?: string;
  titleArabic?: string;
  subtitleEnglish?: string;
  subtitleArabic?: string;
  buttonTextEnglish?: string;
  buttonTextArabic?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface BottomCategoryDto {
  id: string;
  topCategoryId: string;
  middleCategoryId: string;
  slug?: string;
  imageFile?: File;
  imageUrl?: string;
  imageAlt?: string;
  titleEnglish?: string;
  titleArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// MegaMenu API types (matching backend DTOs)
export interface TranslatedTextDto {
  en?: string;
  ar?: string;
}

export interface MegaMenuLinkDto {
  id: string;
  label: TranslatedTextDto;
  slug: string;
}

export interface MegaMenuSectionDto {
  id: string;
  title: TranslatedTextDto;
  links: MegaMenuLinkDto[];
}

export interface NavMenuItemDto {
  id: string;
  label: TranslatedTextDto;
  slug: string;
  type: 'link' | 'mega';
  badge?: TranslatedTextDto;
  sections?: MegaMenuSectionDto[];
  featuredImage?: string;
  featuredTitle?: TranslatedTextDto;
  featuredCta?: TranslatedTextDto;
}

// Catalog types for frontend usage
export interface CatalogProductType {
  id: string;
  slug: string;
  name: TranslatedText;
  productCount: number;
}

export interface CatalogSubcategory {
  id: string;
  slug: string;
  name: TranslatedText;
  categoryId: string;
  categorySlug: string;
  productTypes: CatalogProductType[];
  productCount: number;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: TranslatedText;
  badge?: TranslatedText;
  subcategories: CatalogSubcategory[];
  productCount: number;
}

// Top Category API
export const topCategoryApi = {
  getAll: () => api.get<ApiResponse<TopCategoryDto[]>>("/Category/top"),
  getById: (id: string) => api.get<ApiResponse<TopCategoryDto>>(`/Category/top/${id}`),
  getBySlug: (slug: string) => api.get<ApiResponse<TopCategoryDto>>(`/Category/top/slug/${slug}`),
  create: (data: FormData) => api.post<ApiResponse<TopCategoryDto>>("/Category/top/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<object>>(`/Category/top/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/Category/top/delete/${id}`),
};

// Middle Category API
export const middleCategoryApi = {
  getAll: () => api.get<ApiResponse<MiddleCategoryDto[]>>("/Category/middle"),
  getById: (id: string) => api.get<ApiResponse<MiddleCategoryDto>>(`/Category/middle/${id}`),
  getBySlug: (slug: string) => api.get<ApiResponse<MiddleCategoryDto>>(`/Category/middle/slug/${slug}`),
  create: (data: FormData) => api.post<ApiResponse<MiddleCategoryDto>>("/Category/middle/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<object>>(`/Category/middle/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/Category/middle/delete/${id}`),
};

// Bottom Category API
export const bottomCategoryApi = {
  getAll: () => api.get<ApiResponse<BottomCategoryDto[]>>("/Category/bottom"),
  getById: (id: string) => api.get<ApiResponse<BottomCategoryDto>>(`/Category/bottom/${id}`),
  getBySlug: (slug: string) => api.get<ApiResponse<BottomCategoryDto>>(`/Category/bottom/slug/${slug}`),
  create: (data: FormData) => api.post<ApiResponse<BottomCategoryDto>>("/Category/bottom/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<object>>(`/Category/bottom/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/Category/bottom/delete/${id}`),
};

// MegaMenu API - hierarchical menu for navigation
export const megaMenuApi = {
  getMenu: () => api.get<ApiResponse<NavMenuItemDto[]>>("/Category/megamenu"),
};
