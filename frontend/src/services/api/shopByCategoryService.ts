import api from "@/lib/axios";

// API response type from backend
export interface ShopByCategoryDto {
    id: string;
    internalName: string;
    titleEnglish: string;
    titleArabic: string | null;
    imageUrl: string | null;
    altText: string | null;
    linkType: "category" | "subcategory" | "product_type" | "product" | "custom_url";
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

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export const shopByCategoryApi = {
    getActive: () =>
        api.get<ApiResponse<ShopByCategoryDto[]>>("/ShopByCategory/get-active"),
};
