import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService } from '@/services/middleCategoryService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { generateSlug } from '@/utils/slug';
import type { TopCategory, MiddleCategory } from '@/types';

const emptyForm = {
  category_id: '',
  nameEnglish: '',
  nameArabic: '',
  slug: '',
  status: 'active' as 'active' | 'inactive',
  display_order: 0,
};

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MiddleCategory[]>([]);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const [cats, subs] = await Promise.all([
        topCategoryService.getAll(),
        middleCategoryService.getAll(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? subcategories
    : subcategories.filter(s => s.topCategoryId === filter);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (sub: MiddleCategory) => {
    setEditId(sub.id);
    setForm({
      category_id: sub.topCategoryId,
      nameEnglish: sub.titleEnglish,
      nameArabic: sub.titleArabic,
      slug: sub.slug || '',
      status: sub.isActive ? 'active' : 'inactive',
      display_order: sub.displayOrder || 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nameEnglish.trim() || !form.nameArabic.trim() || !form.category_id) {
      toast.error('Name and category are required');
      return;
    }

    const slug = form.slug || generateSlug(form.nameEnglish);

    try {
      if (editId) {
        await middleCategoryService.update(editId, {
          topCategoryId: form.category_id,
          titleEnglish: form.nameEnglish,
          titleArabic: form.nameArabic,
          slug,
          displayOrder: form.display_order,
          isActive: form.status === 'active',
        });
        toast.success('Subcategory updated');
      } else {
        await middleCategoryService.create({
          topCategoryId: form.category_id,
          titleEnglish: form.nameEnglish,
          titleArabic: form.nameArabic,
          slug,
          displayOrder: form.display_order,
          isActive: form.status === 'active',
        });
        toast.success('Subcategory created');
      }

      setOpen(false);
      load();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await middleCategoryService.toggleStatus(id);
      toast.success('Subcategory deactivated');
      load();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Subcategories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage product subcategories</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Subcategory
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name (AR)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map(sub => {
                const cat = categories.find(c => c.id === sub.topCategoryId);
                return (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{sub.titleEnglish}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{sub.titleArabic}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{cat?.titleEnglish || ''}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{sub.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant={sub.isActive ? 'default' : 'secondary'} className="capitalize text-xs">
                        {sub.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(sub)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {sub.isActive && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeactivate(sub.id)}>
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Parent Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Sub Category Name (EN)</Label>
              <Input value={form.nameEnglish} onChange={e => setForm(f => ({ ...f, nameEnglish: e.target.value, slug: generateSlug(e.target.value) }))} placeholder='e.g. Dresses'/>
            </div>

            <div className="space-y-1.5">
              <Label>Sub Category Name (AR)</Label>
              <Input value={form.nameArabic} onChange={e => setForm(f => ({ ...f, nameArabic: e.target.value }))} dir='rtl' placeholder='e.g. فساتين'/>
            </div>

            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))} />
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