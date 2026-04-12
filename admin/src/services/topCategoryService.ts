import api from "@/lib/axios";
import type { TopCategory } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TopCategoryCreateInput {
  titleEnglish: string;
  titleArabic: string;
  badgeEnglish?: string;
  badgeArabic?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface TopCategoryUpdateInput {
  titleEnglish?: string;
  titleArabic?: string;
  badgeEnglish?: string;
  badgeArabic?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const topCategoryService = {
  async getAll(): Promise<TopCategory[]> {
    const res = await api.get<ApiResponse<TopCategory[]>>("/category/top");
    return res.data.data;
  },

  async getById(id: string): Promise<TopCategory | null> {
    try {
      const res = await api.get<ApiResponse<TopCategory>>(`/category/top/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  async create(data: TopCategoryCreateInput): Promise<TopCategory> {
    const formData = new FormData();
    formData.append("titleEnglish", data.titleEnglish);
    formData.append("titleArabic", data.titleArabic);
    if (data.slug) {
      formData.append("slug", data.slug);
    }
    if (data.badgeEnglish) {
      formData.append("badgeEnglish", data.badgeEnglish);
    }
    if (data.badgeArabic) {
      formData.append("badgeArabic", data.badgeArabic);
    }
    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }
    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    const res = await api.post<ApiResponse<TopCategory>>("/category/top/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async update(id: string, data: TopCategoryUpdateInput): Promise<boolean> {
    const formData = new FormData();
    if (data.titleEnglish !== undefined) {
      formData.append("titleEnglish", data.titleEnglish);
    }
    if (data.titleArabic !== undefined) {
      formData.append("titleArabic", data.titleArabic);
    }
    if (data.badgeEnglish !== undefined) {
      formData.append("badgeEnglish", data.badgeEnglish);
    }
    if (data.badgeArabic !== undefined) {
      formData.append("badgeArabic", data.badgeArabic);
    }
    if (data.slug !== undefined) {
      formData.append("slug", data.slug);
    }
    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }
    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    try {
      await api.put(`/category/top/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/category/top/delete/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async toggleStatus(id: string): Promise<boolean> {
    try {
      await api.patch(`/category/top/toggle-status/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
