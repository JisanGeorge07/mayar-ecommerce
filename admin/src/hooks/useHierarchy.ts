import { useState, useEffect, useCallback } from 'react';
import type { TopCategory, MiddleCategory, BottomCategory } from '@/types';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService } from '@/services/middleCategoryService';
import { bottomCategoryService } from '@/services/bottomCategoryService';

export function useHierarchy() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MiddleCategory[]>([]);
  const [productTypes, setProductTypes] = useState<BottomCategory[]>([]);
  const [allMiddleCategories, setAllMiddleCategories] = useState<MiddleCategory[]>([]);
  const [allBottomCategories, setAllBottomCategories] = useState<BottomCategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<TopCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<MiddleCategory | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<BottomCategory | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [topCategories, middleCategories, bottomCategories] = await Promise.all([
          topCategoryService.getAll(),
          middleCategoryService.getAll(),
          bottomCategoryService.getAll(),
        ]);
        setCategories(topCategories.filter(c => c.isActive));
        setAllMiddleCategories(middleCategories.filter(c => c.isActive));
        setAllBottomCategories(bottomCategories.filter(c => c.isActive));
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  const selectCategory = useCallback((cat: TopCategory) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setSelectedProductType(null);
    // Filter subcategories by selected top category
    const filteredSubs = allMiddleCategories.filter(s => s.topCategoryId === cat.id);
    setSubcategories(filteredSubs);
    setProductTypes([]);
  }, [allMiddleCategories]);

  const selectSubcategory = useCallback((sub: MiddleCategory) => {
    setSelectedSubcategory(sub);
    setSelectedProductType(null);
    // Filter product types by selected middle category
    const filteredTypes = allBottomCategories.filter(p => p.middleCategoryId === sub.id);
    setProductTypes(filteredTypes);
  }, [allBottomCategories]);

  const selectProductType = useCallback((pt: BottomCategory) => {
    setSelectedProductType(pt);
  }, []);

  const resetHierarchy = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedProductType(null);
    setSubcategories([]);
    setProductTypes([]);
  }, []);

  const isComplete = !!(selectedCategory && selectedSubcategory && selectedProductType);

  return {
    categories,
    subcategories,
    productTypes,
    selectedCategory,
    selectedSubcategory,
    selectedProductType,
    selectCategory,
    selectSubcategory,
    selectProductType,
    resetHierarchy,
    isComplete,
  };
}
