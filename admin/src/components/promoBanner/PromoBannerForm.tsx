import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormSection from '@/components/forms/FormSection';
import FormField from '@/components/forms/FormField';
import type { PromoBannerItem } from '@/types/promoBanner';
import { INITIAL_PROMO_BANNER } from '@/types/promoBanner';
import type { TopCategory, MiddleCategory, BottomCategory } from '@/types';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService } from '@/services/middleCategoryService';
import { bottomCategoryService } from '@/services/bottomCategoryService';
import { productService } from '@/services';
import type { Product } from '@/types';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  initial: PromoBannerItem | null;
  onSave: (data: Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'>, desktopFile?: File, mobileFile?: File) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function PromoBannerForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'>>(
    initial ? { ...initial } : { ...INITIAL_PROMO_BANNER }
  );
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
  const [desktopFile, setDesktopFile] = useState<File | undefined>(undefined);
  const [mobileFile, setMobileFile] = useState<File | undefined>(undefined);
  const [desktopPreview, setDesktopPreview] = useState<string>(initial?.desktop_image_url || '');
  const [mobilePreview, setMobilePreview] = useState<string>(initial?.mobile_image_url || '');

  // Category data from API
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MiddleCategory[]>([]);
  const [productTypes, setProductTypes] = useState<BottomCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const [topCats, middleCats, bottomCats, allProducts] = await Promise.all([
          topCategoryService.getAll(),
          middleCategoryService.getAll(),
          bottomCategoryService.getAll(),
          productService.getProducts(),
        ]);
        setCategories(topCats);
        setSubcategories(middleCats);
        setProductTypes(bottomCats);
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(prev => ({ ...prev, [k]: v }));

  // Filter subcategories based on selected category
  const filteredSubs = subcategories.filter(s => !form.category_id || s.topCategoryId === form.category_id);
  // Filter product types based on selected subcategory
  const filteredPTs = productTypes.filter(pt => !form.subcategory_id || pt.middleCategoryId === form.subcategory_id);

  const handleDesktopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesktopFile(file);
      setDesktopPreview(URL.createObjectURL(file));
    }
  };
  const handleMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };
  const handleRemoveDesktop = () => {
    setDesktopFile(undefined);
    setDesktopPreview('');
    set('desktop_image_url', '');
  };
  const handleRemoveMobile = () => {
    setMobileFile(undefined);
    setMobilePreview('');
    set('mobile_image_url', '');
  };

  const pLabel = previewLang === 'ar' ? form.label_ar : form.label_en;
  const pTitle = previewLang === 'ar' ? form.title_ar : form.title_en;
  const pCta = previewLang === 'ar' ? form.cta_text_ar : form.cta_text_en;

  // Helper to get category display name
  const getCategoryName = (cat: TopCategory) => cat.titleEnglish || cat.titleArabic || 'Unnamed';
  const getSubcategoryName = (sub: MiddleCategory) => sub.titleEnglish || sub.titleArabic || 'Unnamed';
  const getProductTypeName = (pt: BottomCategory) => pt.titleEnglish || pt.titleArabic || 'Unnamed';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Form – 3 cols */}
      <div className="lg:col-span-3 space-y-5">
        <FormSection title="Basic Info">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Internal Name" required>
                <Input value={form.internal_name} onChange={e => set('internal_name', e.target.value)} />
              </FormField>
              <FormField label="Layout Type" required>
                <Select value={form.layout_type} onValueChange={v => set('layout_type', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small Banner</SelectItem>
                    <SelectItem value="large">Large Banner</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

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

        <FormSection title="Content" description="Bilingual label, title, and CTA text">
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-3"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="ar">العربية</TabsTrigger></TabsList>
            <TabsContent value="en" className="space-y-4">
              <FormField label="Label / Eyebrow (EN)">
                <Input value={form.label_en} onChange={e => set('label_en', e.target.value)} />
              </FormField>
              <FormField label="Title (EN)" required>
                <Input value={form.title_en} onChange={e => set('title_en', e.target.value)} />
              </FormField>
              <FormField label="CTA Button Text (EN)">
                <Input value={form.cta_text_en} onChange={e => set('cta_text_en', e.target.value)} />
              </FormField>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4">
              <FormField label="Label / Eyebrow (AR)">
                <Input value={form.label_ar} onChange={e => set('label_ar', e.target.value)} dir="rtl" />
              </FormField>
              <FormField label="Title (AR)">
                <Input value={form.title_ar} onChange={e => set('title_ar', e.target.value)} dir="rtl" />
              </FormField>
              <FormField label="CTA Button Text (AR)">
                <Input value={form.cta_text_ar} onChange={e => set('cta_text_ar', e.target.value)} dir="rtl" />
              </FormField>
            </TabsContent>
          </Tabs>
        </FormSection>

        <FormSection title="Media" description="Upload banner images for desktop and mobile">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Desktop Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {desktopPreview ? (
                  <div className="space-y-2">
                    <img src={desktopPreview} alt={form.alt_text} className="w-full h-32 rounded object-cover" />
                    <Button size="sm" variant="outline" onClick={handleRemoveDesktop}>Remove</Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 py-3">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload desktop banner</span>
                    <span className="text-xs text-muted-foreground/70">Recommended: 1200 × 512 px</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleDesktopUpload} />
                  </label>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Mobile Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {mobilePreview ? (
                  <div className="space-y-2">
                    <img src={mobilePreview} alt={form.alt_text} className="w-full h-24 rounded object-cover" />
                    <Button size="sm" variant="outline" onClick={handleRemoveMobile}>Remove</Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-1.5 py-2">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload mobile version (optional)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleMobileUpload} />
                  </label>
                )}
              </div>
            </div>
            <FormField label="Alt Text">
              <Input value={form.alt_text} onChange={e => set('alt_text', e.target.value)} />
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
                {loadingCategories ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading categories...</span>
                  </div>
                ) : (
                  <Select value={form.category_id} onValueChange={v => { set('category_id', v); set('subcategory_id', ''); set('product_type_id', ''); }}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{getCategoryName(c)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            )}
            {(form.link_type === 'subcategory' || form.link_type === 'product_type') && (
              <FormField label="Subcategory">
                {loadingCategories ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading subcategories...</span>
                  </div>
                ) : (
                  <Select value={form.subcategory_id} onValueChange={v => { set('subcategory_id', v); set('product_type_id', ''); }}>
                    <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                    <SelectContent>
                      {filteredSubs.map(s => (
                        <SelectItem key={s.id} value={s.id}>{getSubcategoryName(s)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            )}
            {form.link_type === 'product_type' && (
              <FormField label="Product Type">
                {loadingCategories ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading product types...</span>
                  </div>
                ) : (
                  <Select value={form.product_type_id} onValueChange={v => set('product_type_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Select product type" /></SelectTrigger>
                    <SelectContent>
                      {filteredPTs.map(pt => (
                        <SelectItem key={pt.id} value={pt.id}>{getProductTypeName(pt)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            )}
            {form.link_type === 'product' && (
              <div className="space-y-4">
                <FormField label="Product">
                  <Select value={form.product_id} onValueChange={v => set('product_id', v)} disabled={loadingCategories}>
                    <SelectTrigger><SelectValue placeholder={loadingCategories ? 'Loading...' : 'Select product'} /></SelectTrigger>
                    <SelectContent>
                      {products.filter(p => p.status === 'active').map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {form.product_id && (
                  <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                    {products.find(p => p.id === form.product_id)?.image_url && (
                      <img
                        src={products.find(p => p.id === form.product_id)?.image_url}
                        alt="Product"
                        className="h-16 w-16 rounded object-cover border"
                      />
                    )}
                    <div>
                      <h5 className="text-sm font-semibold">{products.find(p => p.id === form.product_id)?.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        Base Price: {products.find(p => p.id === form.product_id)?.base_price_kwd} KWD
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {form.link_type === 'custom_url' && (
              <FormField label="Custom URL">
                <Input value={form.custom_url} onChange={e => set('custom_url', e.target.value)} />
              </FormField>
            )}
          </div>
        </FormSection>
      </div>

      {/* Preview – 2 cols */}
      <div className="lg:col-span-2 space-y-4">
        <FormSection title="Live Preview" description="Storefront promotional banner simulation">
          <div className="space-y-3">
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant={previewLang === 'en' ? 'default' : 'outline'} onClick={() => setPreviewLang('en')}>EN</Button>
              <Button size="sm" variant={previewLang === 'ar' ? 'default' : 'outline'} onClick={() => setPreviewLang('ar')}>AR</Button>
            </div>

            {/* Promo card preview */}
            <div
              className="relative overflow-hidden rounded-xl border border-border"
              style={{ aspectRatio: form.layout_type === 'large' ? '1200 / 512' : '580 / 512' }}
            >
              {desktopPreview ? (
                <img src={desktopPreview} alt={form.alt_text} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground/50">
                      Recommended: 1200 × 512 px
                    </p>
                  </div>
                </div>
              )}
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end p-5" dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="space-y-1.5">
                  {pLabel && <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{pLabel}</span>}
                  <h3 className="text-lg font-bold text-white leading-tight">{pTitle || 'Banner Title'}</h3>
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm">
                    {pCta || 'Shop now'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {form.layout_type === 'large' ? 'Large banner (full width)' : 'Small banner (half width)'} · {form.layout_type === 'large' ? '1200 × 512 px' : '1200 × 512 px'} recommended
            </p>
          </div>
        </FormSection>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form, desktopFile, mobileFile)} disabled={saving}>
            {saving ? 'Saving...' : (initial ? 'Update' : 'Create')}
          </Button>
        </div>
      </div>
    </div>
  );
}
