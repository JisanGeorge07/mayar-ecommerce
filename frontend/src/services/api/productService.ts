import api from "@/lib/axios";

// Types
export interface ProductDto {
  id: string;
  topCategoryId: string;
  middleCategoryId?: string;
  bottomCategoryId?: string;
  slug?: string;
  brandEnglish?: string;
  brandArabic?: string;
  nameEnglish?: string;
  nameArabic?: string;
  shortDescriptionEnglish?: string;
  shortDescriptionArabic?: string;
  fullDescriptionEnglish?: string;
  fullDescriptionArabic?: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  rating?: number;
  reviewCount?: number;
  isNew: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  shippingInfoEnglish?: string;
  shippingInfoArabic?: string;
  returnInfoEnglish?: string;
  returnInfoArabic?: string;
  images: ProductImageDto[];
  colors: ProductColorDto[];
  sizes: ProductSizeDto[];
  variants: ProductVariantDto[];
  features: ProductFeatureDto[];
  specifications: ProductSpecificationDto[];
  careInstructions: ProductCareInstructionDto[];
  isActive: boolean;
  status?: string;
  metaTitle?: string;
  canonicalUrl?: string;
  metaKeywords?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export interface ProductColorDto {
  id: string;
  productId: string;
  nameEnglish?: string;
  nameArabic?: string;
  hex?: string;
  isActive: boolean;
}

export interface ProductSizeDto {
  id: string;
  productId: string;
  label?: string;
  stock?: number;
  isActive: boolean;
}

export interface ProductImageDto {
  id: string;
  productId: string;
  imageFile?: File;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
}

export interface ProductFeatureDto {
  id: string;
  productId: string;
  trustBadgeId: string;
  isActive: boolean;
  // Trust badge details (populated from backend)
  key?: string;
  labelEnglish?: string;
  labelArabic?: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  iconName?: string;
}

export interface ProductSpecificationDto {
  id: string;
  productId: string;
  labelEnglish?: string;
  labelArabic?: string;
  valueEnglish?: string;
  valueArabic?: string;
  isActive: boolean;
}

export interface ProductCareInstructionDto {
  id: string;
  productId: string;
  instructionEnglish?: string;
  instructionArabic?: string;
  isActive: boolean;
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  productColorId: string;
  productSizeId: string;
  basePriceKWD?: number;
  compareAtPriceKWD?: number;
  basePriceINR?: number;
  compareAtPriceINR?: number;
  stockQuantity?: number;
  inStock: boolean;
  isDefault: boolean;
  imageUrl?: string;
  color?: ProductColorDto;
  size?: ProductSizeDto;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Filter types
export interface ProductFilterRequest {
  topCategoryId?: string;
  middleCategoryId?: string;
  bottomCategoryId?: string;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  currency?: string; // KWD or INR
  isOnSale?: boolean;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  status?: string; // active, draft
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ShopCategoryDto {
  id: string;
  slug: string;
  name: { en?: string; ar?: string };
  productCount: number;
}

export interface ShopColorDto {
  id: string;
  name: { en?: string; ar?: string };
  hex: string;
}

export interface ShopDataDto {
  categories: ShopCategoryDto[];
  brands: string[];
  colors: ShopColorDto[];
  minPrice: number;
  maxPrice: number;
  minPriceKWD: number;
  maxPriceKWD: number;
  minPriceINR: number;
  maxPriceINR: number;
}

// Product API
export const productApi = {
  getAll: () => api.get<ApiResponse<ProductDto[]>>("/Product/get-all"),
  getById: (id: string) => api.get<ApiResponse<ProductDto>>(`/Product/get/${id}`),
  getByIds: (ids: string[]) => api.post<ApiResponse<ProductDto[]>>("/Product/get-by-ids", ids),
  getBySlug: (slug: string) => api.get<ApiResponse<ProductDto>>(`/Product/get-by-slug/${slug}`),
  getBestSellers: () => api.get<ApiResponse<ProductDto[]>>("/Product/best-sellers"),
  getNewArrivals: () => api.get<ApiResponse<ProductDto[]>>("/Product/new-arrivals"),
  getFeatured: () => api.get<ApiResponse<ProductDto[]>>("/Product/featured"),
  getOnSale: () => api.get<ApiResponse<ProductDto[]>>("/Product/on-sale"),
  getFiltered: (filter: ProductFilterRequest) => api.post<ApiResponse<PaginatedResult<ProductDto>>>("/Product/filter", filter),
  getShopData: () => api.get<ApiResponse<ShopDataDto>>("/Product/shop-data"),
  create: (data: FormData) => api.post<ApiResponse<ProductDto>>("/Product/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductDto>>(`/Product/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/Product/delete/${id}`),
};

// Product Color API
export const productColorApi = {
  getAll: () => api.get<ApiResponse<ProductColorDto[]>>("/ProductColor/get-all"),
  getById: (id: string) => api.get<ApiResponse<ProductColorDto>>(`/ProductColor/get/${id}`),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductColorDto[]>>(`/ProductColor/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductColorDto>>("/ProductColor/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductColorDto>>(`/ProductColor/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductColor/delete/${id}`),
};

// Product Size API
export const productSizeApi = {
  getAll: () => api.get<ApiResponse<ProductSizeDto[]>>("/ProductSize/get-all"),
  getById: (id: string) => api.get<ApiResponse<ProductSizeDto>>(`/ProductSize/get/${id}`),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductSizeDto[]>>(`/ProductSize/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductSizeDto>>("/ProductSize/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductSizeDto>>(`/ProductSize/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductSize/delete/${id}`),
};

// Product Image API
export const productImageApi = {
  getAll: () => api.get<ApiResponse<ProductImageDto[]>>("/ProductImage/get-all"),
  getById: (id: string) => api.get<ApiResponse<ProductImageDto>>(`/ProductImage/get/${id}`),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductImageDto[]>>(`/ProductImage/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductImageDto>>("/ProductImage/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductImageDto>>(`/ProductImage/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductImage/delete/${id}`),
};

// Product Feature API
export const productFeatureApi = {
  getAll: () => api.get<ApiResponse<ProductFeatureDto[]>>("/ProductFeature/get-all"),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductFeatureDto[]>>(`/ProductFeature/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductFeatureDto>>("/ProductFeature/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductFeatureDto>>(`/ProductFeature/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductFeature/delete/${id}`),
};

// Product Specification API
export const productSpecificationApi = {
  getAll: () => api.get<ApiResponse<ProductSpecificationDto[]>>("/ProductSpecification/get-all"),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductSpecificationDto[]>>(`/ProductSpecification/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductSpecificationDto>>("/ProductSpecification/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductSpecificationDto>>(`/ProductSpecification/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductSpecification/delete/${id}`),
};

// Product Care Instruction API
export const productCareInstructionApi = {
  getAll: () => api.get<ApiResponse<ProductCareInstructionDto[]>>("/ProductCareInstruction/get-all"),
  getByProductId: (productId: string) => api.get<ApiResponse<ProductCareInstructionDto[]>>(`/ProductCareInstruction/get-by-product/${productId}`),
  create: (data: FormData) => api.post<ApiResponse<ProductCareInstructionDto>>("/ProductCareInstruction/create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id: string, data: FormData) => api.put<ApiResponse<ProductCareInstructionDto>>(`/ProductCareInstruction/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id: string) => api.delete<ApiResponse<object>>(`/ProductCareInstruction/delete/${id}`),
};
