import api from "@/lib/axios";
import type { ProductVariant } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductVariantCreateInput {
  productId: string;
  productColorId: string;
  productSizeId: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  stockQuantity?: number;
  inStock?: boolean;
  isDefault?: boolean;
  imageFile?: File;
  imageUrl?: string;
}

export interface ProductVariantUpdateInput {
  productColorId?: string;
  productSizeId?: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  stockQuantity?: number;
  inStock?: boolean;
  isDefault?: boolean;
  imageFile?: File;
  imageUrl?: string;
}

export interface CheckStockRequest {
  variantId: string;
  quantity: number;
}

export const productVariantService = {
  async getById(id: string): Promise<ProductVariant | null> {
    try {
      const res = await api.get<ApiResponse<ProductVariant>>(`/productvariant/get/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  async getByProductId(productId: string): Promise<ProductVariant[]> {
    try {
      const res = await api.get<ApiResponse<ProductVariant[]>>(`/productvariant/get-by-product/${productId}`);
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getLowStockCount(threshold: number = 5): Promise<number> {
    try {
      const res = await api.get<ApiResponse<number>>(`/productvariant/low-stock-count`, {
        params: { threshold }
      });
      return res.data.data;
    } catch {
      return 0;
    }
  },

  async getByColorAndSize(productId: string, colorId: string, sizeId: string): Promise<ProductVariant | null> {
    try {
      const res = await api.get<ApiResponse<ProductVariant>>(`/productvariant/get-by-color-size`, {
        params: { productId, colorId, sizeId }
      });
      return res.data.data;
    } catch {
      return null;
    }
  },

  async getAvailableVariants(productId: string): Promise<ProductVariant[]> {
    try {
      const res = await api.get<ApiResponse<ProductVariant[]>>(`/productvariant/available/${productId}`);
      return res.data.data;
    } catch {
      return [];
    }
  },

  async checkStock(request: CheckStockRequest): Promise<boolean> {
    try {
      const res = await api.post<ApiResponse<boolean>>('/productvariant/check-stock', request);
      return res.data.data;
    } catch {
      return false;
    }
  },

  async create(data: ProductVariantCreateInput): Promise<ProductVariant | null> {
    try {
      const formData = new FormData();
      formData.append('ProductId', data.productId);
      formData.append('ProductColorId', data.productColorId);
      formData.append('ProductSizeId', data.productSizeId);
      if (data.basePriceKWD !== undefined) formData.append('BasePriceKWD', String(data.basePriceKWD));
      if (data.compareAtPriceKWD !== undefined) formData.append('CompareAtPriceKWD', String(data.compareAtPriceKWD));
      if (data.basePriceINR !== undefined) formData.append('BasePriceINR', String(data.basePriceINR));
      if (data.compareAtPriceINR !== undefined) formData.append('CompareAtPriceINR', String(data.compareAtPriceINR));
      if (data.stockQuantity !== undefined) formData.append('StockQuantity', String(data.stockQuantity));
      formData.append('InStock', String(data.inStock ?? true));
      formData.append('IsDefault', String(data.isDefault ?? false));
      if (data.imageFile) {
        formData.append('ImageFile', data.imageFile);
      }

      const res = await api.post<ApiResponse<ProductVariant>>("/productvariant/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch {
      return null;
    }
  },

  async update(id: string, data: ProductVariantUpdateInput): Promise<ProductVariant | null> {
    try {
      const formData = new FormData();
      if (data.productColorId) formData.append('ProductColorId', data.productColorId);
      if (data.productSizeId) formData.append('ProductSizeId', data.productSizeId);
      if (data.basePriceKWD !== undefined) formData.append('BasePriceKWD', String(data.basePriceKWD));
      if (data.compareAtPriceKWD !== undefined) formData.append('CompareAtPriceKWD', String(data.compareAtPriceKWD));
      if (data.basePriceINR !== undefined) formData.append('BasePriceINR', String(data.basePriceINR));
      if (data.compareAtPriceINR !== undefined) formData.append('CompareAtPriceINR', String(data.compareAtPriceINR));
      if (data.stockQuantity !== undefined) formData.append('StockQuantity', String(data.stockQuantity));
      if (data.inStock !== undefined) formData.append('InStock', String(data.inStock));
      if (data.isDefault !== undefined) formData.append('IsDefault', String(data.isDefault));
      if (data.imageFile) {
        formData.append('ImageFile', data.imageFile);
      }

      const res = await api.put<ApiResponse<ProductVariant>>(`/productvariant/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch {
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/productvariant/delete/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  // Helper method to create multiple variants at once
  async createBulk(variants: ProductVariantCreateInput[]): Promise<ProductVariant[]> {
    const results: ProductVariant[] = [];

    for (const variant of variants) {
      const created = await this.create(variant);
      if (created) {
        results.push(created);
      }
    }

    return results;
  },

  // Helper method to update multiple variants at once
  async updateBulk(updates: Array<{ id: string; data: ProductVariantUpdateInput }>): Promise<ProductVariant[]> {
    const results: ProductVariant[] = [];

    for (const update of updates) {
      const updated = await this.update(update.id, update.data);
      if (updated) {
        results.push(updated);
      }
    }

    return results;
  }
};