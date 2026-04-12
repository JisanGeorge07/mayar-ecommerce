import api from "@/lib/axios";
import type { MiddleCategory } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MiddleCategoryCreateInput {
  topCategoryId: string;
  titleEnglish: string;
  titleArabic: string;
  displayOrder?: number;
  slug?: string;
  isActive?: boolean;
}

export interface MiddleCategoryUpdateInput {
  topCategoryId?: string;
  titleEnglish?: string;
  titleArabic?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const middleCategoryService = {
  async getAll(): Promise<MiddleCategory[]> {
    const res = await api.get<ApiResponse<MiddleCategory[]>>("/category/middle");
    return res.data.data;
  },

  async getById(id: string): Promise<MiddleCategory | null> {
    try {
      const res = await api.get<ApiResponse<MiddleCategory>>(`/category/middle/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  async create(data: MiddleCategoryCreateInput): Promise<MiddleCategory> {
    const formData = new FormData();
    formData.append("topCategoryId", data.topCategoryId);
    formData.append("titleEnglish", data.titleEnglish);
    formData.append("titleArabic", data.titleArabic);
    if (data.slug) {
      formData.append("slug", data.slug);
    }
    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }
    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    const res = await api.post<ApiResponse<MiddleCategory>>("/category/middle/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async update(id: string, data: MiddleCategoryUpdateInput): Promise<boolean> {
    const formData = new FormData();
    if (data.topCategoryId !== undefined) {
      formData.append("topCategoryId", data.topCategoryId);
    }
    if (data.titleEnglish !== undefined) {
      formData.append("titleEnglish", data.titleEnglish);
    }
    if (data.titleArabic !== undefined) {
      formData.append("titleArabic", data.titleArabic);
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
      await api.put(`/category/middle/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/category/middle/delete/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async toggleStatus(id: string): Promise<boolean> {
    try {
      await api.patch(`/category/middle/toggle-status/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
