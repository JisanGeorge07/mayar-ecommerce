import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import FormSection from '@/components/forms/FormSection';
import FormField from '@/components/forms/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { settingsService, type FeatureSettings, type CheckoutCountry, type CheckoutAddressField } from '@/services/settingsService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FeatureSettings | null>(null);
  const [countries, setCountries] = useState<CheckoutCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [addressFields, setAddressFields] = useState<CheckoutAddressField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Brand & SEO form state
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [defaultMetaTitle, setDefaultMetaTitle] = useState('');
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('');
  const [brandSeoSaving, setBrandSeoSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [s, c] = await Promise.all([
          settingsService.getSettings(),
          settingsService.getCountries()
        ]);
        setSettings(s);
        setBrandName(s.brandName || 'Mayar Shop');
        setTagline(s.tagline || 'Premium E-commerce');
        setDefaultMetaTitle(s.defaultMetaTitle || 'Mayar Shop - Premium E-commerce');
        setDefaultMetaDescription(s.defaultMetaDescription || 'Shop premium products at Mayar Shop. Fashion, beauty, accessories, and more.');
        setCountries(c);
        setDbConnected(true);
        if (c.length > 0) {
          setSelectedCountry(c[0].id);
          const fields = await settingsService.getAddressFields(c[0].id);
          setAddressFields(fields);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        setDbConnected(false);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please check your connection.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  // Load address fields when country changes
  useEffect(() => {
    if (selectedCountry) {
      settingsService.getAddressFields(selectedCountry)
        .then(setAddressFields)
        .catch(error => {
          console.error('Failed to load address fields:', error);
          toast({
            title: 'Error',
            description: 'Failed to load address fields.',
            variant: 'destructive',
          });
        });
    }
  }, [selectedCountry, toast]);

  // Update feature toggle
  const updateToggle = useCallback(async (key: keyof FeatureSettings, value: boolean) => {
    if (!settings) return;
    setSaving(key);
    try {
      const updated = await settingsService.updateSettings({ [key]: value });
      setSettings(updated);
      toast({
        title: 'Saved',
        description: `${key.replace('enable', '')} setting updated.`,
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update setting.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  }, [settings, toast]);

  // Save country settings
  const saveCountry = useCallback(async (id: string, data: Partial<CheckoutCountry>) => {
    setSaving(`country-${id}`);
    try {
      await settingsService.updateCountry(id, data);
      const updatedCountries = await settingsService.getCountries();
      setCountries(updatedCountries);
      toast({
        title: 'Saved',
        description: 'Country settings updated.',
      });
    } catch (error) {
      console.error('Failed to update country:', error);
      toast({
        title: 'Error',
        description: 'Failed to update country settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  }, [toast]);

  // Toggle field visibility
  const toggleFieldVisibility = useCallback(async (fieldId: string, visible: boolean) => {
    setSaving(`field-${fieldId}`);
    try {
      await settingsService.updateAddressField(fieldId, { isVisible: visible });
      const fields = await settingsService.getAddressFields(selectedCountry);
      setAddressFields(fields);
      toast({
        title: 'Saved',
        description: 'Field visibility updated.',
      });
    } catch (error) {
      console.error('Failed to update field:', error);
      toast({
        title: 'Error',
        description: 'Failed to update field visibility.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  }, [selectedCountry, toast]);

  // Toggle field required
  const toggleFieldRequired = useCallback(async (fieldId: string, required: boolean) => {
    setSaving(`field-${fieldId}`);
    try {
      await settingsService.updateAddressField(fieldId, { isRequired: required });
      const fields = await settingsService.getAddressFields(selectedCountry);
      setAddressFields(fields);
      toast({
        title: 'Saved',
        description: 'Field requirement updated.',
      });
    } catch (error) {
      console.error('Failed to update field:', error);
      toast({
        title: 'Error',
        description: 'Failed to update field requirement.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  }, [selectedCountry, toast]);

  // Save brand & SEO settings
  const saveBrandAndSeo = async () => {
    setBrandSeoSaving(true);
    try {
      const updated = await settingsService.updateSettings({
        brandName,
        tagline,
        defaultMetaTitle,
        defaultMetaDescription,
      });
      setSettings(updated);
      toast({
        title: 'Saved',
        description: 'Brand and SEO settings updated.',
      });
    } catch (error) {
      console.error('Failed to save brand/SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save brand and SEO settings.',
        variant: 'destructive',
      });
    } finally {
      setBrandSeoSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading settings...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">
          Failed to load settings. Please refresh the page.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">CMS configuration, feature toggles, and checkout setup</p>
        </div>

        {/* Brand */}
        <FormSection title="Brand" description="Logo and identity">
          <div className="flex items-center gap-6 mb-4">
            <img src={settings.logoUrl || logo} alt="Mayar Logo" className="h-12 object-contain" />
            <div>
              <p className="text-sm font-medium text-foreground">{brandName}</p>
              <p className="text-xs text-muted-foreground">Current brand logo</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Brand Name">
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Mayar Shop"
              />
            </FormField>
            <FormField label="Tagline">
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Premium E-commerce"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Language Toggles */}
        <FormSection title="Language Settings" description="Enable or disable languages for storefront">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">English</p>
                <p className="text-xs text-muted-foreground">Primary language for storefront content</p>
              </div>
              <div className="flex items-center gap-2">
                {saving === 'enableEnglish' && <Loader2 className="h-4 w-4 animate-spin" />}
                <Switch
                  checked={settings.enableEnglish}
                  onCheckedChange={v => updateToggle('enableEnglish', v)}
                  disabled={saving === 'enableEnglish'}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Arabic (العربية)</p>
                <p className="text-xs text-muted-foreground">RTL language support for storefront</p>
              </div>
              <div className="flex items-center gap-2">
                {saving === 'enableArabic' && <Loader2 className="h-4 w-4 animate-spin" />}
                <Switch
                  checked={settings.enableArabic}
                  onCheckedChange={v => updateToggle('enableArabic', v)}
                  disabled={saving === 'enableArabic'}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Currency Toggles */}
        <FormSection title="Currency Settings" description="Enable or disable currencies for pricing">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">KWD — Kuwaiti Dinar</p>
                <p className="text-xs text-muted-foreground">Primary currency for Kuwait market</p>
              </div>
              <div className="flex items-center gap-2">
                {saving === 'enableKwd' && <Loader2 className="h-4 w-4 animate-spin" />}
                <Switch
                  checked={settings.enableKwd}
                  onCheckedChange={v => updateToggle('enableKwd', v)}
                  disabled={saving === 'enableKwd'}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">INR — Indian Rupee</p>
                <p className="text-xs text-muted-foreground">Secondary currency for India market</p>
              </div>
              <div className="flex items-center gap-2">
                {saving === 'enableInr' && <Loader2 className="h-4 w-4 animate-spin" />}
                <Switch
                  checked={settings.enableInr}
                  onCheckedChange={v => updateToggle('enableInr', v)}
                  disabled={saving === 'enableInr'}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Feature Toggles */}
        <FormSection title="Feature Toggles" description="Enable or disable storefront features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([
              { key: 'enableWishlist' as const, label: 'Wishlist', desc: 'Allow customers to save items' },
              { key: 'enableReviews' as const, label: 'Reviews', desc: 'Product review system' },
              { key: 'enableOrderTracking' as const, label: 'Order Tracking', desc: 'Track delivery status' },
              { key: 'enableNewsletter' as const, label: 'Newsletter', desc: 'Email subscription' },
              { key: 'enableMyAccount' as const, label: 'My Account', desc: 'Customer account pages' },
              { key: 'enableGuestCheckout' as const, label: 'Guest Checkout', desc: 'Checkout without account' },
            ]).map(toggle => (
              <div key={toggle.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                  <p className="text-[11px] text-muted-foreground">{toggle.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {saving === toggle.key && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Switch
                    checked={settings[toggle.key]}
                    onCheckedChange={v => updateToggle(toggle.key, v)}
                    disabled={saving === toggle.key}
                  />
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Checkout Countries */}
        <FormSection title="Checkout Countries" description="Configure which countries are available at checkout">
          <div className="space-y-3">
            {countries.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.countryName}</p>
                    <p className="text-xs text-muted-foreground">Code: {c.countryCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {saving === `country-${c.id}` && <Loader2 className="h-4 w-4 animate-spin" />}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={c.isDefault}
                      onCheckedChange={() => saveCountry(c.id, { isDefault: true })}
                      disabled={saving === `country-${c.id}`}
                    />
                    Default
                  </label>
                  <Switch
                    checked={c.isEnabled}
                    onCheckedChange={v => saveCountry(c.id, { isEnabled: v })}
                    disabled={saving === `country-${c.id}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Address Field Config */}
        <FormSection title="Checkout Address Fields" description="Configure address form fields per country">
          <div className="mb-4">
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {countries.map(c => <option key={c.id} value={c.id}>{c.countryName}</option>)}
            </select>
          </div>

          <div className="rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Field</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Label</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground text-center">Visible</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground text-center">Required</th>
                </tr>
              </thead>
              <tbody>
                {addressFields.map(f => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{f.fieldKey}</td>
                    <td className="px-4 py-2.5 font-medium">{f.fieldLabel}</td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {saving === `field-${f.id}` && <Loader2 className="h-3 w-3 animate-spin" />}
                        <Checkbox
                          checked={f.isVisible}
                          onCheckedChange={(v) => toggleFieldVisibility(f.id, !!v)}
                          disabled={saving === `field-${f.id}`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {saving === `field-${f.id}` && <Loader2 className="h-3 w-3 animate-spin" />}
                        <Checkbox
                          checked={f.isRequired}
                          onCheckedChange={(v) => toggleFieldRequired(f.id, !!v)}
                          disabled={saving === `field-${f.id}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormSection>

        {/* Default SEO */}
        <FormSection title="Default SEO" description="Fallback meta values">
          <div className="space-y-4">
            <FormField label="Default Meta Title">
              <Input
                value={defaultMetaTitle}
                onChange={(e) => setDefaultMetaTitle(e.target.value)}
                placeholder="Mayar Shop - Premium E-commerce"
              />
            </FormField>
            <FormField label="Default Meta Description">
              <Textarea
                value={defaultMetaDescription}
                onChange={(e) => setDefaultMetaDescription(e.target.value)}
                placeholder="Shop premium products at Mayar Shop. Fashion, beauty, accessories, and more."
                rows={2}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Save Brand & SEO Button */}
        <div className="flex justify-end">
          <Button onClick={saveBrandAndSeo} disabled={brandSeoSaving}>
            {brandSeoSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Brand & SEO Settings
              </>
            )}
          </Button>
        </div>

        {/* Database Status */}
        <FormSection title="Database" description="Backend connection">
          {dbConnected ? (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm text-foreground font-medium">Connected</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Database is connected and working properly. Last updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          ) : (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-foreground font-medium">Not Connected</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unable to connect to the database. Please check your backend server.
              </p>
            </div>
          )}
        </FormSection>
      </div>
    </AdminLayout>
  );
}
