import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { topCategoryService, TopCategoryCreateInput, TopCategoryUpdateInput } from '@/services/topCategoryService';
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
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { TopCategory } from '@/types';

interface CreateFormState {
  titleEnglish: string;
  titleArabic: string;
  imageFile: File | null;
  imageAlt: string;
  badgeEnglish: string;
  badgeArabic: string;
}

interface EditFormState extends CreateFormState {
  slug: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl: string;
}

const emptyCreateForm: CreateFormState = {
  titleEnglish: '',
  titleArabic: '',
  imageFile: null,
  imageAlt: '',
  badgeEnglish: '',
  badgeArabic: '',
};

const emptyEditForm: EditFormState = {
  ...emptyCreateForm,
  slug: '',
  displayOrder: 0,
  isActive: true,
  imageUrl: '',
};

export default function TopCategoriesPage() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await topCategoryService.getAll();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setCreateForm(emptyCreateForm);
    setImagePreview(null);
    setCreateOpen(true);
  };

  const openEdit = (cat: TopCategory) => {
    setEditId(cat.id);
    setEditForm({
      titleEnglish: cat.titleEnglish || '',
      titleArabic: cat.titleArabic || '',
      imageFile: null,
      imageUrl: cat.imageUrl || '',
      imageAlt: cat.imageAlt || '',
      badgeEnglish: cat.badgeEnglish || '',
      badgeArabic: cat.badgeArabic || '',
      slug: cat.slug || '',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive,
    });
    setImagePreview(cat.imageUrl || null);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCreateForm(f => ({ ...f, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm(f => ({ ...f, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!createForm.titleEnglish.trim() || !createForm.titleArabic.trim()) {
      toast.error('Title (English) and Title (Arabic) are required');
      return;
    }

    try {
      const input: TopCategoryCreateInput = {
        titleEnglish: createForm.titleEnglish,
        titleArabic: createForm.titleArabic,
        imageFile: createForm.imageFile || undefined,
        imageAlt: createForm.imageAlt || undefined,
        badgeEnglish: createForm.badgeEnglish || undefined,
        badgeArabic: createForm.badgeArabic || undefined,
      };
      await topCategoryService.create(input);
      toast.success('Category created successfully');
      setCreateOpen(false);
      load();
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    if (!editForm.titleEnglish.trim() || !editForm.titleArabic.trim()) {
      toast.error('Title (English) and Title (Arabic) are required');
      return;
    }

    try {
      const input: TopCategoryUpdateInput = {
        titleEnglish: editForm.titleEnglish,
        titleArabic: editForm.titleArabic,
        imageFile: editForm.imageFile || undefined,
        imageUrl: editForm.imageUrl || undefined,
        imageAlt: editForm.imageAlt || undefined,
        badgeEnglish: editForm.badgeEnglish || undefined,
        badgeArabic: editForm.badgeArabic || undefined,
        slug: editForm.slug || undefined,
        displayOrder: editForm.displayOrder,
        isActive: editForm.isActive,
      };
      const success = await topCategoryService.update(editId, input);
      if (success) {
        toast.success('Category updated successfully');
        setEditOpen(false);
        load();
      } else {
        toast.error('Failed to update category');
      }
    } catch (err) {
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const success = await topCategoryService.delete(deleteId);
      if (success) {
        toast.success('Category deleted successfully');
        load();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      toast.error('Failed to delete category');
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const success = await topCategoryService.toggleStatus(id);
      if (success) {
        toast.success('Category status updated');
        load();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Top Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage top-level product categories</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title (EN)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title (AR)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge (EN)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge (AR)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No categories found. Create your first category.
                  </td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.imageAlt || cat.titleEnglish || 'Category'}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{cat.titleEnglish || '-'}</td>
                    <td className="px-4 py-3 text-sm text-foreground" dir="rtl">{cat.titleArabic || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{cat.badgeEnglish || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground" dir="rtl">{cat.badgeArabic || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cat.isActive ? 'default' : 'secondary'} className="capitalize text-xs">
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(cat)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(cat.id)}
                          title={cat.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {cat.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDelete(cat.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Top Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title (English) <span className="text-destructive">*</span></Label>
                <Input
                  value={createForm.titleEnglish}
                  onChange={e => setCreateForm(f => ({ ...f, titleEnglish: e.target.value }))}
                  placeholder="e.g. Women"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Title (Arabic) <span className="text-destructive">*</span></Label>
                <Input
                  value={createForm.titleArabic}
                  onChange={e => setCreateForm(f => ({ ...f, titleArabic: e.target.value }))}
                  placeholder="e.g. نساء"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCreateImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Image Alt Text</Label>
              <Input
                value={createForm.imageAlt}
                onChange={e => setCreateForm(f => ({ ...f, imageAlt: e.target.value }))}
                placeholder="Description for accessibility"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Badge (English)</Label>
                <Input
                  value={createForm.badgeEnglish}
                  onChange={e => setCreateForm(f => ({ ...f, badgeEnglish: e.target.value }))}
                  placeholder="e.g. New"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Badge (Arabic)</Label>
                <Input
                  value={createForm.badgeArabic}
                  onChange={e => setCreateForm(f => ({ ...f, badgeArabic: e.target.value }))}
                  placeholder="e.g. جديد"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Top Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title (English) <span className="text-destructive">*</span></Label>
                <Input
                  value={editForm.titleEnglish}
                  onChange={e => setEditForm(f => ({ ...f, titleEnglish: e.target.value }))}
                  placeholder="e.g. Women"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Title (Arabic) <span className="text-destructive">*</span></Label>
                <Input
                  value={editForm.titleArabic}
                  onChange={e => setEditForm(f => ({ ...f, titleArabic: e.target.value }))}
                  placeholder="e.g. نساء"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Image Alt Text</Label>
              <Input
                value={editForm.imageAlt}
                onChange={e => setEditForm(f => ({ ...f, imageAlt: e.target.value }))}
                placeholder="Description for accessibility"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Badge (English)</Label>
                <Input
                  value={editForm.badgeEnglish}
                  onChange={e => setEditForm(f => ({ ...f, badgeEnglish: e.target.value }))}
                  placeholder="e.g. New"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Badge (Arabic)</Label>
                <Input
                  value={editForm.badgeArabic}
                  onChange={e => setEditForm(f => ({ ...f, badgeArabic: e.target.value }))}
                  placeholder="e.g. جديد"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={editForm.slug}
                onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="e.g. women"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editForm.displayOrder}
                  onChange={e => setEditForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={editForm.isActive ? 'active' : 'inactive'}
                  onValueChange={v => setEditForm(f => ({ ...f, isActive: v === 'active' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and may affect related subcategories.
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
