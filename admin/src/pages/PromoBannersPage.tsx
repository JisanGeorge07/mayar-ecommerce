import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { promoBannerService } from '@/services/promoBannerService';
import PromoBannerForm from '@/components/promoBanner/PromoBannerForm';
import type { PromoBannerItem } from '@/types/promoBanner';
import { Plus, Search, Pencil, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

export default function PromoBannersPage() {
  const [items, setItems] = useState<PromoBannerItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [layoutFilter, setLayoutFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<PromoBannerItem | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await promoBannerService.getItems());
    } catch (error) {
      toast({ title: 'Failed to load banners', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    const matchSearch = !search || i.internal_name.toLowerCase().includes(search.toLowerCase()) || i.title_en.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? i.is_active : !i.is_active);
    const matchLayout = layoutFilter === 'all' || i.layout_type === layoutFilter;
    return matchSearch && matchStatus && matchLayout;
  });

  const handleSave = async (data: Omit<PromoBannerItem, 'id' | 'created_at' | 'updated_at'>, desktopFile?: File, mobileFile?: File) => {
    try {
      if (editItem) {
        await promoBannerService.updateItem(editItem.id, data, desktopFile, mobileFile);
        toast({ title: 'Promo banner updated' });
      } else {
        await promoBannerService.createItem(data, desktopFile, mobileFile);
        toast({ title: 'Promo banner created' });
      }
      setOpen(false);
      setEditItem(null);
      load();
    } catch (error) {
      toast({ title: 'Failed to save banner', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await promoBannerService.deleteItem(id);
      toast({ title: 'Banner deleted' });
      load();
    } catch (error) {
      toast({ title: 'Failed to delete banner', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (item: PromoBannerItem) => {
    try {
      await promoBannerService.updateItem(item.id, { is_active: !item.is_active });
      load();
    } catch (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleTogglePublish = async (item: PromoBannerItem) => {
    try {
      await promoBannerService.updateItem(item.id, { is_published: !item.is_published });
      load();
    } catch (error) {
      toast({ title: 'Failed to update publish status', variant: 'destructive' });
    }
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const ordered = [...filtered];
    const target = idx + dir;
    if (target < 0 || target >= ordered.length) return;
    [ordered[idx], ordered[target]] = [ordered[target], ordered[idx]];
    try {
      await promoBannerService.reorderItems(ordered.map(i => i.id));
      load();
    } catch (error) {
      toast({ title: 'Failed to reorder banners', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Promotional Banners</h1>
            <p className="text-sm text-muted-foreground">Manage homepage promotional banner grid</p>
          </div>
          <Button onClick={() => { setEditItem(null); setOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Banner
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search banners..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={layoutFilter} onValueChange={setLayoutFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Layouts</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Link</TableHead>
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
                    {item.desktop_image_url ? (
                      <img src={item.desktop_image_url} alt={item.alt_text} className="h-10 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-16 rounded bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.internal_name}</TableCell>
                  <TableCell>{item.title_en}</TableCell>
                  <TableCell>
                    <Badge variant={item.layout_type === 'large' ? 'default' : 'secondary'} className="capitalize">{item.layout_type}</Badge>
                  </TableCell>
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
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No banners found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setEditItem(null); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Promotional Banner' : 'Add Promotional Banner'}</DialogTitle>
          </DialogHeader>
          <PromoBannerForm initial={editItem} onSave={handleSave} onCancel={() => { setOpen(false); setEditItem(null); }} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
