import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { privacyPolicyService, type PrivacyPolicyData, type PolicySection } from '@/services/privacyPolicyService';

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PrivacyPolicyData | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    privacyPolicyService.getData().then((d) => {
      setData(d);
      const open: Record<string, boolean> = {};
      d.sections.forEach((s) => { open[s.id] = false; });
      setOpenSections(open);
    });
  }, []);

  if (!data) return <AdminLayout><div className="p-6">Loading...</div></AdminLayout>;

  const set = <K extends keyof PrivacyPolicyData>(k: K, v: PrivacyPolicyData[K]) =>
    setData((prev) => prev ? { ...prev, [k]: v } : prev);

  const updateSection = (id: string, patch: Partial<PolicySection>) =>
    set('sections', data.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSection = () => {
    if (data.sections.length >= 20) return;
    const newId = crypto.randomUUID();
    set('sections', [...data.sections, { id: newId, title_en: '', title_ar: '', content_en: '', content_ar: '', sort_order: data.sections.length + 1, is_active: true }]);
    setOpenSections((p) => ({ ...p, [newId]: true }));
  };

  const removeSection = (id: string) => {
    if (data.sections.length <= 1) return;
    set('sections', data.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, sort_order: i + 1 })));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const arr = [...data.sections];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    set('sections', arr.map((s, i) => ({ ...s, sort_order: i + 1 })));
  };

  const toggleOpen = (id: string) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  const save = async (status: 'draft' | 'published') => {
    const saved = await privacyPolicyService.saveData({ ...data, status });
    setData(saved);
    toast.success(status === 'published' ? 'Privacy Policy published successfully' : 'Privacy Policy saved as draft');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Manage Privacy Policy page content for the storefront</p>
        </div>

        {/* Hero */}
        <Card>
          <CardHeader><CardTitle>Page Hero Header</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Page Title (EN)</Label><Input value={data.hero_title_en} onChange={(e) => set('hero_title_en', e.target.value)} /></div>
            <div><Label>Page Title (AR)</Label><Input dir="rtl" value={data.hero_title_ar} onChange={(e) => set('hero_title_ar', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader><CardTitle>Introduction</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Introduction Text (EN)</Label><Textarea rows={5} value={data.introduction_en} onChange={(e) => set('introduction_en', e.target.value)} /></div>
            <div><Label>Introduction Text (AR)</Label><Textarea rows={5} dir="rtl" value={data.introduction_ar} onChange={(e) => set('introduction_ar', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Policy Sections <span className="ml-2 text-sm font-normal text-muted-foreground">{data.sections.length} sections</span></CardTitle>
            <Button size="sm" variant="outline" onClick={addSection} disabled={data.sections.length >= 20}><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.sections.map((sec, idx) => (
              <Collapsible key={sec.id} open={openSections[sec.id]} onOpenChange={() => toggleOpen(sec.id)}>
                <div className="rounded-lg border border-border">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground w-6">{idx + 1}</span>
                        <span className="text-sm font-medium text-foreground">{sec.title_en || 'Untitled Section'}</span>
                        {!sec.is_active && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Inactive</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(idx, -1); }} disabled={idx === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(idx, 1); }} disabled={idx === data.sections.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }} disabled={data.sections.length <= 1}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border px-4 py-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Section Title (EN)</Label><Input value={sec.title_en} onChange={(e) => updateSection(sec.id, { title_en: e.target.value })} /></div>
                        <div><Label>Section Title (AR)</Label><Input dir="rtl" value={sec.title_ar} onChange={(e) => updateSection(sec.id, { title_ar: e.target.value })} /></div>
                      </div>
                      <div><Label>Section Content (EN)</Label><Textarea rows={5} value={sec.content_en} onChange={(e) => updateSection(sec.id, { content_en: e.target.value })} /></div>
                      <div><Label>Section Content (AR)</Label><Textarea rows={5} dir="rtl" value={sec.content_ar} onChange={(e) => updateSection(sec.id, { content_ar: e.target.value })} /></div>
                      <div className="flex items-center gap-3">
                        <Switch checked={sec.is_active} onCheckedChange={(v) => updateSection(sec.id, { is_active: v })} />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Contact Box Title (EN)</Label><Input value={data.contact_title_en} onChange={(e) => set('contact_title_en', e.target.value)} /></div>
              <div><Label>Contact Box Title (AR)</Label><Input dir="rtl" value={data.contact_title_ar} onChange={(e) => set('contact_title_ar', e.target.value)} /></div>
            </div>
            <div><Label>Contact Message (EN)</Label><Textarea rows={3} value={data.contact_message_en} onChange={(e) => set('contact_message_en', e.target.value)} /></div>
            <div><Label>Contact Message (AR)</Label><Textarea rows={3} dir="rtl" value={data.contact_message_ar} onChange={(e) => set('contact_message_ar', e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Contact Email</Label><Input value={data.contact_email} onChange={(e) => set('contact_email', e.target.value)} /></div>
              <div><Label>Contact Phone</Label><Input value={data.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Meta Title (EN)</Label>
                <Input maxLength={60} value={data.meta_title_en} onChange={(e) => set('meta_title_en', e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">{data.meta_title_en.length}/60</p>
              </div>
              <div>
                <Label>Meta Title (AR)</Label>
                <Input dir="rtl" maxLength={60} value={data.meta_title_ar} onChange={(e) => set('meta_title_ar', e.target.value)} />
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
                <Textarea rows={3} dir="rtl" maxLength={160} value={data.meta_description_ar} onChange={(e) => set('meta_description_ar', e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">{data.meta_description_ar.length}/160</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Settings */}
        <Card>
          <CardHeader><CardTitle>Page Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Effective Date</Label><Input type="date" value={data.effective_date} onChange={(e) => set('effective_date', e.target.value)} /></div>
              <div><Label>Last Revised Date</Label><Input type="date" value={data.last_revised_date} onChange={(e) => set('last_revised_date', e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={data.status === 'published'} onCheckedChange={(v) => set('status', v ? 'published' : 'draft')} />
              <Label>{data.status === 'published' ? 'Published' : 'Draft'}</Label>
            </div>
            <p className="text-xs text-muted-foreground">Last Updated: {new Date(data.updated_at).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card px-6 py-3 flex justify-end gap-3">
        <Button variant="outline" onClick={() => save('draft')}>Save Draft</Button>
        <Button onClick={() => save('published')}>Publish</Button>
      </div>
    </AdminLayout>
  );
}
