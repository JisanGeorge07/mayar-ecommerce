import type { Category, Subcategory, ProductType, Product, ProductFormState } from '@/types';
import api from '@/lib/axios';



// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Backend DTOs
interface TrustBadgeDto {
  id: string;
  key?: string;
  labelEnglish?: string;
  labelArabic?: string;
  descriptionEnglish?: string;
  descriptionArabic?: string;
  iconName?: string;
}

interface TopCategoryDto {
  id: string;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  titleEnglish?: string;
  titleArabic?: string;
  badgeEnglish?: string;
  badgeArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

interface MiddleCategoryDto {
  id: string;
  topCategoryId: string;
  slug?: string;
  titleEnglish?: string;
  titleArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

interface BottomCategoryDto {
  id: string;
  topCategoryId: string;
  middleCategoryId: string;
  slug?: string;
  titleEnglish?: string;
  titleArabic?: string;
  isActive: boolean;
  displayOrder?: number;
}

interface ProductImageDto {
  id: string;
  productId: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isPrimary: boolean;
  imageFile?: File;
}

interface ProductColorDto {
  id: string;
  productId: string;
  nameEnglish?: string;
  nameArabic?: string;
  hex?: string;
  isActive: boolean;
}

interface ProductSizeDto {
  id: string;
  productId: string;
  label?: string;
  isActive: boolean;
}

interface ProductFeatureDto {
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

interface ProductSpecificationDto {
  id: string;
  productId: string;
  labelEnglish?: string;
  labelArabic?: string;
  valueEnglish?: string;
  valueArabic?: string;
  isActive: boolean;
}

interface ProductCareInstructionDto {
  id: string;
  productId: string;
  instructionEnglish?: string;
  instructionArabic?: string;
  isActive: boolean;
}

interface ProductVariantDto {
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
  // Nested objects for easier frontend consumption
  color?: ProductColorDto;
  size?: ProductSizeDto;
  imageUrl?: string;
}

interface ProductDto {
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
  isActive: boolean;
  status?: string;
  // Nested data
  images?: ProductImageDto[];
  colors?: ProductColorDto[];
  sizes?: ProductSizeDto[];
  variants?: ProductVariantDto[];
  features?: ProductFeatureDto[];
  specifications?: ProductSpecificationDto[];
  careInstructions?: ProductCareInstructionDto[];
  // Shipping & Returns
  shippingInfoEnglish?: string;
  shippingInfoArabic?: string;
  returnInfoEnglish?: string;
  returnInfoArabic?: string;
  // SEO Metadata
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

// Export ProductDto for use in CreateProductPage
export type { ProductDto, ProductImageDto, ProductColorDto, ProductSizeDto, ProductFeatureDto, ProductSpecificationDto, ProductCareInstructionDto, ProductVariantDto };

// Mapping functions
function mapTopCategoryToCategory(dto: TopCategoryDto): Category {
  return {
    id: dto.id,
    name: dto.titleEnglish || '',
    slug: dto.slug || '',
    status: dto.isActive ? 'active' : 'inactive',
    description: dto.titleArabic || '',
    display_order: dto.displayOrder || 0,
    created_at: new Date().toISOString(),
  };
}

function mapMiddleCategoryToSubcategory(dto: MiddleCategoryDto): Subcategory {
  return {
    id: dto.id,
    category_id: dto.topCategoryId,
    name: dto.titleEnglish || '',
    slug: dto.slug || '',
    status: dto.isActive ? 'active' : 'inactive',
    description: dto.titleArabic || '',
    display_order: dto.displayOrder || 0,
  };
}

function mapBottomCategoryToProductType(dto: BottomCategoryDto): ProductType {
  return {
    id: dto.id,
    subcategory_id: dto.middleCategoryId,
    name: dto.titleEnglish || '',
    slug: dto.slug || '',
    status: dto.isActive ? 'active' : 'inactive',
    description: dto.titleArabic || '',
  };
}

function mapProductDtoToProduct(dto: ProductDto): Product {
  const defaultVariantImage = dto.variants?.find(v => v.isDefault && v.imageUrl)?.imageUrl;
  const primaryImage = dto.images?.find(img => img.isPrimary && img.isActive)?.imageUrl || '';
  const firstFallbackImage = primaryImage || dto.images?.find(img => img.isActive)?.imageUrl || '';
  const finalImage = defaultVariantImage || firstFallbackImage;

  return {
    id: dto.id,
    category_id: dto.topCategoryId,
    subcategory_id: dto.middleCategoryId || '',
    product_type_id: dto.bottomCategoryId || '',
    name: dto.nameEnglish || '',
    slug: dto.slug || '',
    brand: dto.brandEnglish || '',
    sku: '',
    short_description: dto.shortDescriptionEnglish || '',
    full_description: dto.fullDescriptionEnglish || '',
    status: (dto.status as 'draft' | 'active') || 'draft',
    is_featured: dto.isFeatured || false,
    is_new: dto.isNew || false,
    is_best_seller: dto.isBestSeller || false,
    is_on_sale: dto.isOnSale || false,
    gender: 'unisex',
    base_price_kwd: dto.basePriceKWD || 0,
    base_price_inr: dto.basePriceINR || 0,
    compare_price_kwd: dto.compareAtPriceKWD || 0,
    compare_price_inr: dto.compareAtPriceINR || 0,
    stock_status: dto.inStock ? 'in_stock' : 'out_of_stock',
    stock_quantity: dto.inStock ? 1 : 0,
    low_stock_threshold: 5,
    barcode: '',
    material: '',
    fit: '',
    sleeve_type: '',
    pattern: '',
    fragrance_type: '',
    volume_ml: '',
    watch_movement: '',
    strap_type: '',
    rating: dto.rating || 0,
    review_count: dto.reviewCount || 0,
    image_url: finalImage,
    variants: dto.variants?.map(v => ({
      id: v.id,
      productId: v.productId,
      productColorId: v.productColorId,
      productSizeId: v.productSizeId,
      basePriceKWD: v.basePriceKWD,
      compareAtPriceKWD: v.compareAtPriceKWD,
      basePriceINR: v.basePriceINR,
      compareAtPriceINR: v.compareAtPriceINR,
      stockQuantity: v.stockQuantity,
      inStock: v.inStock,
      isDefault: v.isDefault,
      color: v.color ? {
        id: v.color.id,
        nameEnglish: v.color.nameEnglish || '',
        nameArabic: v.color.nameArabic || '',
        hex: v.color.hex || '',
        isActive: v.color.isActive
      } : undefined,
      size: v.size ? {
        id: v.size.id,
        label: v.size.label || '',
        isActive: v.size.isActive
      } : undefined,
      imageUrl: v.imageUrl
    })) || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
//Trust Badge Service - connects to /api/TrustBadge
export const trustBadgeService = {
  async getTrustBadges(): Promise<TrustBadgeDto[]> {
    const response = await api.get<ApiResponse<TrustBadgeDto[]>>('/TrustBadge/get-all');
    return response.data.data;
  }
};

// Category Service - connects to /api/Category/top
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<TopCategoryDto[]>>('/Category/top');
      if (response.data.success && response.data.data) {
        return response.data.data.map(mapTopCategoryToCategory);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },
  async getCategoryById(id: string): Promise<Category | undefined> {
    try {
      const response = await api.get<ApiResponse<TopCategoryDto>>(`/Category/top/${id}`);
      if (response.data.success && response.data.data) {
        return mapTopCategoryToCategory(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return undefined;
    }
  },
  async createCategory(data: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const formData = new FormData();
    formData.append('TitleEnglish', data.name);
    formData.append('Slug', data.slug);
    formData.append('IsActive', String(data.status === 'active'));
    formData.append('DisplayOrder', String(data.display_order || 0));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.post<ApiResponse<TopCategoryDto>>('/Category/top/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.data) {
      return mapTopCategoryToCategory(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create category');
  },
  async updateCategory(id: string, data: Partial<Category>): Promise<Category | undefined> {
    const formData = new FormData();
    if (data.name) formData.append('TitleEnglish', data.name);
    if (data.slug) formData.append('Slug', data.slug);
    if (data.status) formData.append('IsActive', String(data.status === 'active'));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.put<ApiResponse<TopCategoryDto>>(`/Category/top/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      return categoryService.getCategoryById(id);
    }
    return undefined;
  },
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/Category/top/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  },
};

// Subcategory Service - connects to /api/Category/middle
export const subcategoryService = {
  async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    try {
      const response = await api.get<ApiResponse<MiddleCategoryDto[]>>('/Category/middle');
      if (response.data.success && response.data.data) {
        let subcategories = response.data.data.map(mapMiddleCategoryToSubcategory);
        if (categoryId) {
          subcategories = subcategories.filter(s => s.category_id === categoryId);
        }
        return subcategories;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      return [];
    }
  },
  async getSubcategoryById(id: string): Promise<Subcategory | undefined> {
    try {
      const response = await api.get<ApiResponse<MiddleCategoryDto>>(`/Category/middle/${id}`);
      if (response.data.success && response.data.data) {
        return mapMiddleCategoryToSubcategory(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch subcategory:', error);
      return undefined;
    }
  },
  async createSubcategory(data: Omit<Subcategory, 'id'>): Promise<Subcategory> {
    const formData = new FormData();
    formData.append('TopCategoryId', data.category_id);
    formData.append('TitleEnglish', data.name);
    formData.append('Slug', data.slug);
    formData.append('IsActive', String(data.status === 'active'));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.post<ApiResponse<MiddleCategoryDto>>('/Category/middle/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.data) {
      return mapMiddleCategoryToSubcategory(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create subcategory');
  },
  async updateSubcategory(id: string, data: Partial<Subcategory>): Promise<Subcategory | undefined> {
    const formData = new FormData();
    if (data.category_id) formData.append('TopCategoryId', data.category_id);
    if (data.name) formData.append('TitleEnglish', data.name);
    if (data.slug) formData.append('Slug', data.slug);
    if (data.status) formData.append('IsActive', String(data.status === 'active'));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.put<ApiResponse<MiddleCategoryDto>>(`/Category/middle/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      return subcategoryService.getSubcategoryById(id);
    }
    return undefined;
  },
  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/Category/middle/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
      return false;
    }
  },
};

// Product Type Service - connects to /api/Category/bottom
export const productTypeService = {
  async getProductTypes(subcategoryId?: string): Promise<ProductType[]> {
    try {
      const response = await api.get<ApiResponse<BottomCategoryDto[]>>('/Category/bottom');
      if (response.data.success && response.data.data) {
        let productTypes = response.data.data.map(mapBottomCategoryToProductType);
        if (subcategoryId) {
          productTypes = productTypes.filter(p => p.subcategory_id === subcategoryId);
        }
        return productTypes;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch product types:', error);
      return [];
    }
  },
  async getProductTypeById(id: string): Promise<ProductType | undefined> {
    try {
      const response = await api.get<ApiResponse<BottomCategoryDto>>(`/Category/bottom/${id}`);
      if (response.data.success && response.data.data) {
        return mapBottomCategoryToProductType(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch product type:', error);
      return undefined;
    }
  },
  async createProductType(data: Omit<ProductType, 'id'>): Promise<ProductType> {
    const formData = new FormData();
    formData.append('MiddleCategoryId', data.subcategory_id);
    formData.append('TitleEnglish', data.name);
    formData.append('Slug', data.slug);
    formData.append('IsActive', String(data.status === 'active'));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.post<ApiResponse<BottomCategoryDto>>('/Category/bottom/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.data) {
      return mapBottomCategoryToProductType(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create product type');
  },
  async updateProductType(id: string, data: Partial<ProductType>): Promise<ProductType | undefined> {
    const formData = new FormData();
    if (data.subcategory_id) formData.append('MiddleCategoryId', data.subcategory_id);
    if (data.name) formData.append('TitleEnglish', data.name);
    if (data.slug) formData.append('Slug', data.slug);
    if (data.status) formData.append('IsActive', String(data.status === 'active'));
    if (data.description) formData.append('TitleArabic', data.description);

    const response = await api.put<ApiResponse<BottomCategoryDto>>(`/Category/bottom/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      return productTypeService.getProductTypeById(id);
    }
    return undefined;
  },
  async deleteProductType(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/Category/bottom/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete product type:', error);
      return false;
    }
  },
};

// Product Service - connects to /api/Product
export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<ProductDto[]>>('/Product/get-all');
      if (response.data.success && response.data.data) {
        return response.data.data.map(mapProductDtoToProduct);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },
  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await api.get<ApiResponse<ProductDto>>(`/Product/get/${id}`);
      if (response.data.success && response.data.data) {
        return mapProductDtoToProduct(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return undefined;
    }
  },
  // Get full product details as raw DTO for editing
  async getProductFullDetails(id: string): Promise<ProductDto | undefined> {
    try {
      const response = await api.get<ApiResponse<ProductDto>>(`/Product/get/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      return undefined;
    }
  },
  async createProduct(form: ProductFormState): Promise<Product> {
    const formData = new FormData();
    formData.append('TopCategoryId', form.basic.category_id || '');
    formData.append('MiddleCategoryId', form.basic.subcategory_id || '');
    formData.append('BottomCategoryId', form.basic.product_type_id || '');
    formData.append('NameEnglish', form.basic.nameEnglish || form.basic.name || '');
    formData.append('NameArabic', form.basic.nameArabic || '');
    formData.append('BrandEnglish', form.basic.brandEnglish || form.basic.brand || '');
    formData.append('BrandArabic', form.basic.brandArabic || '');
    formData.append('ShortDescriptionEnglish', form.basic.shortDescriptionEnglish || form.basic.short_description || '');
    formData.append('ShortDescriptionArabic', form.basic.shortDescriptionArabic || '');
    formData.append('BasePriceKWD', String(form.basic.base_price_kwd || 0));
    formData.append('BasePriceINR', String(form.basic.base_price_inr || 0));
    formData.append('CompareAtPriceKWD', String(form.basic.compare_price_kwd || 0));
    formData.append('CompareAtPriceINR', String(form.basic.compare_price_inr || 0));
    formData.append('IsNew', String(form.basic.is_new || false));
    formData.append('IsBestSeller', String(form.basic.is_best_seller || false));
    formData.append('IsFeatured', String(form.basic.is_featured || false));
    formData.append('IsOnSale', String(form.basic.is_on_sale || false));
    formData.append('InStock', String(form.basic.in_stock !== undefined ? form.basic.in_stock : true));
    formData.append('IsActive', String(form.basic.isActive !== undefined ? form.basic.isActive : form.basic.status === 'active'));
    formData.append('Status', form.basic.status || 'draft');
    formData.append('Rating', String(form.basic.rating || 0));
    formData.append('ReviewCount', String(form.basic.review_count || 0));

    // Full descriptions
    if (form.details?.descriptionEnglish) formData.append('FullDescriptionEnglish', form.details.descriptionEnglish);
    if (form.details?.descriptionArabic) formData.append('FullDescriptionArabic', form.details.descriptionArabic);
    if (form.details?.shippingInfoEnglish) formData.append('ShippingInfoEnglish', form.details.shippingInfoEnglish);
    if (form.details?.shippingInfoArabic) formData.append('ShippingInfoArabic', form.details.shippingInfoArabic);
    if (form.details?.returnInfoEnglish) formData.append('ReturnInfoEnglish', form.details.returnInfoEnglish);
    if (form.details?.returnInfoArabic) formData.append('ReturnInfoArabic', form.details.returnInfoArabic);

    // SEO Metadata
    if (form.seo?.meta_title) formData.append('MetaTitle', form.seo.meta_title);
    if (form.seo?.meta_description) formData.append('MetaDescription', form.seo.meta_description);
    if (form.seo?.meta_keywords) formData.append('MetaKeywords', form.seo.meta_keywords);
    if (form.seo?.canonical_url) formData.append('CanonicalUrl', form.seo.canonical_url);
    if (form.seo?.og_title) formData.append('OGTitle', form.seo.og_title);
    if (form.seo?.og_description) formData.append('OGDescription', form.seo.og_description);
    if (form.seo?.og_image) formData.append('OGImageUrl', form.seo.og_image);
    if (form.seo?.twitter_title) formData.append('TwitterTitle', form.seo.twitter_title);
    if (form.seo?.twitter_description) formData.append('TwitterDescription', form.seo.twitter_description);

    const response = await api.post<ApiResponse<ProductDto>>('/Product/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.data) {
      return mapProductDtoToProduct(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create product');
  },
  async updateProduct(id: string, form: Partial<ProductFormState>): Promise<Product | undefined> {
    const formData = new FormData();
    if (form.basic?.category_id) formData.append('TopCategoryId', form.basic.category_id);
    if (form.basic?.subcategory_id) formData.append('MiddleCategoryId', form.basic.subcategory_id);
    if (form.basic?.product_type_id) formData.append('BottomCategoryId', form.basic.product_type_id);
    if (form.basic?.nameEnglish || form.basic?.name) formData.append('NameEnglish', form.basic.nameEnglish || form.basic.name || '');
    if (form.basic?.nameArabic) formData.append('NameArabic', form.basic.nameArabic);
    if (form.basic?.slug) formData.append('Slug', form.basic.slug);
    if (form.basic?.brandEnglish || form.basic?.brand) formData.append('BrandEnglish', form.basic.brandEnglish || form.basic.brand || '');
    if (form.basic?.brandArabic) formData.append('BrandArabic', form.basic.brandArabic);
    if (form.basic?.shortDescriptionEnglish) formData.append('ShortDescriptionEnglish', form.basic.shortDescriptionEnglish);
    if (form.basic?.shortDescriptionArabic) formData.append('ShortDescriptionArabic', form.basic.shortDescriptionArabic);
    if (form.basic?.base_price_kwd !== undefined) formData.append('BasePriceKWD', String(form.basic.base_price_kwd));
    if (form.basic?.base_price_inr !== undefined) formData.append('BasePriceINR', String(form.basic.base_price_inr));
    if (form.basic?.compare_price_kwd !== undefined) formData.append('CompareAtPriceKWD', String(form.basic.compare_price_kwd));
    if (form.basic?.compare_price_inr !== undefined) formData.append('CompareAtPriceINR', String(form.basic.compare_price_inr));

    // Boolean toggles
    formData.append('IsNew', String(form.basic?.is_new || false));
    formData.append('IsBestSeller', String(form.basic?.is_best_seller || false));
    formData.append('IsFeatured', String(form.basic?.is_featured || false));
    formData.append('IsOnSale', String(form.basic?.is_on_sale || false));
    formData.append('InStock', String(form.basic?.in_stock !== undefined ? form.basic.in_stock : true));
    formData.append('IsActive', String(form.basic?.isActive !== undefined ? form.basic.isActive : form.basic?.status === 'active'));

    if (form.basic?.status) formData.append('Status', form.basic.status);
    if (form.basic?.rating !== undefined) formData.append('Rating', String(form.basic.rating));
    if (form.basic?.review_count !== undefined) formData.append('ReviewCount', String(form.basic.review_count));

    // Full descriptions
    if (form.details?.descriptionEnglish) formData.append('FullDescriptionEnglish', form.details.descriptionEnglish);
    if (form.details?.descriptionArabic) formData.append('FullDescriptionArabic', form.details.descriptionArabic);
    if (form.details?.shippingInfoEnglish) formData.append('ShippingInfoEnglish', form.details.shippingInfoEnglish);
    if (form.details?.shippingInfoArabic) formData.append('ShippingInfoArabic', form.details.shippingInfoArabic);
    if (form.details?.returnInfoEnglish) formData.append('ReturnInfoEnglish', form.details.returnInfoEnglish);
    if (form.details?.returnInfoArabic) formData.append('ReturnInfoArabic', form.details.returnInfoArabic);

    // SEO Metadata
    if (form.seo?.meta_title) formData.append('MetaTitle', form.seo.meta_title);
    if (form.seo?.meta_description) formData.append('MetaDescription', form.seo.meta_description);
    if (form.seo?.meta_keywords) formData.append('MetaKeywords', form.seo.meta_keywords);
    if (form.seo?.canonical_url) formData.append('CanonicalUrl', form.seo.canonical_url);
    if (form.seo?.og_title) formData.append('OGTitle', form.seo.og_title);
    if (form.seo?.og_description) formData.append('OGDescription', form.seo.og_description);
    if (form.seo?.og_image) formData.append('OGImageUrl', form.seo.og_image);
    if (form.seo?.twitter_title) formData.append('TwitterTitle', form.seo.twitter_title);
    if (form.seo?.twitter_description) formData.append('TwitterDescription', form.seo.twitter_description);

    const response = await api.put<ApiResponse<ProductDto>>(`/Product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.data) {
      return mapProductDtoToProduct(response.data.data);
    }
    return undefined;
  },
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/Product/delete/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },
};

export const mediaService = {
  async uploadProductImage(_file: File): Promise<string> {
    return URL.createObjectURL(_file);
  },
};

// Nested Entity Services for Product

// Product Color Service
export const productColorService = {
  async create(productId: string, data: { nameEnglish: string; nameArabic: string; hex: string; isActive: boolean }): Promise<ProductColorDto> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    formData.append('NameEnglish', data.nameEnglish);
    formData.append('NameArabic', data.nameArabic);
    formData.append('Hex', data.hex);
    formData.append('IsActive', String(data.isActive));

    const response = await api.post<ApiResponse<ProductColorDto>>('/ProductColor/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create color');
  },
  async update(id: string, data: Partial<{ nameEnglish: string; nameArabic: string; hex: string; isActive: boolean }>): Promise<ProductColorDto | undefined> {
    const formData = new FormData();
    if (data.nameEnglish !== undefined) formData.append('NameEnglish', data.nameEnglish);
    if (data.nameArabic !== undefined) formData.append('NameArabic', data.nameArabic);
    if (data.hex !== undefined) formData.append('Hex', data.hex);
    if (data.isActive !== undefined) formData.append('IsActive', String(data.isActive));

    const response = await api.put<ApiResponse<ProductColorDto>>(`/ProductColor/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return undefined;
  },
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/ProductColor/delete/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Product Size Service
export const productSizeService = {
  async create(productId: string, data: { label: string; isActive: boolean }): Promise<ProductSizeDto> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    formData.append('Label', data.label);
    formData.append('IsActive', String(data.isActive));

    const response = await api.post<ApiResponse<ProductSizeDto>>('/ProductSize/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create size');
  },
  async update(id: string, data: Partial<{ label: string; isActive: boolean }>): Promise<ProductSizeDto | undefined> {
    const formData = new FormData();
    if (data.label !== undefined) formData.append('Label', data.label);
    if (data.isActive !== undefined) formData.append('IsActive', String(data.isActive));

    const response = await api.put<ApiResponse<ProductSizeDto>>(`/ProductSize/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return undefined;
  },
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/ProductSize/delete/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Product Image Service
export const productImageService = {
  async create(productId: string, data: { imageFile?: File; imageAlt: string; isActive: boolean; isPrimary?: boolean }): Promise<ProductImageDto> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    if (data.imageFile) {
      formData.append('ImageFile', data.imageFile);
    }
    formData.append('ImageAlt', data.imageAlt);
    formData.append('IsActive', String(data.isActive));
    if (data.isPrimary !== undefined) {
      formData.append('IsPrimary', String(data.isPrimary));
    }

    const response = await api.post<ApiResponse<ProductImageDto>>('/ProductImage/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create image');
  },
  async update(id: string, data: Partial<{ imageFile?: File; imageAlt: string; isActive: boolean; isPrimary: boolean }>): Promise<ProductImageDto | undefined> {
    const formData = new FormData();
    if (data.imageFile !== undefined) formData.append('ImageFile', data.imageFile);
    if (data.imageAlt !== undefined) formData.append('ImageAlt', data.imageAlt);
    if (data.isActive !== undefined) formData.append('IsActive', String(data.isActive));
    if (data.isPrimary !== undefined) formData.append('IsPrimary', String(data.isPrimary));

    const response = await api.put<ApiResponse<ProductImageDto>>(`/ProductImage/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return undefined;
  },
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/ProductImage/delete/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
  async setAsPrimary(id: string): Promise<boolean> {
    try {
      const response = await api.patch<ApiResponse<object>>(`/ProductImage/set-primary/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Product Feature Service
export const productFeatureService = {
  async getByProduct(productId: string): Promise<ProductFeatureDto[]> {
    const res = await api.get(`/ProductFeature/get-by-product/${productId}`);
    return res.data.data;
  },

  async create(productId: string, trustBadgeId: string, isActive: boolean) {
    const formData = new FormData();
    formData.append("ProductId", productId);
    formData.append("TrustBadgeId", trustBadgeId);
    formData.append("IsActive", isActive.toString());

    const res = await api.post(`/ProductFeature/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async update(id: string, productId: string, trustBadgeId: string, isActive: boolean) {
    const formData = new FormData();
    formData.append("ProductId", productId);
    formData.append("TrustBadgeId", trustBadgeId);
    formData.append("IsActive", isActive.toString());

    const res = await api.put(`/ProductFeature/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  }
};

// Product Specification Service
export const productSpecificationService = {
  
  async create(productId: string, data: { labelEnglish: string; labelArabic: string; valueEnglish: string; valueArabic: string; isActive: boolean }): Promise<ProductSpecificationDto> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    formData.append('LabelEnglish', data.labelEnglish);
    formData.append('LabelArabic', data.labelArabic);
    formData.append('ValueEnglish', data.valueEnglish);
    formData.append('ValueArabic', data.valueArabic);
    formData.append('IsActive', String(data.isActive));

    const response = await api.post<ApiResponse<ProductSpecificationDto>>('/ProductSpecification/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create specification');
  },
  async update(id: string, data: Partial<{ labelEnglish: string; labelArabic: string; valueEnglish: string; valueArabic: string; isActive: boolean }>): Promise<ProductSpecificationDto | undefined> {
    const formData = new FormData();
    if (data.labelEnglish !== undefined) formData.append('LabelEnglish', data.labelEnglish);
    if (data.labelArabic !== undefined) formData.append('LabelArabic', data.labelArabic);
    if (data.valueEnglish !== undefined) formData.append('ValueEnglish', data.valueEnglish);
    if (data.valueArabic !== undefined) formData.append('ValueArabic', data.valueArabic);
    if (data.isActive !== undefined) formData.append('IsActive', String(data.isActive));

    const response = await api.put<ApiResponse<ProductSpecificationDto>>(`/ProductSpecification/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return undefined;
  },
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/ProductSpecification/delete/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Product Care Instruction Service
export const productCareInstructionService = {
  async create(productId: string, data: { instructionEnglish: string; instructionArabic: string; isActive: boolean }): Promise<ProductCareInstructionDto> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    formData.append('InstructionEnglish', data.instructionEnglish);
    formData.append('InstructionArabic', data.instructionArabic);
    formData.append('IsActive', String(data.isActive));

    const response = await api.post<ApiResponse<ProductCareInstructionDto>>('/ProductCareInstruction/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create care instruction');
  },
  async update(id: string, data: Partial<{ instructionEnglish: string; instructionArabic: string; isActive: boolean }>): Promise<ProductCareInstructionDto | undefined> {
    const formData = new FormData();
    if (data.instructionEnglish !== undefined) formData.append('InstructionEnglish', data.instructionEnglish);
    if (data.instructionArabic !== undefined) formData.append('InstructionArabic', data.instructionArabic);
    if (data.isActive !== undefined) formData.append('IsActive', String(data.isActive));

    const response = await api.put<ApiResponse<ProductCareInstructionDto>>(`/ProductCareInstruction/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return undefined;
  },
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(`/ProductCareInstruction/delete/${id}`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// Export specific services
export { productVariantService } from './productVariantService';
