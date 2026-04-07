import { useState, useCallback } from 'react';
import type { ProductFormState, ProductVariant, ProductImage, ProductReview, ProductColor, ProductSize, ProductSpecification, ProductCareInstruction, ProductFeature } from '@/types';
import { INITIAL_PRODUCT_FORM } from '@/types';
import { generateSlug } from '@/utils/slug';

export function useProductForm(initial?: Partial<ProductFormState>) {
  const [form, setForm] = useState<ProductFormState>({
    ...INITIAL_PRODUCT_FORM,
    ...initial,
  });
  const [originalForm, setOriginalForm] = useState<ProductFormState>({
    ...INITIAL_PRODUCT_FORM,
    ...initial,
  });

  // New variant creation form state
  const [newVariantData, setNewVariantData] = useState<Partial<ProductVariant>>({
    productColorId: '',
    productSizeId: '',
    stockQuantity: 0,
    basePriceKWD: undefined,
    compareAtPriceKWD: undefined,
    basePriceINR: undefined,
    compareAtPriceINR: undefined,
    inStock: true,
    isDefault: false,
  });

  const updateBasic = useCallback((field: string, value: any) => {
    setForm(prev => {
      const updated = { ...prev, basic: { ...prev.basic, [field]: value } };

      // Auto-generate slug from nameEnglish only when creating (if slug is empty)
      if (field === 'nameEnglish' && typeof value === 'string' && !prev.basic.slug) {
        updated.basic.slug = generateSlug(value);
      }

      return updated;
    });
  }, []);

  // Colors
  const addColor = useCallback((color: ProductColor) => {
    setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
  }, []);

  const removeColor = useCallback((id: string) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(c => c.id !== id) }));
  }, []);

  const updateColor = useCallback((id: string, updates: Partial<ProductColor>) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  // Sizes
  const addSize = useCallback((size: ProductSize) => {
    setForm(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
  }, []);

  const removeSize = useCallback((id: string) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter(s => s.id !== id) }));
  }, []);

  const updateSize = useCallback((id: string, updates: Partial<ProductSize>) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  // Specifications
  const addSpecification = useCallback((spec: ProductSpecification) => {
    setForm(prev => ({ ...prev, specifications: [...prev.specifications, spec] }));
  }, []);

  const removeSpecification = useCallback((id: string) => {
    setForm(prev => ({ ...prev, specifications: prev.specifications.filter(s => s.id !== id) }));
  }, []);

  const updateSpecification = useCallback((id: string, updates: Partial<ProductSpecification>) => {
    setForm(prev => ({
      ...prev,
      specifications: prev.specifications.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  // Care Instructions
  const addCareInstruction = useCallback((instruction: ProductCareInstruction) => {
    setForm(prev => ({ ...prev, careInstructions: [...prev.careInstructions, instruction] }));
  }, []);

  const removeCareInstruction = useCallback((id: string) => {
    setForm(prev => ({ ...prev, careInstructions: prev.careInstructions.filter(c => c.id !== id) }));
  }, []);

  const updateCareInstruction = useCallback((id: string, updates: Partial<ProductCareInstruction>) => {
    setForm(prev => ({
      ...prev,
      careInstructions: prev.careInstructions.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  // Product Features
  const addFeature = useCallback((feature: ProductFeature) => {
    setForm(prev => ({ ...prev, features: [...prev.features, feature] }));
  }, []);

  const removeFeature = useCallback((id: string) => {
    setForm(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
  }, []);

  const updateFeature = useCallback((id: string, updates: Partial<ProductFeature>) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  }, []);

  // Trust Badges
  const setTrustBadges = useCallback((badges: string[]) => {
    setForm(prev => ({ ...prev, trustBadges: badges }));
  }, []);

  // Variants
  const addVariant = useCallback((variant: ProductVariant) => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, variant] }));
  }, []);

  const removeVariant = useCallback((id: string) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
  }, []);

  const updateVariant = useCallback((id: string, updates: Partial<ProductVariant>) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === id ? { ...v, ...updates } : v),
    }));
  }, []);

  // Handle adding a new variant from the creation form
  const handleAddVariant = useCallback(() => {
    if (!newVariantData.productColorId || !newVariantData.productSizeId) return;

    // Check if this combination already exists
    const existingVariant = form.variants.find(
      v => v.productColorId === newVariantData.productColorId &&
        v.productSizeId === newVariantData.productSizeId
    );

    if (existingVariant) {
      alert('A variant with this color and size combination already exists.');
      return;
    }

    // If this is set as default, remove default from other variants
    if (newVariantData.isDefault) {
      setForm(prev => ({
        ...prev,
        variants: prev.variants.map(v => ({ ...v, isDefault: false }))
      }));
    }

    // Create the new variant
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      productId: form.basic.id || '',
      productColorId: newVariantData.productColorId!,
      productSizeId: newVariantData.productSizeId!,
      basePriceKWD: newVariantData.basePriceKWD,
      compareAtPriceKWD: newVariantData.compareAtPriceKWD,
      basePriceINR: newVariantData.basePriceINR,
      compareAtPriceINR: newVariantData.compareAtPriceINR,
      stockQuantity: newVariantData.stockQuantity || 0,
      inStock: (newVariantData.stockQuantity || 0) > 0,
      isDefault: newVariantData.isDefault || false,
    };

    // Add the variant
    setForm(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));

    // Reset the form
    setNewVariantData({
      productColorId: '',
      productSizeId: '',
      stockQuantity: 0,
      basePriceKWD: undefined,
      compareAtPriceKWD: undefined,
      basePriceINR: undefined,
      compareAtPriceINR: undefined,
      inStock: true,
      isDefault: false,
    });
  }, [newVariantData, form.variants, form.basic.id]);

  // Images
  const addImage = useCallback((image: ProductImage) => {
    setForm(prev => ({ ...prev, images: [...prev.images, image] }));
  }, []);

  const removeImage = useCallback((id: string) => {
    setForm(prev => ({ ...prev, images: prev.images.filter(i => i.id !== id) }));
  }, []);

  const updateImage = useCallback((id: string, updates: Partial<ProductImage>) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map(i => i.id === id ? { ...i, ...updates } : i),
    }));
  }, []);

  const updateDetails = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));
  }, []);

  const updateSeo = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
  }, []);

  const addReview = useCallback((review: ProductReview) => {
    setForm(prev => ({ ...prev, reviews: [...prev.reviews, review] }));
  }, []);

  const removeReview = useCallback((id: string) => {
    setForm(prev => ({ ...prev, reviews: prev.reviews.filter(r => r.id !== id) }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({ ...INITIAL_PRODUCT_FORM });
    setOriginalForm({ ...INITIAL_PRODUCT_FORM });
  }, []);

  const setFormWithTracking = useCallback((newForm: ProductFormState) => {
    setForm(newForm);
    setOriginalForm(newForm);
  }, []);

  return {
    form,
    setForm,
    originalForm,
    setFormWithTracking,
    updateBasic,
    addColor,
    removeColor,
    updateColor,
    addSize,
    removeSize,
    updateSize,
    addSpecification,
    removeSpecification,
    updateSpecification,
    addCareInstruction,
    removeCareInstruction,
    updateCareInstruction,
    addFeature,
    removeFeature,
    updateFeature,
    setTrustBadges,
    addVariant,
    removeVariant,
    updateVariant,
    newVariantData,
    setNewVariantData,
    handleAddVariant,
    addImage,
    removeImage,
    updateImage,
    updateDetails,
    updateSeo,
    addReview,
    removeReview,
    resetForm,
  };
}
