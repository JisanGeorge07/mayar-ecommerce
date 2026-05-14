import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormSection from '@/components/forms/FormSection';
import FormField from '@/components/forms/FormField';
import { generateSlug } from '@/utils/slug';
import { categoryService, subcategoryService, productTypeService, productService } from '@/services';
import type { HeroBanner, HeroBannerLinkType } from '@/types/heroBanner';
import type { Category, Subcategory, ProductType, Product } from '@/types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import HeroBannerPreview from './HeroBannerPreview';

interface Props {
  initial?: HeroBanner;
  onSave: (data: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>, desktopFile?: File, mobileFile?: File) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function HeroBannerForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState({
    banner_name: initial?.banner_name || '',
    slug: initial?.slug || '',
    label_en: initial?.label_en || '',
    label_ar: initial?.label_ar || '',
    title_en: initial?.title_en || '',
    title_ar: initial?.title_ar || '',
    description_en: initial?.description_en || '',
    description_ar: initial?.description_ar || '',
    cta_text_en: initial?.cta_text_en || '',
    cta_text_ar: initial?.cta_text_ar || '',
    current_price_kwd: initial?.current_price_kwd ?? '',
    old_price_kwd: initial?.old_price_kwd ?? '',
    current_price_inr: initial?.current_price_inr ?? '',
    old_price_inr: initial?.old_price_inr ?? '',
    link_type: (initial?.link_type || 'category') as HeroBannerLinkType,
    category_id: initial?.category_id || '',
    subcategory_id: initial?.subcategory_id || '',
    product_type_id: initial?.product_type_id || '',
    product_id: initial?.product_id || '',
    custom_url: initial?.custom_url || '',
    desktop_image_url: initial?.desktop_image_url || '',
    mobile_image_url: initial?.mobile_image_url || '',
    alt_text: initial?.alt_text || '',
    sort_order: initial?.sort_order ?? 0,
    is_active: initial?.is_active ?? true,
    is_published: initial?.is_published ?? true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
  const [previewCurrency, setPreviewCurrency] = useState<'KWD' | 'INR'>('KWD');

  // Store actual File objects for upload
  const [desktopFile, setDesktopFile] = useState<File | undefined>();
  const [mobileFile, setMobileFile] = useState<File | undefined>();

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
    subcategoryService.getSubcategories().then(setSubcategories);
    productTypeService.getProductTypes().then(setProductTypes);
    productService.getProducts().then(setProducts);
  }, []);

  const update = (field: string, value: any) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'banner_name') next.slug = generateSlug(value);
      return next;
    });
  };

  const handleImageUpload = (field: 'desktop_image_url' | 'mobile_image_url') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update(field, URL.createObjectURL(file));
      // Store the actual File object for Cloudinary upload
      if (field === 'desktop_image_url') {
        setDesktopFile(file);
      } else {
        setMobileFile(file);
      }
    }
  };

  const handleSubmit = () => {
    onSave(
      {
        ...form,
        current_price_kwd: form.current_price_kwd === '' ? null : Number(form.current_price_kwd),
        old_price_kwd: form.old_price_kwd === '' ? null : Number(form.old_price_kwd),
        current_price_inr: form.current_price_inr === '' ? null : Number(form.current_price_inr),
        old_price_inr: form.old_price_inr === '' ? null : Number(form.old_price_inr),
      },
      desktopFile,
      mobileFile
    );
  };

  const filteredSubs = subcategories.filter(s => !form.category_id || s.category_id === form.category_id);
  const filteredPts = productTypes.filter(p => !form.subcategory_id || p.subcategory_id === form.subcategory_id);

  // Build a preview-compatible banner object
  const previewBanner: HeroBanner = {
    id: '',
    created_at: '',
    updated_at: '',
    ...form,
    current_price_kwd: form.current_price_kwd === '' ? null : Number(form.current_price_kwd),
    old_price_kwd: form.old_price_kwd === '' ? null : Number(form.old_price_kwd),
    current_price_inr: form.current_price_inr === '' ? null : Number(form.current_price_inr),
    old_price_inr: form.old_price_inr === '' ? null : Number(form.old_price_inr),
  };

  return (
    <div className="space-y-6">
      {/* Admin Fields */}
      <FormSection title="Admin Settings">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Banner Name" required>
            <Input value={form.banner_name} onChange={e => update('banner_name', e.target.value)} />
          </FormField>
          <FormField label="Slug">
            <Input value={form.slug} onChange={e => update('slug', e.target.value)} className="text-muted-foreground" />
          </FormField>
          <FormField label="Sort Order">
            <Input type="number" value={form.sort_order} onChange={e => update('sort_order', Number(e.target.value))} />
          </FormField>
          <div className="flex items-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => update('is_active', v)} />
              <Label className="text-sm">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={v => update('is_published', v)} />
              <Label className="text-sm">Published</Label>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Bilingual Content */}
      <FormSection title="Content (English & Arabic)">
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
          <TabsContent value="en">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Label / Eyebrow (EN)" hint="e.g. CURATED SELECTION">
                <Input value={form.label_en} onChange={e => update('label_en', e.target.value)} />
              </FormField>
              <FormField label="Main Title (EN)" required>
                <Input value={form.title_en} onChange={e => update('title_en', e.target.value)} />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Description (EN)">
                <Textarea value={form.description_en} onChange={e => update('description_en', e.target.value)} rows={2} />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="CTA Button Text (EN)">
                <Input value={form.cta_text_en} onChange={e => update('cta_text_en', e.target.value)} />
              </FormField>
            </div>
          </TabsContent>
          <TabsContent value="ar">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Label / Eyebrow (AR)" hint="مثال: مجموعة مختارة">
                <Input value={form.label_ar} onChange={e => update('label_ar', e.target.value)} dir="rtl" />
              </FormField>
              <FormField label="Main Title (AR)" required>
                <Input value={form.title_ar} onChange={e => update('title_ar', e.target.value)} dir="rtl" />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Description (AR)">
                <Textarea value={form.description_ar} onChange={e => update('description_ar', e.target.value)} rows={2} dir="rtl" />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="CTA Button Text (AR)">
                <Input value={form.cta_text_ar} onChange={e => update('cta_text_ar', e.target.value)} dir="rtl" />
              </FormField>
            </div>
          </TabsContent>
        </Tabs>
      </FormSection>

      {/* Multi-Currency Pricing */}
      <FormSection title="Pricing (KWD & INR)">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">KWD Pricing</h4>
            <FormField label="Current Price (KWD)">
              <Input type="number" step="0.01" value={form.current_price_kwd} onChange={e => update('current_price_kwd', e.target.value)} />
            </FormField>
            <FormField label="Old Price (KWD)">
              <Input type="number" step="0.01" value={form.old_price_kwd} onChange={e => update('old_price_kwd', e.target.value)} />
            </FormField>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">INR Pricing</h4>
            <FormField label="Current Price (INR)">
              <Input type="number" step="1" value={form.current_price_inr} onChange={e => update('current_price_inr', e.target.value)} />
            </FormField>
            <FormField label="Old Price (INR)">
              <Input type="number" step="1" value={form.old_price_inr} onChange={e => update('old_price_inr', e.target.value)} />
            </FormField>
          </div>
        </div>
      </FormSection>

      {/* Media */}
      <FormSection title="Media">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Desktop Image */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Desktop Image</Label>
            <p className="text-xs text-muted-foreground mb-2">Recommended size: 2048 × 868 px · Wide landscape ratio</p>
            {form.desktop_image_url ? (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={form.desktop_image_url} alt="Desktop" className="w-full h-40 object-cover" />
                <button onClick={() => { update('desktop_image_url', ''); setDesktopFile(undefined); }} className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload desktop hero image</span>
                <span className="text-xs text-muted-foreground/60 mt-1">2048 × 868 px recommended</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('desktop_image_url')} />
              </label>
            )}
          </div>
          {/* Mobile Image */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Mobile Image (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">Use a mobile-friendly cropped version if needed</p>
            {form.mobile_image_url ? (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={form.mobile_image_url} alt="Mobile" className="w-full h-40 object-cover" />
                <button onClick={() => { update('mobile_image_url', ''); setMobileFile(undefined); }} className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload mobile image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('mobile_image_url')} />
              </label>
            )}
          </div>
        </div>
        <div className="mt-4">
          <FormField label="Alt Text">
            <Input value={form.alt_text} onChange={e => update('alt_text', e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      {/* Linking */}
      <FormSection title="CTA Link Target">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Link Type">
            <Select value={form.link_type} onValueChange={v => update('link_type', v)}>
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

          {form.link_type === 'category' && (
            <FormField label="Category">
              <Select value={form.category_id} onValueChange={v => update('category_id', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.status === 'active').map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {form.link_type === 'subcategory' && (
            <>
              <FormField label="Category">
                <Select value={form.category_id} onValueChange={v => { update('category_id', v); update('subcategory_id', ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.status === 'active').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Subcategory">
                <Select value={form.subcategory_id} onValueChange={v => update('subcategory_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                  <SelectContent>
                    {filteredSubs.filter(s => s.status === 'active').map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </>
          )}

          {form.link_type === 'product_type' && (
            <>
              <FormField label="Category">
                <Select value={form.category_id} onValueChange={v => { update('category_id', v); update('subcategory_id', ''); update('product_type_id', ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.status === 'active').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Subcategory">
                <Select value={form.subcategory_id} onValueChange={v => { update('subcategory_id', v); update('product_type_id', ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                  <SelectContent>
                    {filteredSubs.filter(s => s.status === 'active').map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Product Type">
                <Select value={form.product_type_id} onValueChange={v => update('product_type_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select product type" /></SelectTrigger>
                  <SelectContent>
                    {filteredPts.filter(p => p.status === 'active').map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </>
          )}

          {form.link_type === 'product' && (
            <div className="space-y-4">
              <FormField label="Product">
                <Select value={form.product_id} onValueChange={v => update('product_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
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
                      Base Price: {products.find(p => p.id === form.product_id)?.base_price_kwd} KWD / {products.find(p => p.id === form.product_id)?.base_price_inr} INR
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Brand: {products.find(p => p.id === form.product_id)?.brand}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {form.link_type === 'custom_url' && (
            <FormField label="Custom URL">
              <Input value={form.custom_url} onChange={e => update('custom_url', e.target.value)} />
            </FormField>
          )}
        </div>
      </FormSection>

      {/* Live Preview */}
      <FormSection title="Live Preview">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Language:</Label>
            <Select value={previewLang} onValueChange={v => setPreviewLang(v as 'en' | 'ar')}>
              <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Currency:</Label>
            <Select value={previewCurrency} onValueChange={v => setPreviewCurrency(v as 'KWD' | 'INR')}>
              <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="KWD">KWD</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <HeroBannerPreview banner={previewBanner} lang={previewLang} currency={previewCurrency} />
      </FormSection>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : (initial ? 'Update Banner' : 'Create Banner')}
        </Button>
      </div>
    </div>
  );
}
