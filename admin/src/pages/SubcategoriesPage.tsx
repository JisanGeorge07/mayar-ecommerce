import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { topCategoryService } from '@/services/topCategoryService';
import { middleCategoryService, MiddleCategoryCreateInput, MiddleCategoryUpdateInput } from '@/services/middleCategoryService';
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
import type { TopCategory, MiddleCategory } from '@/types';

interface CreateFormState {
  topCategoryId: string;
  titleEnglish: string;
  titleArabic: string;
}

interface EditFormState extends CreateFormState {
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyCreateForm: CreateFormState = {
  topCategoryId: '',
  titleEnglish: '',
  titleArabic: '',
};

const emptyEditForm: EditFormState = {
  ...emptyCreateForm,
  slug: '',
  displayOrder: 0,
  isActive: true,
};

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MiddleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);

  const load = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        topCategoryService.getAll(),
        middleCategoryService.getAll(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all'
    ? subcategories
    : subcategories.filter(s => s.topCategoryId === filter);

  const openCreate = () => {
    setCreateForm(emptyCreateForm);
    setCreateOpen(true);
  };

  const openEdit = (sub: MiddleCategory) => {
    setEditId(sub.id);
    setEditForm({
      topCategoryId: sub.topCategoryId,
      titleEnglish: sub.titleEnglish || '',
      titleArabic: sub.titleArabic || '',
      slug: sub.slug || '',
      displayOrder: sub.displayOrder || 0,
      isActive: sub.isActive,
    });
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    if (!createForm.titleEnglish.trim() || !createForm.titleArabic.trim()) {
      toast.error('Title (English) and Title (Arabic) are required');
      return;
    }
    if (!createForm.topCategoryId) {
      toast.error('Please select a parent category');
      return;
    }

    try {
      const input: MiddleCategoryCreateInput = {
        topCategoryId: createForm.topCategoryId,
        titleEnglish: createForm.titleEnglish,
        titleArabic: createForm.titleArabic,
      };
      await middleCategoryService.create(input);
      toast.success('Subcategory created successfully');
      setCreateOpen(false);
      load();
    } catch (err) {
      toast.error('Failed to create subcategory');
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    if (!editForm.titleEnglish.trim() || !editForm.titleArabic.trim()) {
      toast.error('Title (English) and Title (Arabic) are required');
      return;
    }
    if (!editForm.topCategoryId) {
      toast.error('Please select a parent category');
      return;
    }

    try {
      const input: MiddleCategoryUpdateInput = {
        topCategoryId: editForm.topCategoryId,
        titleEnglish: editForm.titleEnglish,
        titleArabic: editForm.titleArabic,
        slug: editForm.slug || undefined,
        displayOrder: editForm.displayOrder,
        isActive: editForm.isActive,
      };
      const success = await middleCategoryService.update(editId, input);
      if (success) {
        toast.success('Subcategory updated successfully');
        setEditOpen(false);
        load();
      } else {
        toast.error('Failed to update subcategory');
      }
    } catch (err) {
      toast.error('Failed to update subcategory');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const success = await middleCategoryService.delete(deleteId);
      if (success) {
        toast.success('Subcategory deleted successfully');
        load();
      } else {
        toast.error('Failed to delete subcategory');
      }
    } catch (err) {
      toast.error('Failed to delete subcategory');
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const success = await middleCategoryService.toggleStatus(id);
      if (success) {
        toast.success('Subcategory status updated');
        load();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getCategoryName = (topCategoryId: string) => {
    const cat = categories.find(c => c.id === topCategoryId);
    return cat?.titleEnglish || '-';
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add Subcategory
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title (EN)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title (AR)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No subcategories found. Create your first subcategory.
                  </td>
                </tr>
              ) : (
                filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{sub.titleEnglish || '-'}</td>
                    <td className="px-4 py-3 text-sm text-foreground" dir="rtl">{sub.titleArabic || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{getCategoryName(sub.topCategoryId)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={sub.isActive ? 'default' : 'secondary'} className="capitalize text-xs">
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(sub)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(sub.id)}
                          title={sub.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {sub.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDelete(sub.id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Parent Category <span className="text-destructive">*</span></Label>
              <Select value={createForm.topCategoryId} onValueChange={v => setCreateForm(f => ({ ...f, topCategoryId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title (English) <span className="text-destructive">*</span></Label>
                <Input
                  value={createForm.titleEnglish}
                  onChange={e => setCreateForm(f => ({ ...f, titleEnglish: e.target.value }))}
                  placeholder="e.g. Dresses"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Title (Arabic) <span className="text-destructive">*</span></Label>
                <Input
                  value={createForm.titleArabic}
                  onChange={e => setCreateForm(f => ({ ...f, titleArabic: e.target.value }))}
                  placeholder="e.g. فساتين"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Parent Category <span className="text-destructive">*</span></Label>
              <Select value={editForm.topCategoryId} onValueChange={v => setEditForm(f => ({ ...f, topCategoryId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.titleEnglish}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title (English) <span className="text-destructive">*</span></Label>
                <Input
                  value={editForm.titleEnglish}
                  onChange={e => setEditForm(f => ({ ...f, titleEnglish: e.target.value }))}
                  placeholder="e.g. Dresses"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Title (Arabic) <span className="text-destructive">*</span></Label>
                <Input
                  value={editForm.titleArabic}
                  onChange={e => setEditForm(f => ({ ...f, titleArabic: e.target.value }))}
                  placeholder="e.g. فساتين"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={editForm.slug}
                onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="e.g. dresses"
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
            <AlertDialogTitle>Are you sure you want to delete this subcategory?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subcategory and may affect related product types.
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
