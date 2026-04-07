import api from "@/lib/axios";
import type { BottomCategory } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BottomCategoryCreateInput {
  topCategoryId: string;
  middleCategoryId: string;
  titleEnglish: string;
  titleArabic: string;
}

export interface BottomCategoryUpdateInput {
  topCategoryId?: string;
  middleCategoryId?: string;
  titleEnglish?: string;
  titleArabic?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const bottomCategoryService = {
  async getAll(): Promise<BottomCategory[]> {
    const res = await api.get<ApiResponse<BottomCategory[]>>("/category/bottom");
    return res.data.data;
  },

  async getById(id: string): Promise<BottomCategory | null> {
    try {
      const res = await api.get<ApiResponse<BottomCategory>>(`/category/bottom/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  async create(data: BottomCategoryCreateInput): Promise<BottomCategory> {
    const formData = new FormData();
    formData.append("topCategoryId", data.topCategoryId);
    formData.append("middleCategoryId", data.middleCategoryId);
    formData.append("titleEnglish", data.titleEnglish);
    formData.append("titleArabic", data.titleArabic);

    const res = await api.post<ApiResponse<BottomCategory>>("/category/bottom/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async update(id: string, data: BottomCategoryUpdateInput): Promise<boolean> {
    const formData = new FormData();
    if (data.topCategoryId !== undefined) {
      formData.append("topCategoryId", data.topCategoryId);
    }
    if (data.middleCategoryId !== undefined) {
      formData.append("middleCategoryId", data.middleCategoryId);
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
      await api.put(`/category/bottom/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/category/bottom/delete/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async toggleStatus(id: string): Promise<boolean> {
    try {
      await api.patch(`/category/bottom/toggle-status/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
