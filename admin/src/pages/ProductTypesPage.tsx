import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService } from '@/services/middleCategoryService';
import { bottomCategoryService } from '@/services/bottomCategoryService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import type { TopCategory, MiddleCategory, BottomCategory } from '@/types';

interface FormState {
  topCategoryId: string;
  middleCategoryId: string;
  titleEnglish: string;
  titleArabic: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm: FormState = {
  topCategoryId: '',
  middleCategoryId: '',
  titleEnglish: '',
  titleArabic: '',
  slug: '',
  displayOrder: 0,
  isActive: true,
};

export default function ProductTypesPage() {
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [middleCategories, setMiddleCategories] = useState<MiddleCategory[]>([]);
  const [bottomCategories, setBottomCategories] = useState<BottomCategory[]>([]);
  const [catFilter, setCatFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BottomCategory | null>(null);

  const load = async () => {
    try {
      const [tops, middles, bottoms] = await Promise.all([
        topCategoryService.getAll(),
        middleCategoryService.getAll(),
        bottomCategoryService.getAll(),
      ]);
      setTopCategories(tops);
      setMiddleCategories(middles);
      setBottomCategories(bottoms);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter middle categories based on selected top category filter
  const filteredMiddleCategories = catFilter === 'all'
    ? middleCategories
    : middleCategories.filter(m => m.topCategoryId === catFilter);

  // Filter bottom categories based on filters
  const filtered = bottomCategories.filter(bc => {
    if (subFilter !== 'all') return bc.middleCategoryId === subFilter;
    if (catFilter !== 'all') return bc.topCategoryId === catFilter;
    return true;
  });

  // Get names for display
  const getTopCategoryName = (id: string) => {
    const cat = topCategories.find(c => c.id === id);
    return cat?.titleEnglish || '';
  };

  const getMiddleCategoryName = (id: string) => {
    const cat = middleCategories.find(c => c.id === id);
    return cat?.titleEnglish || '';
  };

  // Filter middle categories in form based on selected top category
  const formMiddleCategories = form.topCategoryId
    ? middleCategories.filter(m => m.topCategoryId === form.topCategoryId)
    : middleCategories;

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (bc: BottomCategory) => {
    setEditId(bc.id);
    setForm({
      topCategoryId: bc.topCategoryId,
      middleCategoryId: bc.middleCategoryId,
      titleEnglish: bc.titleEnglish || '',
      titleArabic: bc.titleArabic || '',
      slug: bc.slug || '',
      displayOrder: bc.displayOrder || 0,
      isActive: bc.isActive,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.titleEnglish.trim() || !form.titleArabic.trim()) {
      toast.error('Title English and Title Arabic are required');
      return;
    }
    if (!form.topCategoryId || !form.middleCategoryId) {
      toast.error('Category and SubCategory are required');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        const success = await bottomCategoryService.update(editId, {
          topCategoryId: form.topCategoryId,
          middleCategoryId: form.middleCategoryId,
          titleEnglish: form.titleEnglish,
          titleArabic: form.titleArabic,
          slug: form.slug,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        });
        if (success) {
          toast.success('Product type updated');
        } else {
          toast.error('Failed to update product type');
        }
      } else {
        await bottomCategoryService.create({
          topCategoryId: form.topCategoryId,
          middleCategoryId: form.middleCategoryId,
          titleEnglish: form.titleEnglish,
          titleArabic: form.titleArabic,
        });
        toast.success('Product type created');
      }
      setOpen(false);
      load();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const success = await bottomCategoryService.toggleStatus(id);
      if (success) {
        toast.success('Status toggled successfully');
        load();
      } else {
        toast.error('Failed to toggle status');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const openDeleteDialog = (bc: BottomCategory) => {
    setDeleteTarget(bc);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const success = await bottomCategoryService.delete(deleteTarget.id);
      if (success) {
        toast.success('Product type deleted successfully');
        load();
      } else {
        toast.error('Failed to delete product type');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Product Types</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage product types (bottom level categories)</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={catFilter} onValueChange={v => { setCatFilter(v); setSubFilter('all'); }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {topCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subFilter} onValueChange={setSubFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="SubCategory" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SubCategories</SelectItem>
                {filteredMiddleCategories.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.titleEnglish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Product Type</Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title English</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title Arabic</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">SubCategory</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(bc => (
                <tr key={bc.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{bc.titleEnglish}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{bc.titleArabic}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{getTopCategoryName(bc.topCategoryId)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{getMiddleCategoryName(bc.middleCategoryId)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{bc.slug}</td>
                  <td className="px-6 py-4">
                    <Badge variant={bc.isActive ? 'default' : 'secondary'} className="text-xs">
                      {bc.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(bc)} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleStatus(bc.id)}
                        title={bc.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {bc.isActive ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(bc)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">No product types found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Product Type' : 'Add Product Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select
                value={form.topCategoryId}
                onValueChange={v => setForm(f => ({ ...f, topCategoryId: v, middleCategoryId: '' }))}
              >
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {topCategories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>SubCategory <span className="text-destructive">*</span></Label>
              <Select
                value={form.middleCategoryId}
                onValueChange={v => setForm(f => ({ ...f, middleCategoryId: v }))}
                disabled={!form.topCategoryId}
              >
                <SelectTrigger><SelectValue placeholder={form.topCategoryId ? "Select subcategory" : "Select category first"} /></SelectTrigger>
                <SelectContent>
                  {formMiddleCategories.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.titleEnglish}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Title English <span className="text-destructive">*</span></Label>
              <Input
                value={form.titleEnglish}
                onChange={e => setForm(f => ({ ...f, titleEnglish: e.target.value }))}
                placeholder="e.g. T-Shirt"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Title Arabic <span className="text-destructive">*</span></Label>
              <Input
                value={form.titleArabic}
                onChange={e => setForm(f => ({ ...f, titleArabic: e.target.value }))}
                placeholder="e.g. تي شيرت"
                dir="rtl"
              />
            </div>
            {editId && (
              <>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="auto-generated-slug"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={form.isActive ? 'active' : 'inactive'}
                    onValueChange={v => setForm(f => ({ ...f, isActive: v === 'active' }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product type "{deleteTarget?.titleEnglish}".
              This action cannot be undone.
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
    </AdminLayout>
  );
}
