import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { GripVertical, MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contactUsService, type ContactUsPageData, type ContactCard } from '@/services/contactUsService';

const ICON_OPTIONS = [
  { value: 'MapPin', label: 'Map Pin', Icon: MapPin },
  { value: 'Phone', label: 'Phone', Icon: Phone },
  { value: 'Mail', label: 'Mail', Icon: Mail },
  { value: 'MessageCircle', label: 'Message', Icon: MessageCircle },
  { value: 'Clock', label: 'Clock', Icon: Clock },
] as const;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { MapPin, Phone, Mail, MessageCircle, Clock };

export default function ContactUsPage() {
  const [data, setData] = useState<ContactUsPageData | null>(null);
  const [dirty, setDirty] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => { contactUsService.getData().then(setData); }, []);

  const set = useCallback(<K extends keyof ContactUsPageData>(k: K, v: ContactUsPageData[K]) => {
    setData((prev) => prev ? { ...prev, [k]: v } : prev);
    setDirty(true);
  }, []);

  const updateCard = useCallback((id: string, patch: Partial<ContactCard>) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, contact_cards: prev.contact_cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) };
    });
    setDirty(true);
  }, []);

  const reorder = useCallback((from: number, to: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const arr = [...prev.contact_cards];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...prev, contact_cards: arr.map((c, i) => ({ ...c, sort_order: i + 1 })) };
    });
    setDirty(true);
  }, []);

  const save = async (status: 'draft' | 'published') => {
    if (!data) return;
    const saved = await contactUsService.saveData({ ...data, status });
    setData(saved);
    setDirty(false);
    toast.success(status === 'published' ? 'Contact Us page published' : 'Draft saved successfully');
  };

  if (!data) return <AdminLayout><div className="p-6">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Us Page</h1>
          <p className="text-sm text-muted-foreground">Manage your Contact Us storefront page content</p>
        </div>

        {/* Hero Banner */}
        <Card>
          <CardHeader><CardTitle>Hero Banner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Heading (EN)</Label><Input value={data.hero_heading_en} onChange={(e) => set('hero_heading_en', e.target.value)} /></div>
              <div><Label>Heading (AR)</Label><Input dir="rtl" className="text-right" value={data.hero_heading_ar} onChange={(e) => set('hero_heading_ar', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Subheading (EN)</Label><Input value={data.hero_subheading_en} onChange={(e) => set('hero_subheading_en', e.target.value)} /></div>
              <div><Label>Subheading (AR)</Label><Input dir="rtl" className="text-right" value={data.hero_subheading_ar} onChange={(e) => set('hero_subheading_ar', e.target.value)} /></div>
            </div>
            <div className="max-w-xs">
              <Label>Background Color</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <input type="color" value={data.hero_bg_color} onChange={(e) => set('hero_bg_color', e.target.value)} className="h-10 w-14 rounded border border-input cursor-pointer" />
                <Input value={data.hero_bg_color} onChange={(e) => set('hero_bg_color', e.target.value)} className="font-mono" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Info Cards</CardTitle>
            <p className="text-sm text-muted-foreground">The five contact cards displayed below the hero.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.contact_cards.map((card, idx) => {
              const IconComp = iconMap[card.icon];
              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragIdx !== null && dragIdx !== idx) reorder(dragIdx, idx); setDragIdx(null); }}
                  onDragEnd={() => setDragIdx(null)}
                  className="rounded-lg border border-border p-4 space-y-3 bg-card"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                    {IconComp && <IconComp className="h-4 w-4 text-primary shrink-0" />}
                    <span className="text-sm font-medium text-foreground">{card.label_en || 'Untitled'}</span>
                    <span className="ml-auto text-xs text-muted-foreground">#{card.sort_order}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <Select value={card.icon} onValueChange={(v) => updateCard(card.id, { icon: v as ContactCard['icon'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              <span className="flex items-center gap-2"><o.Icon className="h-3.5 w-3.5" />{o.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Label (EN)</Label><Input value={card.label_en} onChange={(e) => updateCard(card.id, { label_en: e.target.value })} /></div>
                    <div><Label>Label (AR)</Label><Input dir="rtl" className="text-right" value={card.label_ar} onChange={(e) => updateCard(card.id, { label_ar: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {card.icon === 'MapPin' ? (
                      <>
                        <div><Label>Value (EN)</Label><Textarea rows={2} value={card.value_en} onChange={(e) => updateCard(card.id, { value_en: e.target.value })} /></div>
                        <div><Label>Value (AR)</Label><Textarea rows={2} dir="rtl" className="text-right" value={card.value_ar} onChange={(e) => updateCard(card.id, { value_ar: e.target.value })} /></div>
                      </>
                    ) : (
                      <>
                        <div><Label>Value (EN)</Label><Input value={card.value_en} onChange={(e) => updateCard(card.id, { value_en: e.target.value })} /></div>
                        <div><Label>Value (AR)</Label><Input dir="rtl" className="text-right" value={card.value_ar} onChange={(e) => updateCard(card.id, { value_ar: e.target.value })} /></div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Map Settings */}
        <Card>
          <CardHeader><CardTitle>Map Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={data.show_map} onCheckedChange={(v) => set('show_map', v)} />
              <Label>Show Map</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Map Height (px)</Label>
                <Input type="number" value={data.map_height} onChange={(e) => set('map_height', Number(e.target.value))} />
              </div>
            </div>
            <div>
              <Label>Google Maps Embed URL</Label>
              <Input value={data.map_embed_url} onChange={(e) => set('map_embed_url', e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Paste only the src value from Google Maps → Share → Embed a map.</p>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  SEO Settings
                  <span className="text-xs font-normal text-muted-foreground">{seoOpen ? 'Collapse' : 'Expand'}</span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Meta Title (EN)</Label>
                    <Input maxLength={60} value={data.meta_title_en} onChange={(e) => set('meta_title_en', e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">{data.meta_title_en.length}/60</p>
                  </div>
                  <div>
                    <Label>Meta Title (AR)</Label>
                    <Input dir="rtl" className="text-right" maxLength={60} value={data.meta_title_ar} onChange={(e) => set('meta_title_ar', e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">{data.meta_title_ar.length}/60</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Meta Description (EN)</Label>
                    <Textarea rows={3} maxLength={160} value={data.meta_description_en} onChange={(e) => set('meta_description_en', e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">{data.meta_description_en.length}/160</p>
                  </div>
                  <div>
                    <Label>Meta Description (AR)</Label>
                    <Textarea rows={3} dir="rtl" className="text-right" maxLength={160} value={data.meta_description_ar} onChange={(e) => set('meta_description_ar', e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">{data.meta_description_ar.length}/160</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Page Settings */}
        <Card>
          <CardHeader><CardTitle>Page Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={data.status === 'published'} onCheckedChange={(v) => set('status', v ? 'published' : 'draft')} />
              <Label>{data.status === 'published' ? 'Published' : 'Draft'}</Label>
            </div>
            <p className="text-xs text-muted-foreground">Last Updated: {new Date(data.updated_at).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={data.status === 'published' ? 'default' : 'secondary'}>{data.status === 'published' ? 'Published' : 'Draft'}</Badge>
          {dirty && <span className="h-2 w-2 rounded-full bg-orange-500" />}
          <span className="text-xs text-muted-foreground">Last saved: {new Date(data.updated_at).toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => save('draft')}>Save Draft</Button>
          <Button onClick={() => save('published')}>Publish</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
