import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import HierarchyStepper from '@/components/product/HierarchyStepper';
import ProductForm from '@/components/product/ProductForm';
import ProductPreview from '@/components/product/ProductPreview';
import { useHierarchy } from '@/hooks/useHierarchy';
import { useProductForm } from '@/hooks/useProductForm';
import {
  productService,
  productColorService,
  productSizeService,
  productImageService,
  productFeatureService,
  productSpecificationService,
  productCareInstructionService,
  productVariantService
} from '@/services';
import { toast } from 'sonner';
import type { ProductFormState } from '@/types';
import { INITIAL_PRODUCT_FORM } from '@/types';

interface CreateProductPageProps {
  viewOnly?: boolean;
}

export default function CreateProductPage({ viewOnly = false }: CreateProductPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hierarchy = useHierarchy();
  const productForm = useProductForm();
  const [showPreview, setShowPreview] = useState(viewOnly);
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(!!id);
  const [isEditing, setIsEditing] = useState(false);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load existing product when editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    try {
      // Get full product details including nested data
      const productDto = await productService.getProductFullDetails(productId);
      if (productDto) {
        // Build the complete form state at once
        const newFormState: ProductFormState = {
          ...INITIAL_PRODUCT_FORM,
          basic: {
            ...INITIAL_PRODUCT_FORM.basic,
            category_id: productDto.topCategoryId,
            subcategory_id: productDto.middleCategoryId || '',
            product_type_id: productDto.bottomCategoryId || '',
            name: productDto.nameEnglish || '',
            nameEnglish: productDto.nameEnglish || '',
            nameArabic: productDto.nameArabic || '',
            brand: productDto.brandEnglish || '',
            brandEnglish: productDto.brandEnglish || '',
            brandArabic: productDto.brandArabic || '',
            short_description: productDto.shortDescriptionEnglish || '',
            shortDescriptionEnglish: productDto.shortDescriptionEnglish || '',
            shortDescriptionArabic: productDto.shortDescriptionArabic || '',
            full_description: productDto.fullDescriptionEnglish || '',
            slug: productDto.slug || '',
            status: (productDto.status as 'draft' | 'active') || 'draft',
            isActive: productDto.isActive,
            is_featured: productDto.isFeatured || false,
            is_new: productDto.isNew || false,
            is_best_seller: productDto.isBestSeller || false,
            is_on_sale: productDto.isOnSale || false,
            in_stock: productDto.inStock,
            stock_status: productDto.inStock ? 'in_stock' : 'out_of_stock',
            base_price_kwd: productDto.basePriceKWD || 0,
            base_price_inr: productDto.basePriceINR || 0,
            compare_price_kwd: productDto.compareAtPriceKWD || 0,
            compare_price_inr: productDto.compareAtPriceINR || 0,
            rating: productDto.rating || 0,
            review_count: productDto.reviewCount || 0,
          },
          images: (productDto.images || []).map((img, index) => ({
            id: img.id,
            product_id: img.productId,
            url: img.imageUrl || '',
            alt_text: img.imageAlt || '',
            sort_order: index,
            is_primary: img.isPrimary,
            isActive: img.isActive,
          })),
          colors: (productDto.colors || []).map(color => ({
            id: color.id,
            nameEnglish: color.nameEnglish || '',
            nameArabic: color.nameArabic || '',
            hex: color.hex || '#000000',
            isActive: color.isActive,
          })),
          sizes: (productDto.sizes || []).map(size => ({
            id: size.id,
            label: size.label || '',
            isActive: size.isActive,
          })),
          features: (productDto.features || []).map(feature => ({
            id: feature.id,
            productId: feature.productId,
            trustBadgeId: feature.trustBadgeId,
            isActive: feature.isActive,
            labelEnglish: feature.labelEnglish,
            labelArabic: feature.labelArabic,
            descriptionEnglish: feature.descriptionEnglish,
            descriptionArabic: feature.descriptionArabic,
            iconName: feature.iconName,
          })),
          specifications: (productDto.specifications || []).map(spec => ({
            id: spec.id,
            labelEnglish: spec.labelEnglish || '',
            labelArabic: spec.labelArabic || '',
            valueEnglish: spec.valueEnglish || '',
            valueArabic: spec.valueArabic || '',
            isActive: spec.isActive,
          })),
          careInstructions: (productDto.careInstructions || []).map(care => ({
            id: care.id,
            instructionEnglish: care.instructionEnglish || '',
            instructionArabic: care.instructionArabic || '',
            isActive: care.isActive,
          })),
          details: {
            descriptionEnglish: productDto.fullDescriptionEnglish || '',
            descriptionArabic: productDto.fullDescriptionArabic || '',
            shippingInfoEnglish: productDto.shippingInfoEnglish || '',
            shippingInfoArabic: productDto.shippingInfoArabic || '',
            returnInfoEnglish: productDto.returnInfoEnglish || '',
            returnInfoArabic: productDto.returnInfoArabic || '',
          },
          seo: {
            meta_title: productDto.metaTitle || '',
            meta_description: productDto.metaDescription || '',
            meta_keywords: productDto.metaKeywords || '',
            canonical_url: productDto.canonicalUrl || '',
            og_title: productDto.ogTitle || '',
            og_description: productDto.ogDescription || '',
            og_image: productDto.ogImageUrl || '',
            twitter_title: productDto.twitterTitle || '',
            twitter_description: productDto.twitterDescription || '',
          },
          variants: (productDto.variants || []).map(variant => ({
            id: variant.id,
            productId: variant.productId,
            productColorId: variant.productColorId,
            productSizeId: variant.productSizeId,
            basePriceKWD: variant.basePriceKWD || 0,
            compareAtPriceKWD: variant.compareAtPriceKWD || 0,
            basePriceINR: variant.basePriceINR || 0,
            compareAtPriceINR: variant.compareAtPriceINR || 0,
            stockQuantity: variant.stockQuantity || 0,
            inStock: variant.inStock ?? true,
            isDefault: variant.isDefault ?? false,
            imageUrl: variant.imageUrl || '',
          })),
          trustBadges: [], // Will be loaded separately below
          reviews: [],
          relatedProducts: [],
        };

        // ✅ Load active trust badges
        if (productDto.features) {
          const activeBadges = productDto.features
            .filter(f => f.isActive)
            .map(f => f.trustBadgeId);

          newFormState.trustBadges = activeBadges;
        }
        productForm.setFormWithTracking(newFormState);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  // Re-select hierarchy when categories are loaded
  useEffect(() => {
    if (isEditing && hierarchy.categories.length > 0 && productForm.form.basic.category_id) {
      const cat = hierarchy.categories.find(c => c.id === productForm.form.basic.category_id);
      if (cat && !hierarchy.selectedCategory) {
        hierarchy.selectCategory(cat);
      }
    }
  }, [hierarchy.categories, isEditing, productForm.form.basic.category_id]);

  // Select subcategory when subcategories are loaded
  useEffect(() => {
    if (isEditing && hierarchy.subcategories.length > 0 && productForm.form.basic.subcategory_id) {
      const sub = hierarchy.subcategories.find(s => s.id === productForm.form.basic.subcategory_id);
      if (sub && !hierarchy.selectedSubcategory) {
        hierarchy.selectSubcategory(sub);
      }
    }
  }, [hierarchy.subcategories, isEditing, productForm.form.basic.subcategory_id]);

  // Select product type when product types are loaded
  useEffect(() => {
    if (isEditing && hierarchy.productTypes.length > 0 && productForm.form.basic.product_type_id) {
      const pt = hierarchy.productTypes.find(p => p.id === productForm.form.basic.product_type_id);
      if (pt && !hierarchy.selectedProductType) {
        hierarchy.selectProductType(pt);
      }
    }
  }, [hierarchy.productTypes, isEditing, productForm.form.basic.product_type_id]);

  // Helper function to sync nested entities
  const syncNestedEntities = async (productId: string) => {
    try {
      // Maps from local UUIDs to server-generated IDs
      const colorIdMap = new Map<string, string>();
      const sizeIdMap = new Map<string, string>();

      // Sync Colors and build ID mapping
      const originalColorIds = new Set(productForm.originalForm.colors.map(c => c.id));
      const currentColorIds = new Set(productForm.form.colors.map(c => c.id));

      // Delete removed colors
      for (const originalColor of productForm.originalForm.colors) {
        if (!currentColorIds.has(originalColor.id)) {
          await productColorService.delete(originalColor.id);
        }
      }

      // Create new colors and update existing ones
      for (const color of productForm.form.colors) {
        if (!originalColorIds.has(color.id)) {
          // New color - create it and store the mapping
          const created = await productColorService.create(productId, {
            nameEnglish: color.nameEnglish,
            nameArabic: color.nameArabic,
            hex: color.hex,
            isActive: color.isActive,
          });
          if (created) {
            colorIdMap.set(color.id, created.id);
          }
        } else {
          // Existing color - ID stays the same
          colorIdMap.set(color.id, color.id);
          // Check if it changed
          const original = productForm.originalForm.colors.find(c => c.id === color.id);
          if (original && (
            original.nameEnglish !== color.nameEnglish ||
            original.nameArabic !== color.nameArabic ||
            original.hex !== color.hex ||
            original.isActive !== color.isActive
          )) {
            await productColorService.update(color.id, {
              nameEnglish: color.nameEnglish,
              nameArabic: color.nameArabic,
              hex: color.hex,
              isActive: color.isActive,
            });
          }
        }
      }

      // Sync Sizes and build ID mapping
      const originalSizeIds = new Set(productForm.originalForm.sizes.map(s => s.id));
      const currentSizeIds = new Set(productForm.form.sizes.map(s => s.id));

      for (const originalSize of productForm.originalForm.sizes) {
        if (!currentSizeIds.has(originalSize.id)) {
          await productSizeService.delete(originalSize.id);
        }
      }

      for (const size of productForm.form.sizes) {
        if (!originalSizeIds.has(size.id)) {
          // New size - create it and store the mapping
          const created = await productSizeService.create(productId, {
            label: size.label,
            isActive: size.isActive,
          });
          if (created) {
            sizeIdMap.set(size.id, created.id);
          }
        } else {
          // Existing size - ID stays the same
          sizeIdMap.set(size.id, size.id);
          const original = productForm.originalForm.sizes.find(s => s.id === size.id);
          if (original && (
            original.label !== size.label ||
            original.isActive !== size.isActive
          )) {
            await productSizeService.update(size.id, {
              label: size.label,
              isActive: size.isActive,
            });
          }
        }
      }

      // Sync Variants (must happen after colors and sizes to use new IDs)
      const originalVariantIds = new Set(productForm.originalForm.variants.map(v => v.id));
      const currentVariantIds = new Set(productForm.form.variants.map(v => v.id));

      // Delete removed variants
      for (const originalVariant of productForm.originalForm.variants) {
        if (!currentVariantIds.has(originalVariant.id)) {
          await productVariantService.delete(originalVariant.id);
        }
      }

      // Create new variants and update existing ones
      for (const variant of productForm.form.variants) {
        // Map the color and size IDs to their server IDs
        const serverColorId = colorIdMap.get(variant.productColorId) || variant.productColorId;
        const serverSizeId = sizeIdMap.get(variant.productSizeId) || variant.productSizeId;

        if (!originalVariantIds.has(variant.id)) {
          // New variant - create it
          await productVariantService.create({
            productId: productId,
            productColorId: serverColorId,
            productSizeId: serverSizeId,
            basePriceKWD: variant.basePriceKWD,
            compareAtPriceKWD: variant.compareAtPriceKWD,
            basePriceINR: variant.basePriceINR,
            compareAtPriceINR: variant.compareAtPriceINR,
            stockQuantity: variant.stockQuantity,
            inStock: variant.inStock,
            isDefault: variant.isDefault,
            imageFile: variant.imageFile,
          });
        } else {
          // Existing variant - check if it changed
          const original = productForm.originalForm.variants.find(v => v.id === variant.id);
          if (original && (
            original.productColorId !== variant.productColorId ||
            original.productSizeId !== variant.productSizeId ||
            original.basePriceKWD !== variant.basePriceKWD ||
            original.compareAtPriceKWD !== variant.compareAtPriceKWD ||
            original.basePriceINR !== variant.basePriceINR ||
            original.compareAtPriceINR !== variant.compareAtPriceINR ||
            original.stockQuantity !== variant.stockQuantity ||
            original.inStock !== variant.inStock ||
            original.isDefault !== variant.isDefault ||
            original.imageFile !== variant.imageFile
          )) {
            await productVariantService.update(variant.id, {
              productColorId: serverColorId,
              productSizeId: serverSizeId,
              basePriceKWD: variant.basePriceKWD,
              compareAtPriceKWD: variant.compareAtPriceKWD,
              basePriceINR: variant.basePriceINR,
              compareAtPriceINR: variant.compareAtPriceINR,
              stockQuantity: variant.stockQuantity,
              inStock: variant.inStock,
              isDefault: variant.isDefault,
              imageFile: variant.imageFile,
              imageUrl: variant.imageFile ? undefined : variant.imageUrl,
            });
          }
        }
      }

      // Sync Images
      const originalImageIds = new Set(productForm.originalForm.images.map(i => i.id));
      const currentImageIds = new Set(productForm.form.images.map(i => i.id));

      for (const originalImage of productForm.originalForm.images) {
        if (!currentImageIds.has(originalImage.id)) {
          await productImageService.delete(originalImage.id);
        }
      }

      for (const image of productForm.form.images) {
        if (!originalImageIds.has(image.id)) {
          await productImageService.create(productId, {
            imageFile: image.file,
            imageAlt: image.alt_text,
            isActive: image.isActive,
            isPrimary: image.is_primary,
          });
        } else {
          const original = productForm.originalForm.images.find(i => i.id === image.id);
          if (original && (
            original.alt_text !== image.alt_text ||
            original.isActive !== image.isActive ||
            original.is_primary !== image.is_primary
          )) {
            await productImageService.update(image.id, {
              imageFile: image.file,
              imageAlt: image.alt_text,
              isActive: image.isActive,
              isPrimary: image.is_primary,
            });
          }
        }
      }

      // ✅ NEW: Sync Trust Badges (Product Features)

      const existingFeatures = await productFeatureService.getByProduct(productId);

      // Map: trustBadgeId → feature
      const existingMap = new Map(
        existingFeatures.map((f: any) => [f.trustBadgeId, f])
      );

      // ✅ Checked (Active)
      for (const badgeId of productForm.form.trustBadges) {
        if (existingMap.has(badgeId)) {
          const f = existingMap.get(badgeId);

          await productFeatureService.update(
            f.id,
            productId,
            badgeId,
            true
          );
        } else {
          await productFeatureService.create(
            productId,
            badgeId,
            true
          );
        }
      }

      // ❌ Unchecked → set inactive
      for (const f of existingFeatures) {
        if (!productForm.form.trustBadges.includes(f.trustBadgeId)) {
          await productFeatureService.update(
            f.id,
            productId,
            f.trustBadgeId,
            false
          );
        }
      }

      // Sync Specifications
      const originalSpecIds = new Set(productForm.originalForm.specifications.map(s => s.id));
      const currentSpecIds = new Set(productForm.form.specifications.map(s => s.id));

      for (const originalSpec of productForm.originalForm.specifications) {
        if (!currentSpecIds.has(originalSpec.id)) {
          await productSpecificationService.delete(originalSpec.id);
        }
      }

      for (const spec of productForm.form.specifications) {
        if (!originalSpecIds.has(spec.id)) {
          await productSpecificationService.create(productId, {
            labelEnglish: spec.labelEnglish,
            labelArabic: spec.labelArabic,
            valueEnglish: spec.valueEnglish,
            valueArabic: spec.valueArabic,
            isActive: spec.isActive,
          });
        } else {
          const original = productForm.originalForm.specifications.find(s => s.id === spec.id);
          if (original && (
            original.labelEnglish !== spec.labelEnglish ||
            original.labelArabic !== spec.labelArabic ||
            original.valueEnglish !== spec.valueEnglish ||
            original.valueArabic !== spec.valueArabic ||
            original.isActive !== spec.isActive
          )) {
            await productSpecificationService.update(spec.id, {
              labelEnglish: spec.labelEnglish,
              labelArabic: spec.labelArabic,
              valueEnglish: spec.valueEnglish,
              valueArabic: spec.valueArabic,
              isActive: spec.isActive,
            });
          }
        }
      }

      // Sync Care Instructions
      const originalCareIds = new Set(productForm.originalForm.careInstructions.map(c => c.id));
      const currentCareIds = new Set(productForm.form.careInstructions.map(c => c.id));

      for (const originalCare of productForm.originalForm.careInstructions) {
        if (!currentCareIds.has(originalCare.id)) {
          await productCareInstructionService.delete(originalCare.id);
        }
      }

      for (const care of productForm.form.careInstructions) {
        if (!originalCareIds.has(care.id)) {
          await productCareInstructionService.create(productId, {
            instructionEnglish: care.instructionEnglish,
            instructionArabic: care.instructionArabic,
            isActive: care.isActive,
          });
        } else {
          const original = productForm.originalForm.careInstructions.find(c => c.id === care.id);
          if (original && (
            original.instructionEnglish !== care.instructionEnglish ||
            original.instructionArabic !== care.instructionArabic ||
            original.isActive !== care.isActive
          )) {
            await productCareInstructionService.update(care.id, {
              instructionEnglish: care.instructionEnglish,
              instructionArabic: care.instructionArabic,
              isActive: care.isActive,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync nested entities:', error);
      throw error;
    }
  };

  const handleSaveDraft = async () => {
    if (isSavingDraft || isPublishing) return;
    setIsSavingDraft(true);
    // Build the updated form directly (don't rely on async state)
    const updatedForm: ProductFormState = {
      ...productForm.form,
      basic: {
        ...productForm.form.basic,
        status: 'draft',
        category_id: hierarchy.selectedCategory?.id || '',
        subcategory_id: hierarchy.selectedSubcategory?.id || '',
        product_type_id: hierarchy.selectedProductType?.id || '',
      },
    };

    try {
      if (isEditing && id) {
        await productService.updateProduct(id, updatedForm);
        await syncNestedEntities(id);
        // Reload product to get updated state
        await loadProduct(id);
        toast.success('Draft saved successfully');
      } else {
        const newProduct = await productService.createProduct(updatedForm);
        // Create nested entities for the new product
        await syncNestedEntities(newProduct.id);
        toast.success('Draft saved successfully');
        navigate('/products');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (isSavingDraft || isPublishing) return;
    setIsPublishing(true);
    // Build the updated form directly (don't rely on async state)
    const updatedForm: ProductFormState = {
      ...productForm.form,
      basic: {
        ...productForm.form.basic,
        status: 'active',
        isActive: true,
        category_id: hierarchy.selectedCategory?.id || '',
        subcategory_id: hierarchy.selectedSubcategory?.id || '',
        product_type_id: hierarchy.selectedProductType?.id || '',
      },
    };

    try {
      if (isEditing && id) {
        await productService.updateProduct(id, updatedForm);
        await syncNestedEntities(id);
        // Reload product to get updated state
        await loadProduct(id);
        toast.success('Product published successfully');
      } else {
        const newProduct = await productService.createProduct(updatedForm);
        // Create nested entities for the new product
        await syncNestedEntities(newProduct.id);
        toast.success('Product published successfully');
      }
      navigate('/products');
    } catch (error) {
      console.error('Failed to publish product:', error);
      toast.error('Failed to publish product');
    } finally {
      setIsPublishing(false);
    }
  };

  const pageTitle = viewOnly ? 'View Product' : isEditing ? 'Edit Product' : 'Create Product';
  const pageDescription = viewOnly
    ? 'Viewing product details'
    : isEditing
      ? 'Update product information'
      : 'Follow the steps to create a new product';

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {!viewOnly && (
          <>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
            </div>

            <HierarchyStepper
              categories={hierarchy.categories}
              subcategories={hierarchy.subcategories}
              productTypes={hierarchy.productTypes}
              selectedCategory={hierarchy.selectedCategory}
              selectedSubcategory={hierarchy.selectedSubcategory}
              selectedProductType={hierarchy.selectedProductType}
              onSelectCategory={hierarchy.selectCategory}
              onSelectSubcategory={hierarchy.selectSubcategory}
              onSelectProductType={hierarchy.selectProductType}
              currentFormStep={formStep}
              onReset={() => {
                hierarchy.resetHierarchy();
                productForm.resetForm();
                setShowPreview(false);
                setFormStep(0);
              }}
            />
          </>
        )}

        {hierarchy.isComplete && !showPreview && (
          <ProductForm
            form={productForm.form}
            updateBasic={viewOnly ? () => { } : productForm.updateBasic}
            isEditing={isEditing}
            addColor={viewOnly ? () => { } : productForm.addColor}
            removeColor={viewOnly ? () => { } : productForm.removeColor}
            updateColor={viewOnly ? () => { } : productForm.updateColor}
            addSize={viewOnly ? () => { } : productForm.addSize}
            removeSize={viewOnly ? () => { } : productForm.removeSize}
            updateSize={viewOnly ? () => { } : productForm.updateSize}
            addSpecification={viewOnly ? () => { } : productForm.addSpecification}
            removeSpecification={viewOnly ? () => { } : productForm.removeSpecification}
            updateSpecification={viewOnly ? () => { } : productForm.updateSpecification}
            addCareInstruction={viewOnly ? () => { } : productForm.addCareInstruction}
            removeCareInstruction={viewOnly ? () => { } : productForm.removeCareInstruction}
            updateCareInstruction={viewOnly ? () => { } : productForm.updateCareInstruction}
            addFeature={viewOnly ? () => { } : productForm.addFeature}
            removeFeature={viewOnly ? () => { } : productForm.removeFeature}
            updateFeature={viewOnly ? () => { } : productForm.updateFeature}
            setTrustBadges={viewOnly ? () => { } : productForm.setTrustBadges}
            addVariant={viewOnly ? () => { } : productForm.addVariant}
            removeVariant={viewOnly ? () => { } : productForm.removeVariant}
            updateVariant={viewOnly ? () => { } : productForm.updateVariant}
            newVariantData={productForm.newVariantData}
            setNewVariantData={viewOnly ? () => { } : productForm.setNewVariantData}
            handleAddVariant={viewOnly ? () => { } : productForm.handleAddVariant}
            addImage={viewOnly ? () => { } : productForm.addImage}
            removeImage={viewOnly ? () => { } : productForm.removeImage}
            updateImage={viewOnly ? () => { } : productForm.updateImage}
            updateDetails={viewOnly ? () => { } : productForm.updateDetails}
            updateSeo={viewOnly ? () => { } : productForm.updateSeo}
            addReview={viewOnly ? () => { } : productForm.addReview}
            removeReview={viewOnly ? () => { } : productForm.removeReview}
            onSaveDraft={viewOnly ? undefined : handleSaveDraft}
            onPublish={viewOnly ? undefined : handlePublish}
            onPreview={() => setShowPreview(true)}
            categoryName={hierarchy.selectedCategory?.titleEnglish || ''}
            subcategoryName={hierarchy.selectedSubcategory?.titleEnglish || ''}
            productTypeName={hierarchy.selectedProductType?.titleEnglish || ''}
            viewOnly={viewOnly}
            isSavingDraft={isSavingDraft}
            isPublishing={isPublishing}
          />
        )}

        {hierarchy.isComplete && showPreview && (
          <ProductPreview
            form={productForm.form}
            categoryName={hierarchy.selectedCategory?.titleEnglish || ''}
            subcategoryName={hierarchy.selectedSubcategory?.titleEnglish || ''}
            productTypeName={hierarchy.selectedProductType?.titleEnglish || ''}
            onClose={() => {
              if (viewOnly) {
                navigate('/products');
              } else {
                setShowPreview(false);
              }
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
