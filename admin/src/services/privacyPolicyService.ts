import { registerSearchProvider } from './searchService';
import contentPageService, { type AdminContentPageData, type AdminSection } from './contentPageService';

export type PolicySection = AdminSection;

export interface PrivacyPolicyData {
  id: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_bg_color: string;
  introduction_en: string;
  introduction_ar: string;
  sections: PolicySection[];
  contact_title_en: string;
  contact_title_ar: string;
  contact_message_en: string;
  contact_message_ar: string;
  contact_email: string;
  contact_phone: string;
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  effective_date: string;
  last_revised_date: string;
  status: 'published' | 'draft';
  updated_at: string;
}

const PAGE_TYPE = 'privacy-policy';

function toPrivacyPolicyData(data: AdminContentPageData): PrivacyPolicyData {
  return {
    id: data.id,
    hero_title_en: data.hero_title_en,
    hero_title_ar: data.hero_title_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    contact_title_en: data.contact_title_en,
    contact_title_ar: data.contact_title_ar,
    contact_message_en: data.contact_message_en,
    contact_message_ar: data.contact_message_ar,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    meta_title_en: data.meta_title_en,
    meta_title_ar: data.meta_title_ar,
    meta_description_en: data.meta_description_en,
    meta_description_ar: data.meta_description_ar,
    effective_date: data.effective_date,
    last_revised_date: data.last_revised_date,
    status: data.status,
    updated_at: data.updated_at,
  };
}

function toAdminContentPageData(data: PrivacyPolicyData): AdminContentPageData {
  return {
    id: data.id,
    pageType: PAGE_TYPE,
    hero_title_en: data.hero_title_en,
    hero_title_ar: data.hero_title_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    contact_title_en: data.contact_title_en,
    contact_title_ar: data.contact_title_ar,
    contact_message_en: data.contact_message_en,
    contact_message_ar: data.contact_message_ar,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    meta_title_en: data.meta_title_en,
    meta_title_ar: data.meta_title_ar,
    meta_description_en: data.meta_description_en,
    meta_description_ar: data.meta_description_ar,
    effective_date: data.effective_date,
    last_revised_date: data.last_revised_date,
    status: data.status,
    updated_at: data.updated_at,
  };
}

export const privacyPolicyService = {
  async getData(): Promise<PrivacyPolicyData> {
    const data = await contentPageService.getByType(PAGE_TYPE);
    return toPrivacyPolicyData(data);
  },

  async saveData(incoming: PrivacyPolicyData): Promise<PrivacyPolicyData> {
    const adminData = toAdminContentPageData(incoming);
    const saved = await contentPageService.save(adminData);
    return toPrivacyPolicyData(saved);
  },
};

registerSearchProvider('privacy-policy', (q) => {
  const lower = q.toLowerCase();
  if ('privacy policy'.includes(lower) || 'privacy'.includes(lower)) {
    return [{ id: 'privacy-policy', title: 'Privacy Policy', subtitle: 'Page editor', category: 'Pages', path: '/pages/privacy-policy' }];
  }
  return [];
});
