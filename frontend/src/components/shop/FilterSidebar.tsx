import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { ProductFilters, ProductColor, CategoryItem } from '@/types/product';
import { Slider } from '@/components/ui/slider';

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories: CategoryItem[];
  brands: string[];
  colors: ProductColor[];
  priceRange: [number, number];
  onClose?: () => void;
}

const FilterSidebar = ({ filters, onChange, categories, brands, colors, priceRange, onClose }: FilterSidebarProps) => {
  const { lang, formatPrice } = useLocale();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true, price: true, color: true, size: false, brand: false, other: false,
  });

  const toggle = (key: string) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const update = (partial: Partial<ProductFilters>) => onChange({ ...filters, ...partial });

  const toggleArray = (arr: string[] | undefined, val: string): string[] => {
    const current = arr || [];
    return current.includes(val) ? current.filter(v => v !== val) : [...current, val];
  };

  const currentPrice = filters.priceRange || priceRange;
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const activeCount = [
    filters.categoryId,
    filters.isOnSale,
    filters.isNew,
    filters.isBestSeller,
    filters.colors?.length,
    filters.sizes?.length,
    filters.brands?.length,
    filters.priceRange,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {t('Filters', 'التصفية')}
          {activeCount > 0 && <span className="text-xs text-brand ms-1 font-sans">({activeCount})</span>} 
        </h3>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={() => onChange({})} className="text-xs text-brand hover:underline">
              {t('Clear All', 'مسح الكل')}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="border-b border-border pb-4">
        <button onClick={() => toggle('category')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Category', 'الفئة')}
          <ChevronDown size={14} className={`transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
        </button>
        {openSections.category && (
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === cat.id}
                  onChange={() => update({ categoryId: filters.categoryId === cat.id ? undefined : cat.id })}
                  className="accent-brand"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                  {lang === 'ar' ? cat.name.ar : cat.name.en}
                </span>
                <span className="text-xs text-muted-foreground">{cat.productCount}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-border pb-4">
        <button onClick={() => toggle('price')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Price Range', 'نطاق السعر')}
          <ChevronDown size={14} className={`transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </button>
        {openSections.price && (
          <div className="px-1">
            <Slider
              min={priceRange[0]}
              max={priceRange[1]}
              step={0.5}
              value={[currentPrice[0], currentPrice[1]]}
              onValueChange={([min, max]) => update({ priceRange: [min, max] })}
              className="mb-3"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatPrice(currentPrice[0])}</span>
              <span>{formatPrice(currentPrice[1])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b border-border pb-4">
        <button onClick={() => toggle('color')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Color', 'اللون')}
          <ChevronDown size={14} className={`transition-transform ${openSections.color ? 'rotate-180' : ''}`} />
        </button>
        {openSections.color && (
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => update({ colors: toggleArray(filters.colors, color.id) })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${filters.colors?.includes(color.id) ? 'border-foreground scale-110' : 'border-border'
                  }`}
                style={{ backgroundColor: color.hex }}
                title={lang === 'ar' ? color.name.ar : color.name.en}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b border-border pb-4">
        <button onClick={() => toggle('size')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Size', 'المقاس')}
          <ChevronDown size={14} className={`transition-transform ${openSections.size ? 'rotate-180' : ''}`} />
        </button>
        {openSections.size && (
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => update({ sizes: toggleArray(filters.sizes, size.toLowerCase()) })}
                className={`min-w-[36px] h-8 px-2 text-xs rounded-md border transition-colors ${filters.sizes?.includes(size.toLowerCase())
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="border-b border-border pb-4">
        <button onClick={() => toggle('brand')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Brand', 'العلامة التجارية')}
          <ChevronDown size={14} className={`transition-transform ${openSections.brand ? 'rotate-180' : ''}`} />
        </button>
        {openSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => update({ brands: toggleArray(filters.brands, brand) })}
                  className="accent-brand"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Other */}
      <div className="pb-4">
        <button onClick={() => toggle('other')} className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3">
          {t('Other', 'أخرى')}
          <ChevronDown size={14} className={`transition-transform ${openSections.other ? 'rotate-180' : ''}`} />
        </button>
        {openSections.other && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.isOnSale || false} onChange={() => update({ isOnSale: !filters.isOnSale })} className="accent-brand" />
              <span className="text-sm text-muted-foreground">{t('On Sale', 'عروض')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.inStock || false} onChange={() => update({ inStock: !filters.inStock })} className="accent-brand" />
              <span className="text-sm text-muted-foreground">{t('In Stock', 'متوفر')}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
