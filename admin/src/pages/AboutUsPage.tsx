import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { aboutUsService, type AboutUsPageData, type AboutUsParagraph, type AboutUsContactItem } from '@/services/aboutUsService';

const generateId = () => crypto.randomUUID();

export default function AboutUsPage() {
  const [form, setForm] = useState<AboutUsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    aboutUsService.getData().then(d => { setForm(d); setLoading(false); });
  }, []);

  if (loading || !form) return <AdminLayout><div className="p-8 text-muted-foreground">Loading...</div></AdminLayout>;

  const set = <K extends keyof AboutUsPageData>(k: K, v: AboutUsPageData[K]) =>
    setForm(prev => prev ? { ...prev, [k]: v } : prev);

  const updateParagraph = (id: string, field: keyof AboutUsParagraph, value: string) =>
    set('paragraphs', form.paragraphs.map(p => p.id === id ? { ...p, [field]: value } : p));

  const addParagraph = () => {
    if (form.paragraphs.length >= 5) return;
    set('paragraphs', [...form.paragraphs, { id: generateId(), content_en: '', content_ar: '' }]);
  };

  const removeParagraph = (id: string) => {
    if (form.paragraphs.length <= 1) return;
    set('paragraphs', form.paragraphs.filter(p => p.id !== id));
  };

  const updateContact = (id: string, field: keyof AboutUsContactItem, value: string | number) =>
    set('contact_items', form.contact_items.map(c => c.id === id ? { ...c, [field]: value } : c));

  const addContact = () => {
    if (form.contact_items.length >= 6) return;
    set('contact_items', [...form.contact_items, {
      id: generateId(), icon: 'Info', label_en: '', label_ar: '',
      action_type: 'none' as const, action_value: '', sort_order: form.contact_items.length + 1,
    }]);
  };

  const removeContact = (id: string) =>
    set('contact_items', form.contact_items.filter(c => c.id !== id));

  const handleSave = async (publish: boolean) => {
    if (saving) return;
    setSaving(true);
    try {
      const data = { ...form, status: publish ? 'published' as const : 'draft' as const };
      const savedData = await aboutUsService.saveData(data);
      setForm(savedData);
      toast.success(publish ? 'About Us page published successfully' : 'About Us page saved as draft');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to save About Us page. Please try again.';
      toast.error(message);
      console.error('Save error:', error?.response?.data || error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold text-foreground">About Us</h1>
          <p className="text-sm text-muted-foreground">Manage About Us page content for the storefront</p>
        </div>

        {/* SECTION 1 — Hero Banner Header */}
        <Card>
          <CardHeader><CardTitle className="text-base">Hero Banner Header</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Page Title (EN)</Label>
                <Input value={form.hero_title_en} onChange={e => set('hero_title_en', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Page Title (AR)</Label>
                <Input dir="rtl" value={form.hero_title_ar} onChange={e => set('hero_title_ar', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Page Subtitle (EN)</Label>
                <Input value={form.hero_subtitle_en} onChange={e => set('hero_subtitle_en', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Page Subtitle (AR)</Label>
                <Input dir="rtl" value={form.hero_subtitle_ar} onChange={e => set('hero_subtitle_ar', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <Label>Hero Background Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.hero_bg_color}
                  onChange={e => set('hero_bg_color', e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input value={form.hero_bg_color} onChange={e => set('hero_bg_color', e.target.value)} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2 — Who We Are */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Who We Are</CardTitle>
              {form.paragraphs.length < 5 && (
                <Button variant="outline" size="sm" onClick={addParagraph}><Plus className="h-4 w-4 mr-1" /> Add Paragraph</Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Section Title (EN)</Label>
                <Input value={form.who_we_are_title_en} onChange={e => set('who_we_are_title_en', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Section Title (AR)</Label>
                <Input dir="rtl" value={form.who_we_are_title_ar} onChange={e => set('who_we_are_title_ar', e.target.value)} />
              </div>
            </div>
            {form.paragraphs.map((p, idx) => (
              <div key={p.id} className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Paragraph {idx + 1}</span>
                  {form.paragraphs.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeParagraph(p.id)} className="h-7 w-7 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Content (EN)</Label>
                  <Textarea rows={4} value={p.content_en} onChange={e => updateParagraph(p.id, 'content_en', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Content (AR)</Label>
                  <Textarea rows={4} dir="rtl" value={p.content_ar} onChange={e => updateParagraph(p.id, 'content_ar', e.target.value)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION 3 — Vision & Mission */}
        <Card>
          <CardHeader><CardTitle className="text-base">Vision & Mission</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* Vision */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Our Vision</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Vision Title (EN)</Label>
                  <Input value={form.vision_title_en} onChange={e => set('vision_title_en', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Vision Title (AR)</Label>
                  <Input dir="rtl" value={form.vision_title_ar} onChange={e => set('vision_title_ar', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Vision Description (EN)</Label>
                <Textarea rows={4} value={form.vision_description_en} onChange={e => set('vision_description_en', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Vision Description (AR)</Label>
                <Textarea rows={4} dir="rtl" value={form.vision_description_ar} onChange={e => set('vision_description_ar', e.target.value)} />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <Label>Vision Icon (Lucide icon name)</Label>
                <Input value={form.vision_icon} onChange={e => set('vision_icon', e.target.value)} placeholder="e.g. Eye" />
              </div>
            </div>

            <Separator />

            {/* Mission */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Our Mission</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Mission Title (EN)</Label>
                  <Input value={form.mission_title_en} onChange={e => set('mission_title_en', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Mission Title (AR)</Label>
                  <Input dir="rtl" value={form.mission_title_ar} onChange={e => set('mission_title_ar', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Mission Description (EN)</Label>
                <Textarea rows={4} value={form.mission_description_en} onChange={e => set('mission_description_en', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Mission Description (AR)</Label>
                <Textarea rows={4} dir="rtl" value={form.mission_description_ar} onChange={e => set('mission_description_ar', e.target.value)} />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <Label>Mission Icon (Lucide icon name)</Label>
                <Input value={form.mission_icon} onChange={e => set('mission_icon', e.target.value)} placeholder="e.g. Target" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4 — Contact Information Strip */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Contact Information Strip</CardTitle>
              {form.contact_items.length < 6 && (
                <Button variant="outline" size="sm" onClick={addContact}><Plus className="h-4 w-4 mr-1" /> Add Contact Item</Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.contact_items.map((c, idx) => (
              <div key={c.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Contact Item {idx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeContact(c.id)} className="h-7 w-7 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Icon (Lucide name)</Label>
                    <Input value={c.icon} onChange={e => updateContact(c.id, 'icon', e.target.value)} placeholder="e.g. MapPin" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Label (EN)</Label>
                    <Input value={c.label_en} onChange={e => updateContact(c.id, 'label_en', e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Label (AR)</Label>
                    <Input dir="rtl" value={c.label_ar} onChange={e => updateContact(c.id, 'label_ar', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Action Type</Label>
                    <Select value={c.action_type} onValueChange={v => updateContact(c.id, 'action_type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                        <SelectItem value="map">Map Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {c.action_type !== 'none' && (
                    <div className="space-y-1.5">
                      <Label>Action Value</Label>
                      <Input value={c.action_value} onChange={e => updateContact(c.id, 'action_value', e.target.value)}
                        placeholder={c.action_type === 'phone' ? '+965...' : c.action_type === 'email' ? 'email@...' : 'https://...'} />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label>Sort Order</Label>
                    <Input type="number" value={c.sort_order} onChange={e => updateContact(c.id, 'sort_order', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SECTION 5 — SEO Settings */}
        <Card>
          <CardHeader><CardTitle className="text-base">SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Meta Title (EN)</Label>
                <Input value={form.meta_title_en} onChange={e => set('meta_title_en', e.target.value.slice(0, 60))} maxLength={60} />
                <p className="text-xs text-muted-foreground">{form.meta_title_en.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label>Meta Title (AR)</Label>
                <Input dir="rtl" value={form.meta_title_ar} onChange={e => set('meta_title_ar', e.target.value.slice(0, 60))} maxLength={60} />
                <p className="text-xs text-muted-foreground">{form.meta_title_ar.length}/60</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Meta Description (EN)</Label>
                <Textarea rows={3} value={form.meta_description_en} onChange={e => set('meta_description_en', e.target.value.slice(0, 160))} maxLength={160} />
                <p className="text-xs text-muted-foreground">{form.meta_description_en.length}/160</p>
              </div>
              <div className="space-y-1.5">
                <Label>Meta Description (AR)</Label>
                <Textarea rows={3} dir="rtl" value={form.meta_description_ar} onChange={e => set('meta_description_ar', e.target.value.slice(0, 160))} maxLength={160} />
                <p className="text-xs text-muted-foreground">{form.meta_description_ar.length}/160</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6 — Page Settings */}
        <Card>
          <CardHeader><CardTitle className="text-base">Page Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={form.status === 'published'} onCheckedChange={v => set('status', v ? 'published' : 'draft')} />
              <Label>{form.status === 'published' ? 'Published' : 'Draft'}</Label>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Last Updated</Label>
              <p className="text-sm text-foreground">{new Date(form.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card px-6 py-3 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button onClick={() => handleSave(true)} disabled={saving}>
          {saving ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </AdminLayout>
  );
}
