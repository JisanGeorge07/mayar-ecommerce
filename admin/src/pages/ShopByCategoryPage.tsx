import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { shopByCategoryService } from '@/services/shopByCategoryService';
import ShopByCategoryForm from '@/components/shopByCategory/ShopByCategoryForm';
import type { ShopByCategoryItem } from '@/types/shopByCategory';
import { Plus, Search, Pencil, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

export default function ShopByCategoryPage() {
  const [items, setItems] = useState<ShopByCategoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShopByCategoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { setItems(await shopByCategoryService.getItems()); };
  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    const matchSearch = !search || i.internal_name.toLowerCase().includes(search.toLowerCase()) || i.title_en.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? i.is_active : !i.is_active);
    return matchSearch && matchStatus;
  });

  const handleSave = async (data: Omit<ShopByCategoryItem, 'id' | 'created_at' | 'updated_at'>, imageFile?: File) => {
    setSaving(true);
    try {
      console.log('handleSave called with:', { data, imageFile });

      if (editItem) {
        console.log('Updating item:', editItem.id);
        await shopByCategoryService.updateItem(editItem.id, data, imageFile);
        toast({ title: 'Category item updated' });
      } else {
        console.log('Creating new item');
        await shopByCategoryService.createItem(data, imageFile);
        toast({ title: 'Category item created' });
      }
      setOpen(false);
      setEditItem(null);
      load();
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      console.error('Full error object:', JSON.stringify(error.response?.data, null, 2));

      let errorMessage = 'An error occurred';

      if (error.response?.data?.data && typeof error.response.data.data === 'object') {
        // Handle ModelState validation errors
        const validationErrors = [];
        for (const [field, errors] of Object.entries(error.response.data.data)) {
          if (Array.isArray(errors)) {
            validationErrors.push(`${field}: ${errors.map((e: any) => e.errorMessage || e).join(', ')}`);
          }
        }
        if (validationErrors.length > 0) {
          errorMessage = validationErrors.join('\n');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await shopByCategoryService.deleteItem(id);
    toast({ title: 'Item deleted' });
    load();
  };

  const handleToggleActive = async (item: ShopByCategoryItem) => {
    await shopByCategoryService.updateItem(item.id, { is_active: !item.is_active });
    load();
  };

  const handleTogglePublish = async (item: ShopByCategoryItem) => {
    await shopByCategoryService.updateItem(item.id, { is_published: !item.is_published });
    load();
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const ordered = [...filtered];
    const target = idx + dir;
    if (target < 0 || target >= ordered.length) return;
    [ordered[idx], ordered[target]] = [ordered[target], ordered[idx]];
    await shopByCategoryService.reorderItems(ordered.map(i => i.id));
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shop by Category</h1>
            <p className="text-sm text-muted-foreground">Manage homepage category section items</p>
          </div>
          <Button onClick={() => { setEditItem(null); setOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Link Target</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-20">Active</TableHead>
                <TableHead className="w-24">Published</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.alt_text} className="h-10 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-8 rounded bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.internal_name}</TableCell>
                  <TableCell>{item.title_en}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{item.link_type.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="p-0.5 hover:text-primary disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <span className="text-xs text-muted-foreground w-4 text-center">{item.sort_order}</span>
                      <button onClick={() => handleMove(idx, 1)} disabled={idx === filtered.length - 1} className="p-0.5 hover:text-primary disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell><Switch checked={item.is_active} onCheckedChange={() => handleToggleActive(item)} /></TableCell>
                  <TableCell><Switch checked={item.is_published} onCheckedChange={() => handleTogglePublish(item)} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditItem(item); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No items found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setEditItem(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Category Item' : 'Add Category Item'}</DialogTitle>
          </DialogHeader>
          <ShopByCategoryForm initial={editItem} onSave={handleSave} onCancel={() => { setOpen(false); setEditItem(null); }} saving={saving} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
