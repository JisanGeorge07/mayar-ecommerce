import { useEffect, useState } from 'react';
import FormSection from '@/components/forms/FormSection';
import FormField from '@/components/forms/FormField';
import type { ProductFormState, ProductVariant, ProductImage, ProductReview, ProductColor, ProductSize, ProductSpecification, ProductCareInstruction, ProductFeature, TrustBadge } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, Eye, ImageIcon, Loader2 } from 'lucide-react';
import { calcDiscountPercent } from '@/utils/slug';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { productFeatureService, trustBadgeService } from '@/services';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFormProps {
  form: ProductFormState;
  updateBasic: (field: string, value: any) => void;
  isEditing?: boolean;
  addColor: (c: ProductColor) => void;
  removeColor: (id: string) => void;
  updateColor: (id: string, updates: Partial<ProductColor>) => void;
  addSize: (s: ProductSize) => void;
  removeSize: (id: string) => void;
  updateSize: (id: string, updates: Partial<ProductSize>) => void;
  addSpecification: (s: ProductSpecification) => void;
  removeSpecification: (id: string) => void;
  updateSpecification: (id: string, updates: Partial<ProductSpecification>) => void;
  addCareInstruction: (c: ProductCareInstruction) => void;
  removeCareInstruction: (id: string) => void;
  updateCareInstruction: (id: string, updates: Partial<ProductCareInstruction>) => void;
  addFeature: (f: ProductFeature) => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, updates: Partial<ProductFeature>) => void;
  setTrustBadges: (badges: string[]) => void;
  addVariant: (v: ProductVariant) => void;
  removeVariant: (id: string) => void;
  updateVariant: (id: string, updates: Partial<ProductVariant>) => void;
  newVariantData: Partial<ProductVariant>;
  setNewVariantData: (data: any) => void;
  handleAddVariant: () => void;
  addImage: (img: ProductImage) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<ProductImage>) => void;
  updateDetails: (field: string, value: string) => void;
  updateSeo: (field: string, value: string) => void;
  addReview: (r: ProductReview) => void;
  removeReview: (id: string) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onPreview: () => void;
  categoryName: string;
  subcategoryName: string;
  productTypeName: string;
  viewOnly?: boolean;
  isSavingDraft?: boolean;
  isPublishing?: boolean;
}

export default function ProductForm({
  form, updateBasic, isEditing = false,
  addColor, removeColor, updateColor,
  addSize, removeSize, updateSize,
  addSpecification, removeSpecification, updateSpecification,
  addCareInstruction, removeCareInstruction, updateCareInstruction,
  addFeature, removeFeature, updateFeature,
  setTrustBadges,
  addVariant, removeVariant, updateVariant,
  newVariantData, setNewVariantData, handleAddVariant,
  addImage, removeImage, updateImage,
  updateDetails, updateSeo,
  addReview, removeReview,
  onSaveDraft, onPublish, onPreview,
  categoryName, subcategoryName, productTypeName,
  viewOnly = false,
  isSavingDraft = false,
  isPublishing = false,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'color' | 'size' | 'image' | 'feature' | 'specification' | 'care' | 'variant' | null;
    id: string | null;
    name?: string;
  }>({ open: false, type: null, id: null });

  const discountKwd = calcDiscountPercent(form.basic.base_price_kwd || 0, form.basic.compare_price_kwd || 0);
  const discountInr = calcDiscountPercent(form.basic.base_price_inr || 0, form.basic.compare_price_inr || 0);

  const handleDelete = () => {
    if (!deleteDialog.type || !deleteDialog.id) return;

    switch (deleteDialog.type) {
      case 'color':
        removeColor(deleteDialog.id);
        break;
      case 'size':
        removeSize(deleteDialog.id);
        break;
      case 'image':
        removeImage(deleteDialog.id);
        break;
      case 'feature':
        removeFeature(deleteDialog.id);
        break;
      case 'specification':
        removeSpecification(deleteDialog.id);
        break;
      case 'care':
        removeCareInstruction(deleteDialog.id);
        break;
      case 'variant':
        removeVariant(deleteDialog.id);
        break;
    }

    setDeleteDialog({ open: false, type: null, id: null });
  };

  const [trustBadges, setTrustBadgesState] = useState<TrustBadge[]>([]);

  const load = async () => {
    try {
      const data = await trustBadgeService.getTrustBadges();
      setTrustBadgesState(data);
    } catch (err) {
      toast.error('Failed to load trust badges');
    }
  };

  useEffect(() => {
    load();
  }, []);



  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
          {['basic', 'pricing', 'attributes', 'variants', 'media', 'content', 'seo'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="capitalize text-xs">
              {tab === 'basic' ? 'Basic Info' : tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* BASIC INFO */}
        <TabsContent value="basic" className="space-y-4 mt-4">
          <FormSection title="Basic Information" description="Core product details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Product Name (English)" required>
                <Input
                  value={form.basic.nameEnglish || ''}
                  onChange={e => updateBasic('nameEnglish', e.target.value)}
                  placeholder="e.g. Classic Polo Shirt"
                />
              </FormField>
              <FormField label="Product Name (Arabic)" required>
                <Input
                  value={form.basic.nameArabic || ''}
                  onChange={e => updateBasic('nameArabic', e.target.value)}
                  placeholder="e.g. قميص بولو كلاسيكي"
                  dir="rtl"
                />
              </FormField>
              {isEditing && (
                <FormField label="Slug" hint="Unique URL identifier for this product">
                  <Input
                    value={form.basic.slug || ''}
                    onChange={e => updateBasic('slug', e.target.value)}
                    placeholder="e.g. classic-polo-shirt"
                    pattern="[a-z0-9-]*"
                  />
                </FormField>
              )}
              <FormField label="Brand (English)" required>
                <Input
                  value={form.basic.brandEnglish || ''}
                  onChange={e => updateBasic('brandEnglish', e.target.value)}
                  placeholder="e.g. Mayar"
                />
              </FormField>
              <FormField label="Brand (Arabic)" required>
                <Input
                  value={form.basic.brandArabic || ''}
                  onChange={e => updateBasic('brandArabic', e.target.value)}
                  placeholder="e.g. ميار"
                  dir="rtl"
                />
              </FormField>
              <FormField label="Category">
                <Input value={categoryName} disabled className="bg-muted" />
              </FormField>
              <FormField label="Subcategory">
                <Input value={subcategoryName} disabled className="bg-muted" />
              </FormField>
              <FormField label="Product Type">
                <Input value={productTypeName} disabled className="bg-muted" />
              </FormField>

              {/* Status dropdown removed - status is controlled by Save Draft / Publish buttons */}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Short Description (English)">
                <Textarea
                  value={form.basic.shortDescriptionEnglish || ''}
                  onChange={e => updateBasic('shortDescriptionEnglish', e.target.value)}
                  rows={2}
                  placeholder="Brief product summary in English"
                />
              </FormField>
              <FormField label="Short Description (Arabic)">
                <Textarea
                  value={form.basic.shortDescriptionArabic || ''}
                  onChange={e => updateBasic('shortDescriptionArabic', e.target.value)}
                  rows={2}
                  placeholder="وصف مختصر للمنتج بالعربية"
                  dir="rtl"
                />
              </FormField>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'is_featured', label: 'Featured' },
                { key: 'is_new', label: 'New Arrival' },
                { key: 'is_best_seller', label: 'Best Seller' },
                { key: 'is_on_sale', label: 'On Sale' },
                { key: 'in_stock', label: 'In Stock' },
                { key: 'isActive', label: 'Active' },
              ].map(toggle => (
                <div key={toggle.key} className="flex items-center gap-2">
                  <Switch
                    checked={!!form.basic[toggle.key as keyof typeof form.basic]}
                    onCheckedChange={v => updateBasic(toggle.key, v)}
                  />
                  <span className="text-sm text-foreground">{toggle.label}</span>
                </div>
              ))}
            </div>
          </FormSection>

          {/* Trust Badges */}
          <FormSection title="Trust Highlights" description="Select storefront trust badges to display">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trustBadges.map(badge => (
                <label key={badge.id} className="flex items-center gap-3 rounded-md border border-border p-3 bg-background cursor-pointer hover:border-primary/50 transition-colors">
                  <Checkbox
                    checked={form.trustBadges.includes(String(badge.id))}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTrustBadges([...form.trustBadges, badge.id]);
                      } else {
                        setTrustBadges(form.trustBadges.filter(b => b !== badge.id));
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{badge.labelEnglish}</p>
                    <p className="text-xs text-muted-foreground">{badge.descriptionEnglish}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormSection>
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing" className="space-y-4 mt-4">
          <FormSection title="Base Pricing" description="Set base prices. Variants can override these.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Base Price (KWD)" required>
                <Input
                  type="number"
                  step="0.01"
                  value={form.basic.base_price_kwd ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('base_price_kwd', val === '' ? 0 : parseFloat(val));
                  }}
                />
              </FormField>
              <FormField label="Compare At Price (KWD)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.basic.compare_price_kwd ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('compare_price_kwd', val === '' ? 0 : parseFloat(val));
                  }}
                />
              </FormField>
              <FormField label="Base Price (INR)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.basic.base_price_inr ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('base_price_inr', val === '' ? 0 : parseFloat(val));
                  }}
                />
              </FormField>
              <FormField label="Compare At Price (INR)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.basic.compare_price_inr ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('compare_price_inr', val === '' ? 0 : parseFloat(val));
                  }}
                />
              </FormField>
            </div>
            {(discountKwd > 0 || discountInr > 0) && (
              <div className="mt-3 flex gap-4">
                {discountKwd > 0 && <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{discountKwd}% off (KWD)</span>}
                {discountInr > 0 && <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{discountInr}% off (INR)</span>}
              </div>
            )}
          </FormSection>

          <FormSection title="Ratings & Reviews Seed" description="For testing / preview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Overall Rating (0-5)">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.basic.rating ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('rating', val === '' ? 0 : parseFloat(val));
                  }}
                />
              </FormField>
              <FormField label="Review Count">
                <Input
                  type="number"
                  value={form.basic.review_count ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    updateBasic('review_count', val === '' ? 0 : parseInt(val));
                  }}
                />
              </FormField>
            </div>
          </FormSection>
        </TabsContent>

        {/* ATTRIBUTES */}
        <TabsContent value="attributes" className="space-y-4 mt-4">
          {/* Colors with EN/AR and Active toggle */}
          <FormSection title="Color Options" description="Add product color swatches (English & Arabic names)">
            {form.colors.length > 0 && (
              <div className="space-y-3 mb-4">
                {form.colors.map(color => (
                  <div key={color.id} className="rounded-md border border-border p-4 bg-background space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={e => updateColor(color.id, { hex: e.target.value })}
                          className="h-8 w-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <Input
                          value={color.hex}
                          onChange={e => updateColor(color.id, { hex: e.target.value })}
                          placeholder="#000000"
                          className="w-28 font-mono text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={color.isActive}
                            onCheckedChange={v => updateColor(color.id, { isActive: v })}
                          />
                          <span className="text-xs text-muted-foreground">{color.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <button
                          onClick={() => setDeleteDialog({
                            open: true,
                            type: 'color',
                            id: color.id,
                            name: color.nameEnglish || 'this color',
                          })}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={color.nameEnglish}
                        onChange={e => updateColor(color.id, { nameEnglish: e.target.value })}
                        placeholder="Color name (English)"
                      />
                      <Input
                        value={color.nameArabic}
                        onChange={e => updateColor(color.id, { nameArabic: e.target.value })}
                        placeholder="اسم اللون (عربي)"
                        dir="rtl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addColor({ id: crypto.randomUUID(), nameEnglish: '', nameArabic: '', hex: '#000000', isActive: true })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Color
            </Button>
          </FormSection>


          {/* Sizes with Active toggle */}
          <FormSection title="Size Options" description="Add available sizes for the product">
            {form.sizes.length > 0 && (
              <div className="space-y-3 mb-4">
                {form.sizes.map(size => (
                  <div key={size.id} className="flex items-center gap-3 rounded-md border border-border p-3 bg-background">
                    <Input
                      value={size.label}
                      onChange={e => updateSize(size.id, { label: e.target.value })}
                      placeholder="Size (e.g. M, L, XL)"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={size.isActive}
                        onCheckedChange={v => updateSize(size.id, { isActive: v })}
                      />
                      <span className="text-xs text-muted-foreground w-14">{size.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <button
                      onClick={() => setDeleteDialog({
                        open: true,
                        type: 'size',
                        id: size.id,
                        name: size.label || 'this size',
                      })}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSize({ id: crypto.randomUUID(), label: '', isActive: true })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Size
            </Button>
          </FormSection>
        </TabsContent>

        {/* VARIANTS */}
        <TabsContent value="variants" className="space-y-4 mt-4">
          <FormSection title="Product Variants" description="Each variant defines a color/size combo with its own image, stock, and pricing. Add colors and sizes in the Attributes tab first.">
            {form.variants.length > 0 && (
              <div className="space-y-4 mb-4">
                {form.variants.map(variant => {
                  const color = form.colors.find(c => c.id === variant.productColorId);
                  const size = form.sizes.find(s => s.id === variant.productSizeId);

                  return (
                    <div key={variant.id} className="rounded-lg border border-border p-4 bg-background space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {color && (
                            <div
                              className="w-4 h-4 rounded border border-border shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                          )}
                          <span className="text-sm font-semibold text-foreground">
                            {color?.nameEnglish || 'No Color'} {size ? `/ ${size.label}` : ''}
                          </span>
                          {variant.isDefault && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Default</span>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteDialog({
                            open: true,
                            type: 'variant',
                            id: variant.id,
                            name: `${color?.nameEnglish || 'Unknown'} - ${size?.label || 'Unknown'}`,
                          })}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Color Select */}
                        <FormField label="Color">
                          <Select
                            value={variant.productColorId}
                            onValueChange={(value) => updateVariant(variant.id, { productColorId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color..." />
                            </SelectTrigger>
                            <SelectContent>
                              {form.colors.filter(c => c.isActive).map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded border border-border"
                                      style={{ backgroundColor: c.hex }}
                                    />
                                    {c.nameEnglish}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Size Select */}
                        <FormField label="Size">
                          <Select
                            value={variant.productSizeId}
                            onValueChange={(value) => updateVariant(variant.id, { productSizeId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size..." />
                            </SelectTrigger>
                            <SelectContent>
                              {form.sizes.filter(s => s.isActive).map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Stock */}
                        <FormField label="Stock">
                          <Input
                            type="number"
                            min="0"
                            value={variant.stockQuantity || 0}
                            onChange={e => updateVariant(variant.id, {
                              stockQuantity: parseInt(e.target.value) || 0,
                              inStock: (parseInt(e.target.value) || 0) > 0,
                            })}
                          />
                        </FormField>

                        {/* Base Price KWD */}
                        <FormField label="Base Price KWD">
                          <Input
                            type="number"
                            step="0.001"
                            min="0"
                            value={variant.basePriceKWD ?? ''}
                            onChange={e => updateVariant(variant.id, {
                              basePriceKWD: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })}
                            placeholder="0.000"
                          />
                        </FormField>

                        {/* Compare Price KWD */}
                        <FormField label="Compare Price KWD">
                          <Input
                            type="number"
                            step="0.001"
                            min="0"
                            value={variant.compareAtPriceKWD ?? ''}
                            onChange={e => updateVariant(variant.id, {
                              compareAtPriceKWD: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })}
                            placeholder="0.000"
                          />
                        </FormField>

                        {/* Base Price INR */}
                        <FormField label="Base Price INR">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            value={variant.basePriceINR ?? ''}
                            onChange={e => updateVariant(variant.id, {
                              basePriceINR: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })}
                            placeholder="0"
                          />
                        </FormField>

                        {/* Compare Price INR */}
                        <FormField label="Compare Price INR">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            value={variant.compareAtPriceINR ?? ''}
                            onChange={e => updateVariant(variant.id, {
                              compareAtPriceINR: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })}
                            placeholder="0"
                          />
                        </FormField>

                        {/* Default Toggle */}
                        <div className="flex items-center gap-2 mt-6">
                          <Switch
                            checked={variant.isDefault || false}
                            onCheckedChange={v => {
                              if (v) {
                                // Unset default on all other variants
                                form.variants.forEach(otherV => {
                                  if (otherV.id !== variant.id && otherV.isDefault) {
                                    updateVariant(otherV.id, { isDefault: false });
                                  }
                                });
                              }
                              updateVariant(variant.id, { isDefault: v });
                            }}
                          />
                          <span className="text-sm text-muted-foreground">Default variant</span>
                        </div>
                      </div>

                      {/* Variant Image */}
                      <div>
                        <p className="text-xs font-medium text-foreground mb-2">Variant Image</p>
                        <div className="flex items-center gap-4">
                          {variant.imageUrl ? (
                            <div className="relative h-20 w-20 rounded-lg border border-border overflow-hidden bg-muted group">
                              <img src={variant.imageUrl} alt={color?.nameEnglish || 'Variant'} className="h-full w-full object-cover" />
                              <button
                                onClick={() => updateVariant(variant.id, { imageUrl: '', imageFile: undefined })}
                                className="absolute inset-0 bg-destructive/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                              <ImageIcon className="h-5 w-5 mb-0.5" />
                              <span className="text-[10px]">Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateVariant(variant.id, {
                                      imageUrl: URL.createObjectURL(file),
                                      imageFile: file,
                                    });
                                  }
                                }}
                              />
                            </label>
                          )}
                          <p className="text-xs text-muted-foreground">Upload an image for this variant. Used in storefront gallery when this color/size is selected.</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
{/* 
            {form.variants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground mb-4">
                <p>No variants created yet.</p>
                <p className="text-sm">Add colors and sizes in the Attributes tab first, then create variants here.</p>
              </div>
            )} */}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newVariant = {
                  id: crypto.randomUUID(),
                  productId: form.basic.id || '',
                  productColorId: form.colors.find(c => c.isActive)?.id || '',
                  productSizeId: form.sizes.find(s => s.isActive)?.id || '',
                  basePriceKWD: form.basic.base_price_kwd || 0,
                  compareAtPriceKWD: form.basic.compare_price_kwd || 0,
                  basePriceINR: form.basic.base_price_inr || 0,
                  compareAtPriceINR: form.basic.compare_price_inr || 0,
                  stockQuantity: 0,
                  inStock: false,
                  isDefault: form.variants.length === 0,
                  imageUrl: '',
                };
                addVariant(newVariant);
              }}
              disabled={form.colors.filter(c => c.isActive).length === 0 || form.sizes.filter(s => s.isActive).length === 0}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </Button>
            {(form.colors.filter(c => c.isActive).length === 0 || form.sizes.filter(s => s.isActive).length === 0) && (
              <p className="text-xs text-destructive mt-2">Please add at least one active color and one active size in the Attributes tab before adding variants.</p>
            )}
          </FormSection>
        </TabsContent>

        {/* MEDIA */}
        <TabsContent value="media" className="space-y-4 mt-4">
          <FormSection title="Product Media" description="Upload product images with alt text and status">
            <div className="space-y-4">
              {form.images.map((img) => (
                <div key={img.id} className="flex items-start gap-4 rounded-md border border-border p-4 bg-background">
                  <div className="group relative h-24 w-24 rounded-lg border border-border overflow-hidden bg-muted shrink-0">
                    <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover" />
                    {img.is_primary && (
                      <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">Primary</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <FormField label="Image Alt Text">
                      <Input
                        value={img.alt_text}
                        onChange={e => updateImage(img.id, { alt_text: e.target.value })}
                        placeholder="Describe the image for accessibility"
                      />
                    </FormField>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={img.isActive}
                            onCheckedChange={v => updateImage(img.id, { isActive: v })}
                          />
                          <span className="text-sm text-muted-foreground">{img.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={img.is_primary}
                            onCheckedChange={async (v) => {
                              if (v) {
                                // If setting as primary, unset all other primary images locally first
                                form.images.forEach(image => {
                                  if (image.id !== img.id && image.is_primary) {
                                    updateImage(image.id, { is_primary: false });
                                  }
                                });

                                // Update local state
                                updateImage(img.id, { is_primary: v });

                                // Immediately persist to backend if image has an ID (exists in database)
                                // New images (with file property) will be persisted during save
                                if (img.id && !img.file) {
                                  try {
                                    // Dynamic import to avoid circular dependencies
                                    const { productImageService } = await import('@/services');
                                    await productImageService.setAsPrimary(img.id);
                                  } catch (error) {
                                    console.error('Failed to set image as primary:', error);
                                    // Revert local state on error
                                    updateImage(img.id, { is_primary: false });
                                  }
                                }
                              } else {
                                updateImage(img.id, { is_primary: v });
                              }
                            }}
                          />
                          <span className="text-sm text-muted-foreground">{img.is_primary ? 'Primary' : 'Set as Primary'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'image',
                          id: img.id,
                          name: img.alt_text || 'this image',
                        })}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-sm">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((file, i) => {
                      addImage({
                        id: crypto.randomUUID(),
                        product_id: '',
                        url: URL.createObjectURL(file),
                        alt_text: '',
                        sort_order: form.images.length + i,
                        is_primary: form.images.length === 0 && i === 0,
                        isActive: true,
                        file,
                      });
                    });
                  }}
                />
              </label>
            </div>
          </FormSection>
        </TabsContent>

        {/* CONTENT */}
        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Full Description */}
          <FormSection title="Full Description" description="Main product description (English & Arabic)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Description (English)">
                <Textarea
                  value={form.details.descriptionEnglish || ''}
                  onChange={e => updateDetails('descriptionEnglish', e.target.value)}
                  rows={5}
                  placeholder="Enter full product description in English..."
                />
              </FormField>
              <FormField label="Description (Arabic)">
                <Textarea
                  value={form.details.descriptionArabic || ''}
                  onChange={e => updateDetails('descriptionArabic', e.target.value)}
                  rows={5}
                  placeholder="أدخل وصف المنتج الكامل بالعربية..."
                  dir="rtl"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Specifications with EN/AR */}
          <FormSection title="Specifications" description="Key-value specification rows (English & Arabic)">
            <div className="space-y-4 mb-4">
              {form.specifications.map((spec) => (
                <div key={spec.id} className="rounded-md border border-border p-4 bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Specification</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={spec.isActive}
                          onCheckedChange={v => updateSpecification(spec.id, { isActive: v })}
                        />
                        <span className="text-xs text-muted-foreground">{spec.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <button
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'specification',
                          id: spec.id,
                          name: spec.labelEnglish || 'this specification',
                        })}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={spec.labelEnglish}
                      onChange={e => updateSpecification(spec.id, { labelEnglish: e.target.value })}
                      placeholder="Label (English)"
                    />
                    <Input
                      value={spec.labelArabic}
                      onChange={e => updateSpecification(spec.id, { labelArabic: e.target.value })}
                      placeholder="التسمية (عربي)"
                      dir="rtl"
                    />
                    <Input
                      value={spec.valueEnglish}
                      onChange={e => updateSpecification(spec.id, { valueEnglish: e.target.value })}
                      placeholder="Value (English)"
                    />
                    <Input
                      value={spec.valueArabic}
                      onChange={e => updateSpecification(spec.id, { valueArabic: e.target.value })}
                      placeholder="القيمة (عربي)"
                      dir="rtl"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSpecification({
                id: crypto.randomUUID(),
                labelEnglish: '',
                labelArabic: '',
                valueEnglish: '',
                valueArabic: '',
                isActive: true
              })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Specification
            </Button>
          </FormSection>

          {/* Shipping & Returns */}
          <FormSection title="Shipping & Returns" description="Shipping policy and return details (English & Arabic)">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Shipping Info (English)">
                  <Textarea
                    value={form.details.shippingInfoEnglish || ''}
                    onChange={e => updateDetails('shippingInfoEnglish', e.target.value)}
                    rows={3}
                    placeholder="e.g. Free delivery on orders above KWD 20..."
                  />
                </FormField>
                <FormField label="Shipping Info (Arabic)">
                  <Textarea
                    value={form.details.shippingInfoArabic || ''}
                    onChange={e => updateDetails('shippingInfoArabic', e.target.value)}
                    rows={3}
                    placeholder="مثال: توصيل مجاني للطلبات فوق 20 دينار..."
                    dir="rtl"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Return Info (English)">
                  <Textarea
                    value={form.details.returnInfoEnglish || ''}
                    onChange={e => updateDetails('returnInfoEnglish', e.target.value)}
                    rows={3}
                    placeholder="e.g. Easy returns within 14 days..."
                  />
                </FormField>
                <FormField label="Return Info (Arabic)">
                  <Textarea
                    value={form.details.returnInfoArabic || ''}
                    onChange={e => updateDetails('returnInfoArabic', e.target.value)}
                    rows={3}
                    placeholder="مثال: إرجاع سهل خلال 14 يوم..."
                    dir="rtl"
                  />
                </FormField>
              </div>
            </div>
          </FormSection>

          {/* Care Instructions */}
          <FormSection title="Care Instructions" description="Add care instructions (English & Arabic)">
            <div className="space-y-4 mb-4">
              {form.careInstructions.map((instruction) => (
                <div key={instruction.id} className="rounded-md border border-border p-4 bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Care Instruction</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={instruction.isActive}
                          onCheckedChange={v => updateCareInstruction(instruction.id, { isActive: v })}
                        />
                        <span className="text-xs text-muted-foreground">{instruction.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <button
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'care',
                          id: instruction.id,
                          name: instruction.instructionEnglish || 'this care instruction',
                        })}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={instruction.instructionEnglish}
                      onChange={e => updateCareInstruction(instruction.id, { instructionEnglish: e.target.value })}
                      placeholder="Instruction (English)"
                    />
                    <Input
                      value={instruction.instructionArabic}
                      onChange={e => updateCareInstruction(instruction.id, { instructionArabic: e.target.value })}
                      placeholder="التعليمات (عربي)"
                      dir="rtl"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCareInstruction({
                id: crypto.randomUUID(),
                instructionEnglish: '',
                instructionArabic: '',
                isActive: true
              })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Care Instruction
            </Button>
          </FormSection>

          {/* Product Features - NEW SECTION */}
          {/* <FormSection title="Product Features" description="Add product features with icons (English & Arabic)">
            <div className="space-y-4 mb-4">
              {form.features.map((feature) => (
                <div key={feature.id} className="rounded-md border border-border p-4 bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Feature</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={feature.isActive}
                          onCheckedChange={v => updateFeature(feature.id, { isActive: v })}
                        />
                        <span className="text-xs text-muted-foreground">{feature.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <button
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'feature',
                          id: feature.id,
                          name: feature.labelEnglish || 'this feature',
                        })}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={feature.labelEnglish}
                      onChange={e => updateFeature(feature.id, { labelEnglish: e.target.value })}
                      placeholder="Label (English)"
                    />
                    <Input
                      value={feature.labelArabic}
                      onChange={e => updateFeature(feature.id, { labelArabic: e.target.value })}
                      placeholder="التسمية (عربي)"
                      dir="rtl"
                    />
                    <Input
                      value={feature.iconName}
                      onChange={e => updateFeature(feature.id, { iconName: e.target.value })}
                      placeholder="Icon name (e.g. shield, truck, star)"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addFeature({
                id: crypto.randomUUID(),
                labelEnglish: '',
                labelArabic: '',
                iconName: '',
                isActive: true
              })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Feature
            </Button>
          </FormSection> */}
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4 mt-4">
          <FormSection title="SEO Metadata" description="Search engine optimization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Meta Title">
                <Input value={form.seo.meta_title || ''} onChange={e => updateSeo('meta_title', e.target.value)} />
              </FormField>
              <FormField label="Canonical URL">
                <Input value={form.seo.canonical_url || ''} onChange={e => updateSeo('canonical_url', e.target.value)} />
              </FormField>
              <FormField label="Meta Keywords" className="md:col-span-2">
                <Input value={form.seo.meta_keywords || ''} onChange={e => updateSeo('meta_keywords', e.target.value)} placeholder="Comma-separated keywords" />
              </FormField>
              <FormField label="Meta Description" className="md:col-span-2">
                <Textarea value={form.seo.meta_description || ''} onChange={e => updateSeo('meta_description', e.target.value)} rows={2} />
              </FormField>
              <FormField label="OG Title">
                <Input value={form.seo.og_title || ''} onChange={e => updateSeo('og_title', e.target.value)} />
              </FormField>
              <FormField label="OG Image URL">
                <Input value={form.seo.og_image || ''} onChange={e => updateSeo('og_image', e.target.value)} />
              </FormField>
              <FormField label="OG Description" className="md:col-span-2">
                <Textarea value={form.seo.og_description || ''} onChange={e => updateSeo('og_description', e.target.value)} rows={2} />
              </FormField>
              <FormField label="Twitter Title">
                <Input value={form.seo.twitter_title || ''} onChange={e => updateSeo('twitter_title', e.target.value)} />
              </FormField>
              <FormField label="Twitter Description">
                <Input value={form.seo.twitter_description || ''} onChange={e => updateSeo('twitter_description', e.target.value)} />
              </FormField>
            </div>
            {/* {(form.seo.meta_title || form.basic.nameEnglish) && (
              <div className="mt-4 rounded-md border border-border p-4 bg-background">
                <p className="text-xs text-muted-foreground mb-2">Search Preview</p>
                <p className="text-[#1a0dab] text-base font-medium truncate">{form.seo.meta_title || form.basic.nameEnglish}</p>
                <p className="text-[#006621] text-xs truncate">{form.seo.canonical_url || `https://mayarshop.com/products/${form.basic.slug || ''}`}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{form.seo.meta_description || form.basic.shortDescriptionEnglish || ''}</p>
              </div>
            )} */}
          </FormSection>
        </TabsContent>
      </Tabs>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="text-sm text-muted-foreground">
          Status: <span className="font-medium text-foreground capitalize">{form.basic.status || 'draft'}</span>
        </div>
        <div className="flex gap-2">
          {viewOnly ? (
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
          ) : (
            <>
              {onSaveDraft && (
                <Button variant="outline" size="sm" onClick={onSaveDraft} disabled={isSavingDraft || isPublishing}>
                  {isSavingDraft ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Draft'}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onPreview} disabled={isSavingDraft || isPublishing}>
                <Eye className="h-4 w-4 mr-1" /> Preview
              </Button>
              {onPublish && (
                <Button size="sm" onClick={onPublish} disabled={isSavingDraft || isPublishing}>
                  {isPublishing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Product'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, type: null, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDialog.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
