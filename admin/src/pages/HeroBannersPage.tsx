import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { heroBannerService } from '@/services/heroBannerService';
import type { HeroBanner } from '@/types/heroBanner';
import HeroBannerForm from '@/components/hero/HeroBannerForm';
import HeroBannerPreview from '@/components/hero/HeroBannerPreview';
import { toast } from '@/hooks/use-toast';

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publishFilter, setPublishFilter] = useState<string>('all');
  const [editBanner, setEditBanner] = useState<HeroBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<HeroBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await heroBannerService.getBanners();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = banners.filter(b => {
    if (statusFilter !== 'all' && ((statusFilter === 'active') !== b.is_active)) return false;
    if (publishFilter !== 'all' && ((publishFilter === 'published') !== b.is_published)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return b.banner_name.toLowerCase().includes(q) || b.title_en.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    await heroBannerService.deleteBanner(id);
    toast({ title: 'Banner deleted' });
    load();
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const idx = banners.findIndex(b => b.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;
    const ids = banners.map(b => b.id);
    [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
    await heroBannerService.reorderBanners(ids);
    load();
  };

  const handleToggle = async (banner: HeroBanner, field: 'is_active' | 'is_published') => {
    await heroBannerService.updateBanner(banner.id, { [field]: !banner[field] });
    load();
  };

  const handleSave = async (data: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>, desktopFile?: File, mobileFile?: File) => {
    setSaving(true);
    try {
      if (editBanner) {
        await heroBannerService.updateBanner(editBanner.id, data, desktopFile, mobileFile);
        toast({ title: 'Banner updated' });
      } else {
        await heroBannerService.createBanner(data, desktopFile, mobileFile);
        toast({ title: 'Banner created' });
      }
      setShowForm(false);
      setEditBanner(null);
      load();
    } catch (error) {
      toast({ title: 'Failed to save banner', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => { setEditBanner(null); setShowForm(true); };
  const openEdit = (b: HeroBanner) => { setEditBanner(b); setShowForm(true); };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Hero Banners</h2>
            <p className="text-sm text-muted-foreground">Manage storefront hero slides</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Hero Banner
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search banners..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={publishFilter} onValueChange={setPublishFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Publish" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Banner Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No hero banners found</TableCell></TableRow>
              ) : filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell>
                    {b.desktop_image_url ? (
                      <img src={b.desktop_image_url} alt={b.alt_text} className="h-10 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{b.banner_name}</TableCell>
                  <TableCell className="text-muted-foreground">{b.title_en}</TableCell>
                  <TableCell>
                    {b.current_price_kwd != null && (
                      <span className="text-foreground font-medium">{b.current_price_kwd} KWD</span>
                    )}
                    {b.old_price_kwd != null && (
                      <span className="ml-1 text-xs text-muted-foreground line-through">{b.old_price_kwd}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">{b.sort_order}</span>
                      <button onClick={() => handleMove(b.id, 'up')} className="p-0.5 text-muted-foreground hover:text-foreground"><ArrowUp className="h-3 w-3" /></button>
                      <button onClick={() => handleMove(b.id, 'down')} className="p-0.5 text-muted-foreground hover:text-foreground"><ArrowDown className="h-3 w-3" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleToggle(b, 'is_active')}>
                      <Badge variant={b.is_active ? 'default' : 'secondary'} className="cursor-pointer">
                        {b.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleToggle(b, 'is_published')}>
                      <Badge variant={b.is_published ? 'default' : 'outline'} className="cursor-pointer">
                        {b.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewBanner(b)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Preview">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={v => { if (!v) { setShowForm(false); setEditBanner(null); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}</DialogTitle>
          </DialogHeader>
          <HeroBannerForm
            initial={editBanner || undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditBanner(null); }}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewBanner} onOpenChange={v => { if (!v) setPreviewBanner(null); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {previewBanner && <HeroBannerPreview banner={previewBanner} />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
