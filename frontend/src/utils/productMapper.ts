import type { ProductDto } from '@/services/api/productService';
import type { ProductItem, ProductImage, ProductColor, ProductSize, ProductFeature, ProductVariant } from '@/types/product';

export const mapProductDtoToProductItem = (dto: ProductDto): ProductItem => {
  // Map images
  const images: ProductImage[] = (dto.images || [])
    .filter(img => img.isActive)
    .map((img, index) => ({
      id: img.id,
      url: img.imageUrl || '',
      alt: { en: img.imageAlt || '', ar: img.imageAlt || '' },
      isPrimary: index === 0,
    }));

  // Map colors
  const colors: ProductColor[] = (dto.colors || [])
    .filter(c => c.isActive)
    .map(c => ({
      id: c.id,
      name: { en: c.nameEnglish || '', ar: c.nameArabic || '' },
      hex: c.hex || '#000000',
    }));

  // Map sizes
  const sizes: ProductSize[] = (dto.sizes || [])
    .filter(s => s.isActive)
    .map(s => ({
      id: s.id,
      label: s.label || '',
      stock: s.stock || 0,
    }));

  // Map features
  const features: ProductFeature[] = (dto.features || [])
    .filter(f => f.isActive)
    .map(f => ({
      id: f.id,
      iconName: f.iconName,
      label: { en: f.labelEnglish || '', ar: f.labelArabic || '' },
    }));

  // Map variants
  const variants: ProductVariant[] = (dto.variants || []).map(v => ({
    id: v.id,
    productId: v.productId,
    colorId: v.productColorId,
    sizeId: v.productSizeId,
    basePriceKWD: v.basePriceKWD,
    compareAtPriceKWD: v.compareAtPriceKWD,
    basePriceINR: v.basePriceINR,
    compareAtPriceINR: v.compareAtPriceINR,
    stockQuantity: v.stockQuantity,
    inStock: v.inStock,
    isDefault: v.isDefault,
  }));

  // Map specifications
  const specifications = (dto.specifications || [])
    .filter(s => s.isActive)
    .map(s => ({
      label: { en: s.labelEnglish || '', ar: s.labelArabic || '' },
      value: { en: s.valueEnglish || '', ar: s.valueArabic || '' },
    }));

  return {
    id: dto.id,
    slug: dto.slug || dto.id,
    brand: { en: dto.brandEnglish || '', ar: dto.brandArabic || '' },
    name: { en: dto.nameEnglish || '', ar: dto.nameArabic || '' },
    shortDescription: { en: dto.shortDescriptionEnglish || '', ar: dto.shortDescriptionArabic || '' },
    fullDescription: { en: dto.fullDescriptionEnglish || '', ar: dto.fullDescriptionArabic || '' },
    categoryId: dto.topCategoryId,
    subcategoryId: dto.middleCategoryId,
    productTypeId: dto.bottomCategoryId,
    images,
    colors,
    sizes,
    variants,
    basePriceKWD: dto.basePriceKWD || 0,
    compareAtPriceKWD: dto.compareAtPriceKWD,
    basePriceINR: dto.basePriceINR,
    compareAtPriceINR: dto.compareAtPriceINR,
    rating: dto.rating || 0,
    reviewCount: dto.reviewCount || 0,
    isNew: dto.isNew,
    isBestSeller: dto.isBestSeller,
    isFeatured: dto.isFeatured,
    isOnSale: dto.isOnSale,
    inStock: dto.inStock,
    features,
    specifications,
    shippingInfo: { en: dto.shippingInfoEnglish || '', ar: dto.shippingInfoArabic || '' },
    returnInfo: { en: dto.returnInfoEnglish || '', ar: dto.returnInfoArabic || '' },
    careInstructions: (dto.careInstructions || [])
      .filter(c => c.isActive)
      .map(c => ({ en: c.instructionEnglish || '', ar: c.instructionArabic || '' })),
    reviews: [],
    relatedProductIds: [],
  };
};

export const mapProductDtosToProductItems = (dtos: ProductDto[]): ProductItem[] => {
  return dtos.map(mapProductDtoToProductItem);
};
