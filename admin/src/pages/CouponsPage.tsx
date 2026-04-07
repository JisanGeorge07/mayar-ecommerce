/**
 * STOREFRONT INTEGRATION:
 * Coupons with showInCartSuggestions = true will appear in the
 * cart page hint: "Try: MAYAR10, WELCOME20, VIP15"
 * sorted by displayOrder ASC.
 *
 * When backend is connected, the cart promo code input will call:
 * POST /api/coupons/validate  { code, cartTotal, customerId }
 * Response: { valid, discountType, discountValue, maxCap, message }
 *
 * Discount calculation logic (to implement in storefront):
 * - percentage: discount = Math.min(cartTotal * value/100, maxCap ?? Infinity)
 * - fixed: discount = Math.min(value, cartTotal)
 * - free_shipping: discount = shippingCost
 */

import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from 'sonner';
import { couponService } from '@/services/couponService';
import {
  Ticket, Plus, Search, X, Pencil, Trash2, Copy, Check,
  ToggleLeft, ToggleRight, RefreshCw, ChevronDown, Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Coupon, DiscountType, CouponScope, CouponStatus } from '@/types/coupon';

const CATEGORY_OPTIONS = ['Women', 'Men', 'Kids', 'Accessories', 'Home'];

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getStatus(c: Coupon): CouponStatus {
  if (c.status === 'inactive') return 'inactive';
  const now = Date.now();
  if (c.startDate && new Date(c.startDate).getTime() > now) return 'scheduled';
  if (c.endDate && new Date(c.endDate).getTime() < now) return 'expired';
  return 'active';
}

function statusBadge(s: CouponStatus) {
  const map: Record<CouponStatus, { label: string; cls: string }> = {
    active: { label: 'Active', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    inactive: { label: 'Inactive', cls: 'bg-muted text-muted-foreground border-border' },
    expired: { label: 'Expired', cls: 'bg-red-100 text-red-700 border-red-200' },
    scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  };
  const m = map[s];
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', m.cls)}>{m.label}</span>;
}

function typeBadge(t: DiscountType) {
  if (t === 'percentage') return <Badge variant="outline" className="text-xs">%</Badge>;
  if (t === 'fixed') return <Badge variant="outline" className="text-xs">KWD</Badge>;
  return <Badge variant="outline" className="text-xs">🚚</Badge>;
}

const emptyForm = (): Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'> => ({
  code: '', nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
  discountType: 'percentage', discountValue: 10, minOrderAmount: 0,
  firstOrderOnly: false, scope: 'all', status: 'active',
  showInCartSuggestions: false, displayOrder: 1,
});

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterScope, setFilterScope] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [unlimitedTotal, setUnlimitedTotal] = useState(true);
  const [unlimitedPerCustomer, setUnlimitedPerCustomer] = useState(true);
  const [noExpiry, setNoExpiry] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      const s = getStatus(c);
      if (search) {
        const q = search.toLowerCase();
        if (!c.code.toLowerCase().includes(q) && !c.nameEn.toLowerCase().includes(q)) return false;
      }
      if (filterStatus !== 'all' && s !== filterStatus) return false;
      if (filterType !== 'all' && c.discountType !== filterType) return false;
      if (filterScope !== 'all' && c.scope !== filterScope) return false;
      return true;
    });
  }, [coupons, search, filterStatus, filterType, filterScope]);

  const stats = useMemo(() => {
    const active = coupons.filter(c => getStatus(c) === 'active').length;
    const redemptions = coupons.reduce((s, c) => s + c.usedCount, 0);
    const totalDiscount = coupons.reduce((s, c) => {
      if (c.discountType === 'fixed') return s + c.usedCount * c.discountValue;
      if (c.discountType === 'percentage') return s + c.usedCount * (c.discountValue / 100) * 25;
      return s;
    }, 0);
    return { total: coupons.length, active, redemptions, totalDiscount };
  }, [coupons]);

  // Load coupons from API
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setUnlimitedTotal(true);
    setUnlimitedPerCustomer(true);
    setNoExpiry(true);
    setSheetOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingId(c.id);
    setForm({
      code: c.code, nameEn: c.nameEn, nameAr: c.nameAr,
      descriptionEn: c.descriptionEn || '', descriptionAr: c.descriptionAr || '',
      discountType: c.discountType, discountValue: c.discountValue,
      maxDiscountCap: c.maxDiscountCap, minOrderAmount: c.minOrderAmount,
      usageLimit: c.usageLimit, usageLimitPerCustomer: c.usageLimitPerCustomer,
      firstOrderOnly: c.firstOrderOnly, scope: c.scope,
      scopeCategories: c.scopeCategories, scopeProducts: c.scopeProducts,
      status: c.status, startDate: c.startDate, endDate: c.endDate,
      showInCartSuggestions: c.showInCartSuggestions, displayOrder: c.displayOrder,
    });
    setUnlimitedTotal(!c.usageLimit);
    setUnlimitedPerCustomer(!c.usageLimitPerCustomer);
    setNoExpiry(!c.endDate);
    setSheetOpen(true);
  };

  const saveCoupon = async (asDraft: boolean) => {
    if (!form.code || !form.nameEn) {
      toast.error('Code and Name (EN) are required');
      return;
    }

    setLoading(true);
    try {
      const status: CouponStatus = asDraft ? 'inactive' : (form.status as CouponStatus) || 'active';
      const couponData = {
        ...form,
        status,
        usageLimit: unlimitedTotal ? undefined : form.usageLimit,
        usageLimitPerCustomer: unlimitedPerCustomer ? undefined : form.usageLimitPerCustomer,
        endDate: noExpiry ? undefined : form.endDate,
      };

      if (editingId) {
        await couponService.updateCoupon(editingId, couponData);
        toast.success('Coupon updated');
      } else {
        await couponService.createCoupon(couponData);
        toast.success(`Coupon ${form.code} created successfully`);
      }

      setSheetOpen(false);
      await loadCoupons(); // Reload coupons
    } catch (error: any) {
      console.error('Failed to save coupon:', error);
      toast.error(error?.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const success = await couponService.toggleCouponStatus(id);
      if (success) {
        await loadCoupons(); // Reload to get updated data
        toast.success('Coupon status updated');
      } else {
        toast.error('Failed to update coupon status');
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const deleteCoupon = async () => {
    if (!deleteId) return;

    try {
      const success = await couponService.deleteCoupon(deleteId);
      if (success) {
        await loadCoupons(); // Reload coupons
        toast.success('🗑️ Coupon deleted');
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setDeleteId(null);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Code copied!');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setFilterType('all');
    setFilterScope('all');
  };

  const updateForm = (patch: Partial<typeof form>) => setForm(prev => ({ ...prev, ...patch }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Ticket className="h-6 w-6 text-primary" /> Coupons &amp; Promo Codes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage discount codes shown in the storefront cart
            </p>
          </div>
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Create Coupon
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Coupons', value: stats.total },
            { label: 'Active Coupons', value: stats.active },
            { label: 'Total Redemptions', value: stats.redemptions },
            { label: 'Total Discount Given', value: `KWD ${stats.totalDiscount.toFixed(3)}` },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search coupon code or name..." className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
              <SelectItem value="free_shipping">Free Shipping</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterScope} onValueChange={setFilterScope}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Applies To" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="categories">Specific Category</SelectItem>
              <SelectItem value="products">Specific Product</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={clearFilters}><X className="mr-1 h-3 w-3" /> Clear</Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Code', 'Name (EN)', 'Type', 'Value', 'Min Order', 'Usage', 'Valid Period', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading coupons...
                </td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No coupons found</td></tr>
              )}
              {!loading && filtered.map(c => {
                const s = getStatus(c);
                const usageText = c.usageLimit ? `${c.usedCount} / ${c.usageLimit}` : `${c.usedCount} / ∞`;
                const usagePct = c.usageLimit ? Math.min((c.usedCount / c.usageLimit) * 100, 100) : 0;
                return (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold tracking-widest text-xs bg-muted px-2 py-1 rounded">{c.code}</span>
                        <button onClick={() => copyCode(c.code, c.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                          {copiedId === c.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{c.nameEn}</td>
                    <td className="px-4 py-3">{typeBadge(c.discountType)}</td>
                    <td className="px-4 py-3 font-medium">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : c.discountType === 'fixed' ? `KWD ${c.discountValue.toFixed(3)}` : '—'}
                    </td>
                    <td className="px-4 py-3">{c.minOrderAmount > 0 ? `KWD ${c.minOrderAmount.toFixed(3)}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">{usageText}</span>
                      {c.usageLimit && (
                        <div className="mt-1 h-1 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePct}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {c.startDate && c.endDate
                        ? `${format(new Date(c.startDate), 'MMM d')} → ${format(new Date(c.endDate), 'MMM d, yyyy')}`
                        : 'No Expiry'}
                    </td>
                    <td className="px-4 py-3">{statusBadge(s)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => toggleStatus(c.id)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          {c.status === 'active' ? <ToggleRight className="h-3.5 w-3.5 text-emerald-600" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-destructive/70 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The coupon will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCoupon} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Coupon' : 'Create Coupon'}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Update coupon details below.' : 'Fill in the details to create a new coupon.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Basic Info</h3>
              <div>
                <Label className="text-xs">Coupon Code *</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={form.code} onChange={e => updateForm({ code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER25" className="font-mono tracking-widest" />
                  <Button variant="outline" size="sm" type="button"
                    onClick={() => updateForm({ code: generateCode() })}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="en">
                <TabsList className="h-8">
                  <TabsTrigger value="en" className="text-xs px-3">English</TabsTrigger>
                  <TabsTrigger value="ar" className="text-xs px-3">العربية</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs">Name (EN) *</Label>
                    <Input value={form.nameEn} onChange={e => updateForm({ nameEn: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Description (EN)</Label>
                    <textarea value={form.descriptionEn} onChange={e => updateForm({ descriptionEn: e.target.value })}
                      rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </TabsContent>
                <TabsContent value="ar" className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs">Name (AR) *</Label>
                    <Input value={form.nameAr} onChange={e => updateForm({ nameAr: e.target.value })} dir="rtl" className="mt-1 text-right" />
                  </div>
                  <div>
                    <Label className="text-xs">Description (AR)</Label>
                    <textarea value={form.descriptionAr} onChange={e => updateForm({ descriptionAr: e.target.value })}
                      rows={3} dir="rtl" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Discount Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Discount Type &amp; Value</h3>
              <RadioGroup value={form.discountType} onValueChange={v => updateForm({ discountType: v as DiscountType })} className="space-y-2">
                {[
                  { value: 'percentage', label: 'Percentage Off (%)' },
                  { value: 'fixed', label: 'Fixed Amount Off (KWD)' },
                  { value: 'free_shipping', label: 'Free Shipping' },
                ].map(o => (
                  <div key={o.value} className="flex items-center gap-2">
                    <RadioGroupItem value={o.value} id={`dt-${o.value}`} />
                    <Label htmlFor={`dt-${o.value}`} className="text-sm">{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {form.discountType !== 'free_shipping' && (
                <div>
                  <Label className="text-xs">{form.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (KWD)'}</Label>
                  <Input type="number" value={form.discountValue} onChange={e => updateForm({ discountValue: Number(e.target.value) })}
                    className="mt-1 w-32" min={0} max={form.discountType === 'percentage' ? 100 : undefined} />
                </div>
              )}
              {form.discountType === 'percentage' && (
                <div>
                  <Label className="text-xs">Maximum Discount Cap (KWD)</Label>
                  <Input type="number" value={form.maxDiscountCap ?? ''} onChange={e => updateForm({ maxDiscountCap: e.target.value ? Number(e.target.value) : undefined })}
                    className="mt-1 w-40" placeholder="Optional" min={0} step={0.001} />
                  <p className="mt-1 text-[11px] text-muted-foreground">e.g. Cap 10% discount at max KWD 5.000</p>
                </div>
              )}
            </div>

            {/* Usage Conditions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Usage Conditions</h3>
              <div>
                <Label className="text-xs">Minimum Order Amount (KWD)</Label>
                <Input type="number" value={form.minOrderAmount} onChange={e => updateForm({ minOrderAmount: Number(e.target.value) })}
                  className="mt-1 w-40" min={0} step={0.001} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Usage Limit (Total)</Label>
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={unlimitedTotal} onCheckedChange={v => setUnlimitedTotal(!!v)} id="ul-total" />
                    <Label htmlFor="ul-total" className="text-xs text-muted-foreground">Unlimited</Label>
                  </div>
                </div>
                {!unlimitedTotal && (
                  <Input type="number" value={form.usageLimit ?? ''} onChange={e => updateForm({ usageLimit: Number(e.target.value) })}
                    className="mt-1 w-32" min={1} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Usage Limit Per Customer</Label>
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={unlimitedPerCustomer} onCheckedChange={v => setUnlimitedPerCustomer(!!v)} id="ul-cust" />
                    <Label htmlFor="ul-cust" className="text-xs text-muted-foreground">Unlimited</Label>
                  </div>
                </div>
                {!unlimitedPerCustomer && (
                  <Input type="number" value={form.usageLimitPerCustomer ?? ''} onChange={e => updateForm({ usageLimitPerCustomer: Number(e.target.value) })}
                    className="mt-1 w-32" min={1} />
                )}
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.firstOrderOnly} onCheckedChange={v => updateForm({ firstOrderOnly: v })} />
                <Label className="text-sm">First Order Only</Label>
              </div>
            </div>

            {/* Applies To */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Applies To</h3>
              <RadioGroup value={form.scope} onValueChange={v => updateForm({ scope: v as CouponScope })} className="space-y-2">
                {[
                  { value: 'all', label: 'All Products' },
                  { value: 'categories', label: 'Specific Categories' },
                  { value: 'products', label: 'Specific Products' },
                ].map(o => (
                  <div key={o.value} className="flex items-center gap-2">
                    <RadioGroupItem value={o.value} id={`sc-${o.value}`} />
                    <Label htmlFor={`sc-${o.value}`} className="text-sm">{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {form.scope === 'categories' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORY_OPTIONS.map(cat => (
                    <button key={cat} type="button"
                      onClick={() => {
                        const cur = form.scopeCategories || [];
                        updateForm({ scopeCategories: cur.includes(cat) ? cur.filter(c => c !== cat) : [...cur, cat] });
                      }}
                      className={cn('px-3 py-1 rounded-full border text-xs font-medium transition-colors',
                        (form.scopeCategories || []).includes(cat) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-muted')}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              {form.scope === 'products' && (
                <Input placeholder="Search products..." className="mt-2" />
              )}
            </div>

            {/* Validity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Validity Period</h3>
              <div className="flex items-center gap-3">
                <Switch checked={form.status === 'active'} onCheckedChange={v => updateForm({ status: v ? 'active' : 'inactive' })} />
                <Label className="text-sm">{form.status === 'active' ? 'Active' : 'Inactive'}</Label>
              </div>
              <div>
                <Label className="text-xs">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('mt-1 w-48 justify-start text-left font-normal', !form.startDate && 'text-muted-foreground')}>
                      {form.startDate ? format(new Date(form.startDate), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.startDate ? new Date(form.startDate) : undefined}
                      onSelect={d => updateForm({ startDate: d?.toISOString() })}
                      className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">End Date</Label>
                  <div className="flex items-center gap-1.5">
                    <Checkbox checked={noExpiry} onCheckedChange={v => { setNoExpiry(!!v); if (v) updateForm({ endDate: undefined }); }} id="no-exp" />
                    <Label htmlFor="no-exp" className="text-xs text-muted-foreground">No Expiry</Label>
                  </div>
                </div>
                {!noExpiry && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('mt-1 w-48 justify-start text-left font-normal', !form.endDate && 'text-muted-foreground')}>
                        {form.endDate ? format(new Date(form.endDate), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={form.endDate ? new Date(form.endDate) : undefined}
                        onSelect={d => updateForm({ endDate: d?.toISOString() })}
                        className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            {/* Storefront Display */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Display on Storefront</h3>
              <div className="flex items-center gap-3">
                <Switch checked={form.showInCartSuggestions} onCheckedChange={v => updateForm({ showInCartSuggestions: v })} />
                <Label className="text-sm">Show in Cart Suggestions</Label>
              </div>
              <div>
                <Label className="text-xs">Display Order</Label>
                <Input type="number" value={form.displayOrder} onChange={e => updateForm({ displayOrder: Number(e.target.value) })}
                  className="mt-1 w-24" min={1} />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => saveCoupon(true)} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save as Draft
            </Button>
            <Button onClick={() => saveCoupon(false)} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingId ? 'Update Coupon' : 'Publish Coupon'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
