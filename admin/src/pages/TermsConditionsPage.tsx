import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { termsConditionsService, type TermsConditionsPageData, type TermsSection } from '@/services/termsConditionsService';

export default function TermsConditionsPage() {
  const [data, setData] = useState<TermsConditionsPageData | null>(null);
  const [dirty, setDirty] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [seoOpen, setSeoOpen] = useState(false);

  useEffect(() => {
    termsConditionsService.getData().then((d) => {
      setData(d);
      const open: Record<string, boolean> = {};
      d.sections.forEach((s) => { open[s.id] = false; });
      setOpenSections(open);
    });
  }, []);

  const set = useCallback(<K extends keyof TermsConditionsPageData>(k: K, v: TermsConditionsPageData[K]) => {
    setData((prev) => prev ? { ...prev, [k]: v } : prev);
    setDirty(true);
  }, []);

  const updateSection = useCallback((id: string, patch: Partial<TermsSection>) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, sections: prev.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) };
    });
    setDirty(true);
  }, []);

  const addSection = useCallback(() => {
    setData((prev) => {
      if (!prev || prev.sections.length >= 20) return prev;
      const newId = crypto.randomUUID();
      setOpenSections((p) => ({ ...p, [newId]: true }));
      return {
        ...prev,
        sections: [...prev.sections, { id: newId, title_en: '', title_ar: '', content_en: '', content_ar: '', sort_order: prev.sections.length + 1, is_active: true }],
      };
    });
    setDirty(true);
  }, []);

  const removeSection = useCallback((id: string) => {
    setData((prev) => {
      if (!prev || prev.sections.length <= 1) return prev;
      return { ...prev, sections: prev.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, sort_order: i + 1 })) };
    });
    setDirty(true);
  }, []);

  const moveSection = useCallback((idx: number, dir: -1 | 1) => {
    setData((prev) => {
      if (!prev) return prev;
      const arr = [...prev.sections];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, sections: arr.map((s, i) => ({ ...s, sort_order: i + 1 })) };
    });
    setDirty(true);
  }, []);

  const toggleOpen = (id: string) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  const save = async (status: 'draft' | 'published') => {
    if (!data) return;
    const saved = await termsConditionsService.saveData({ ...data, status });
    setData(saved);
    setDirty(false);
    toast.success(status === 'published' ? 'Terms & Conditions page published' : 'Draft saved successfully');
  };

  if (!data) return <AdminLayout></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms & Conditions Page</h1>
          <p className="text-sm text-muted-foreground">Manage your Terms & Conditions storefront page content</p>
        </div>

        {/* Hero Banner */}
        <Card>
          <CardHeader><CardTitle>Hero Banner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Heading (EN)</Label><Input value={data.hero_heading_en} onChange={(e) => set('hero_heading_en', e.target.value)} /></div>
              <div><Label>Heading (AR)</Label><Input dir="rtl" className="text-right" value={data.hero_heading_ar} onChange={(e) => set('hero_heading_ar', e.target.value)} /></div>
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

        {/* Introduction */}
        <Card>
          <CardHeader><CardTitle>Introduction</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Introduction Text (EN)</Label><Textarea rows={4} value={data.introduction_en} onChange={(e) => set('introduction_en', e.target.value)} /></div>
            <div><Label>Introduction Text (AR)</Label><Textarea rows={4} dir="rtl" className="text-right" value={data.introduction_ar} onChange={(e) => set('introduction_ar', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Terms Sections
              <Badge variant="secondary" className="ml-2 text-xs font-normal">{data.sections.length} sections</Badge>
            </CardTitle>
            <Button size="sm" variant="outline" onClick={addSection} disabled={data.sections.length >= 20}>
              <Plus className="h-4 w-4 mr-1" /> Add Section
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.sections.map((sec, idx) => (
              <Collapsible key={sec.id} open={openSections[sec.id]} onOpenChange={() => toggleOpen(sec.id)}>
                <div className="rounded-lg border border-border">
                  <CollapsibleTrigger asChild>
                    <div className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground w-6">{idx + 1}</span>
                        <span className="text-sm font-medium text-foreground">{sec.title_en || 'Untitled Section'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(idx, -1); }} disabled={idx === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(idx, 1); }} disabled={idx === data.sections.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }} disabled={data.sections.length <= 1}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border px-4 py-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Section Title (EN)</Label><Input value={sec.title_en} onChange={(e) => updateSection(sec.id, { title_en: e.target.value })} /></div>
                        <div><Label>Section Title (AR)</Label><Input dir="rtl" className="text-right" value={sec.title_ar} onChange={(e) => updateSection(sec.id, { title_ar: e.target.value })} /></div>
                      </div>
                      <div><Label>Section Content (EN)</Label><Textarea rows={5} value={sec.content_en} onChange={(e) => updateSection(sec.id, { content_en: e.target.value })} /></div>
                      <div><Label>Section Content (AR)</Label><Textarea rows={5} dir="rtl" className="text-right" value={sec.content_ar} onChange={(e) => updateSection(sec.id, { content_ar: e.target.value })} /></div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info Box */}
        <Card>
          <CardHeader><CardTitle>Contact Info Box</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Box Heading (EN)</Label><Input value={data.contact_heading_en} onChange={(e) => set('contact_heading_en', e.target.value)} /></div>
              <div><Label>Box Heading (AR)</Label><Input dir="rtl" className="text-right" value={data.contact_heading_ar} onChange={(e) => set('contact_heading_ar', e.target.value)} /></div>
            </div>
            <div><Label>Box Text (EN)</Label><Textarea rows={3} value={data.contact_text_en} onChange={(e) => set('contact_text_en', e.target.value)} /></div>
            <div><Label>Box Text (AR)</Label><Textarea rows={3} dir="rtl" className="text-right" value={data.contact_text_ar} onChange={(e) => set('contact_text_ar', e.target.value)} /></div>
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
          {dirty && <span className="h-2 w-2 rounded-full bg-primary" />}
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
