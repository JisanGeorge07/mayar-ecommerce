import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateSlug } from '@/utils/slug';
import type { TopCategory } from '@/types';
import { TopCategoryCreateInput, topCategoryService, TopCategoryUpdateInput } from '@/services/topCategoryService';

const emptyForm = {
  titleEnglish: '',
  titleArabic: '',
  slug: '',
  isActive: 'active' as 'active' | 'inactive', // UI only
  displayOrder: 0,
  badgeEnglish: '',
  badgeArabic: ''
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const data = await topCategoryService.getAll();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (cat: TopCategory) => {
    setEditId(cat.id);
    setForm({
      titleEnglish: cat.titleEnglish,
      titleArabic: cat.titleArabic,
      slug: cat.slug,
      isActive: cat.isActive ? 'active' : 'inactive', // ✅ FIX
      displayOrder: cat.displayOrder || 0,
      badgeEnglish: cat.badgeEnglish || '',
      badgeArabic: cat.badgeArabic || ''
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.titleEnglish.trim()) {
      toast.error('Name is required');
      return;
    }

    const slug = form.slug || generateSlug(form.titleEnglish);

    try {
      if (editId) {
        const input: TopCategoryUpdateInput = {
          titleEnglish: form.titleEnglish,
          titleArabic: form.titleArabic,
          badgeEnglish: form.badgeEnglish || undefined,
          badgeArabic: form.badgeArabic || undefined,
          slug: slug,
          displayOrder: form.displayOrder,
          isActive: form.isActive === 'active', // ✅ FIX
        };

        await topCategoryService.update(editId, input);
        toast.success('Category updated');
      } else {
        const input: TopCategoryCreateInput = {
          titleEnglish: form.titleEnglish,
          titleArabic: form.titleArabic,
          badgeEnglish: form.badgeEnglish || undefined,
          badgeArabic: form.badgeArabic || undefined,
          slug: slug,
          displayOrder: form.displayOrder,
          isActive: form.isActive === 'active', // ✅ FIX
        };

        await topCategoryService.create(input);
        toast.success('Category created');
      }

      setOpen(false);
      load();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await topCategoryService.toggleStatus(id);
      toast.success('Category status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await topCategoryService.delete(id);
      toast.success('Category deleted');
      load();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage product categories</p>
          </div>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name (AR)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{cat.titleEnglish}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{cat.titleArabic}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <Badge variant={cat.isActive ? 'default' : 'secondary'} className="capitalize text-xs">
                      {cat.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {cat.isActive && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeactivate(cat.id)}>
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2"> 
            <div className="space-y-1.5">
              <Label>Category Name(EN)</Label>
              <Input value={form.titleEnglish} onChange={e => setForm(f => ({ ...f, titleEnglish: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="e.g. Women" />
            </div>
            <div className="space-y-1.5">
              <Label>Category Name(AR)</Label>
              <Input value={form.titleArabic} onChange={e => setForm(f => ({ ...f, titleArabic: e.target.value }))} placeholder="e.g. نحيف" dir='rtl' />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.isActive} onValueChange={v => setForm(f => ({ ...f, isActive: v as 'active' | 'inactive' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Badge(EN)<span className="text-muted-foreground"> (optional)</span></Label>
              <Input value={form.badgeEnglish} onChange={e => setForm(f => ({ ...f, badgeEnglish: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Badge(AR)<span className="text-muted-foreground"> (optional)</span></Label>
              <Input value={form.badgeArabic} onChange={e => setForm(f => ({ ...f, badgeArabic: e.target.value }))} dir='rtl' />
            </div>
            <div className="space-y-1.5">
              <Label>Display Order <span className="text-muted-foreground">(optional)</span></Label>
              <Input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}