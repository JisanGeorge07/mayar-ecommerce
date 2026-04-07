import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';
import type { TopCategory, MiddleCategory, BottomCategory } from '@/types';

interface HierarchyStepperProps {
  categories: TopCategory[];
  subcategories: MiddleCategory[];
  productTypes: BottomCategory[];
  selectedCategory: TopCategory | null;
  selectedSubcategory: MiddleCategory | null;
  selectedProductType: BottomCategory | null;
  onSelectCategory: (c: TopCategory) => void;
  onSelectSubcategory: (s: MiddleCategory) => void;
  onSelectProductType: (p: BottomCategory) => void;
  onReset: () => void;
  currentFormStep: number;
}

const STEPS = ['Category', 'Subcategory', 'Product Type', 'Product Details', 'Preview / Publish'];

export default function HierarchyStepper({
  categories, subcategories, productTypes,
  selectedCategory, selectedSubcategory, selectedProductType,
  onSelectCategory, onSelectSubcategory, onSelectProductType,
  onReset, currentFormStep,
}: HierarchyStepperProps) {
  const stepsDone = [
    !!selectedCategory,
    !!selectedSubcategory,
    !!selectedProductType,
    currentFormStep >= 1,
    currentFormStep >= 2,
    currentFormStep >= 3,
    currentFormStep >= 4,
  ];

  const activeStep = stepsDone.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-semibold text-foreground">Product Creation Flow</h2>
          <button onClick={onReset} className="text-xs font-medium text-primary hover:underline">
            Reset
          </button>
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                    i < activeStep
                      ? 'bg-primary text-primary-foreground'
                      : i === activeStep
                        ? 'border-2 border-primary text-primary'
                        : 'border border-border text-muted-foreground'
                  )}
                >
                  {i < activeStep ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={cn('text-xs font-medium hidden xl:inline', i <= activeStep ? 'text-foreground' : 'text-muted-foreground')}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('h-px flex-1', i < activeStep ? 'bg-primary' : 'bg-border')} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Breadcrumb */}
        {selectedCategory && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-primary">{selectedCategory.titleEnglish}</span>
            {selectedSubcategory && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium text-primary">{selectedSubcategory.titleEnglish}</span>
              </>
            )}
            {selectedProductType && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium text-primary">{selectedProductType.titleEnglish}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Selection grids */}
      {!selectedCategory && (
        <SelectionGrid
          title="Select Category"
          items={categories.map(c => ({ id: c.id, name: c.titleEnglish || '', data: c }))}
          onSelect={(item) => onSelectCategory(item.data as TopCategory)}
        />
      )}

      {selectedCategory && !selectedSubcategory && (
        <SelectionGrid
          title="Select Subcategory"
          items={subcategories.map(s => ({ id: s.id, name: s.titleEnglish || '', data: s }))}
          onSelect={(item) => onSelectSubcategory(item.data as MiddleCategory)}
          emptyMessage="No subcategories available for this category."
        />
      )}

      {selectedSubcategory && !selectedProductType && (
        <SelectionGrid
          title="Select Product Type"
          items={productTypes.map(p => ({ id: p.id, name: p.titleEnglish || '', data: p }))}
          onSelect={(item) => onSelectProductType(item.data as BottomCategory)}
          emptyMessage="No product types available. You can add custom types later."
        />
      )}
    </div>
  );
}

function SelectionGrid({
  title,
  items,
  onSelect,
  emptyMessage,
}: {
  title: string;
  items: { id: string; name: string; data: any }[];
  onSelect: (item: any) => void;
  emptyMessage?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm animate-fade-in">
      <h3 className="font-display text-base font-semibold text-foreground mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage || 'No items available.'}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:shadow-sm hover:bg-primary/5 active:scale-[0.97]"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
