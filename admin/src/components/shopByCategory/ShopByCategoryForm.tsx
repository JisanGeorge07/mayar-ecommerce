import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormSection from '@/components/forms/FormSection';
import FormField from '@/components/forms/FormField';
import type { ShopByCategoryItem } from '@/types/shopByCategory';
import { INITIAL_SHOP_BY_CATEGORY } from '@/types/shopByCategory';
import type { TopCategory, MiddleCategory, BottomCategory } from '@/types';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService } from '@/services/middleCategoryService';
import { bottomCategoryService } from '@/services/bottomCategoryService';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface Props {
  initial: ShopByCategoryItem | null;
  onSave: (data: Omit<ShopByCategoryItem, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => void;
  onCancel: () => void;
}

export default function ShopByCategoryForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<ShopByCategoryItem, 'id' | 'created_at' | 'updated_at'>>(
    initial ? { ...initial } : { ...INITIAL_SHOP_BY_CATEGORY }
  );
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string>(initial?.image_url || '');

  // State for categories fetched from API
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [middleCategories, setMiddleCategories] = useState<MiddleCategory[]>([]);
  const [bottomCategories, setBottomCategories] = useState<BottomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [top, middle, bottom] = await Promise.all([
          topCategoryService.getAll(),
          middleCategoryService.getAll(),
          bottomCategoryService.getAll(),
        ]);
        setTopCategories(top);
        setMiddleCategories(middle);
        setBottomCategories(bottom);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(prev => ({ ...prev, [k]: v }));

  // Filter subcategories (middle) by selected top category
  const filteredSubs = middleCategories.filter(m => !form.category_id || m.topCategoryId === form.category_id);
  // Filter product types (bottom) by selected subcategory
  const filteredPTs = bottomCategories.filter(b => !form.subcategory_id || b.middleCategoryId === form.subcategory_id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(undefined);
    setImagePreview('');
    set('image_url', '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Form – 3 cols */}
      <div className="lg:col-span-3 space-y-5">
        <FormSection title="Basic Info">
          <div className="space-y-4">
            <FormField label="Internal Name" required>
              <Input value={form.internal_name} onChange={e => set('internal_name', e.target.value)} placeholder="e.g. Dresses" />
            </FormField>

            <Tabs defaultValue="en" className="w-full">
              <TabsList className="mb-2"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ar">العربية</TabsTrigger></TabsList>
              <TabsContent value="en">
                <FormField label="Display Title (EN)" required>
                  <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} placeholder="Dresses" />
                </FormField>
              </TabsContent>
              <TabsContent value="ar">
                <FormField label="Display Title (AR)">
                  <Input value={form.title_ar} onChange={e => set('title_ar', e.target.value)} placeholder="فساتين" dir="rtl" />
                </FormField>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Sort Order">
                <Input type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
              </FormField>
              <div className="flex items-center gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
                  <Label className="text-sm">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_published} onCheckedChange={v => set('is_published', v)} />
                  <Label className="text-sm">Published</Label>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Category Image" description="Recommended size: 600 × 800 px · Best for vertical category image thumbnails">
          <div className="space-y-3">
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt={form.alt_text} className="h-40 w-30 rounded-lg object-cover mx-auto" />
                  <Button size="sm" variant="outline" className="mt-2" onClick={handleRemoveImage}>Remove</Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 py-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload category image</span>
                  <span className="text-xs text-muted-foreground/70">Recommended: 600 × 800 px</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <FormField label="Alt Text">
              <Input value={form.alt_text} onChange={e => set('alt_text', e.target.value)} placeholder="Descriptive alt text" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Link Target">
          <div className="space-y-4">
            <FormField label="Link Type">
              <Select value={form.link_type} onValueChange={v => set('link_type', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="subcategory">Subcategory</SelectItem>
                  <SelectItem value="product_type">Product Type</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="custom_url">Custom URL</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            {(form.link_type === 'category' || form.link_type === 'subcategory' || form.link_type === 'product_type') && (
              <FormField label="Category">
                <Select value={form.category_id} onValueChange={v => { set('category_id', v); set('subcategory_id', ''); set('product_type_id', ''); }} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder={loading ? 'Loading...' : 'Select category'} /></SelectTrigger>
                  <SelectContent>{topCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            )}
            {(form.link_type === 'subcategory' || form.link_type === 'product_type') && (
              <FormField label="Subcategory">
                <Select value={form.subcategory_id} onValueChange={v => { set('subcategory_id', v); set('product_type_id', ''); }} disabled={loading || !form.category_id}>
                  <SelectTrigger><SelectValue placeholder={loading ? 'Loading...' : 'Select subcategory'} /></SelectTrigger>
                  <SelectContent>{filteredSubs.map(s => <SelectItem key={s.id} value={s.id}>{s.titleEnglish}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            )}
            {form.link_type === 'product_type' && (
              <FormField label="Product Type">
                <Select value={form.product_type_id} onValueChange={v => set('product_type_id', v)} disabled={loading || !form.subcategory_id}>
                  <SelectTrigger><SelectValue placeholder={loading ? 'Loading...' : 'Select product type'} /></SelectTrigger>
                  <SelectContent>{filteredPTs.map(pt => <SelectItem key={pt.id} value={pt.id}>{pt.titleEnglish}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            )}
            {form.link_type === 'custom_url' && (
              <FormField label="Custom URL">
                <Input value={form.custom_url} onChange={e => set('custom_url', e.target.value)} placeholder="https://..." />
              </FormField>
            )}
          </div>
        </FormSection>
      </div>

      {/* Preview – 2 cols */}
      <div className="lg:col-span-2 space-y-4">
        <FormSection title="Preview" description="Storefront category circle simulation">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border shadow-md bg-muted">
              {imagePreview ? (
                <img src={imagePreview} alt={form.alt_text} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-8 w-8 text-muted-foreground/40" /></div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{form.title_en || 'Category Title'}</span>
            {form.title_ar && <span className="text-xs text-muted-foreground" dir="rtl">{form.title_ar}</span>}
          </div>
        </FormSection>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(form, imageFile)}>
            {initial ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}
