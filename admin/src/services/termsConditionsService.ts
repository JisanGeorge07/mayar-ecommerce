import { registerSearchProvider } from './searchService';
import contentPageService, { type AdminContentPageData, type AdminSection } from './contentPageService';

export type TermsSection = AdminSection;

export interface TermsConditionsPageData {
  id: string;
  hero_heading_en: string;
  hero_heading_ar: string;
  hero_bg_color: string;
  introduction_en: string;
  introduction_ar: string;
  sections: TermsSection[];
  contact_heading_en: string;
  contact_heading_ar: string;
  contact_text_en: string;
  contact_text_ar: string;
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  status: 'published' | 'draft';
  updated_at: string;
}

const PAGE_TYPE = 'terms-conditions';

function toTermsPageData(data: AdminContentPageData): TermsConditionsPageData {
  return {
    id: data.id,
    hero_heading_en: data.hero_title_en,
    hero_heading_ar: data.hero_title_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    contact_heading_en: data.contact_title_en,
    contact_heading_ar: data.contact_title_ar,
    contact_text_en: data.contact_message_en,
    contact_text_ar: data.contact_message_ar,
    meta_title_en: data.meta_title_en,
    meta_title_ar: data.meta_title_ar,
    meta_description_en: data.meta_description_en,
    meta_description_ar: data.meta_description_ar,
    status: data.status,
    updated_at: data.updated_at,
  };
}

function toAdminContentPageData(data: TermsConditionsPageData): AdminContentPageData {
  return {
    id: data.id,
    pageType: PAGE_TYPE,
    hero_title_en: data.hero_heading_en,
    hero_title_ar: data.hero_heading_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    contact_title_en: data.contact_heading_en,
    contact_title_ar: data.contact_heading_ar,
    contact_message_en: data.contact_text_en,
    contact_message_ar: data.contact_text_ar,
    contact_email: '',
    contact_phone: '',
    meta_title_en: data.meta_title_en,
    meta_title_ar: data.meta_title_ar,
    meta_description_en: data.meta_description_en,
    meta_description_ar: data.meta_description_ar,
    effective_date: '',
    last_revised_date: '',
    status: data.status,
    updated_at: data.updated_at,
  };
}

export const termsConditionsService = {
  async getData(): Promise<TermsConditionsPageData> {
    const data = await contentPageService.getByType(PAGE_TYPE);
    return toTermsPageData(data);
  },

  async saveData(incoming: TermsConditionsPageData): Promise<TermsConditionsPageData> {
    const adminData = toAdminContentPageData(incoming);
    const saved = await contentPageService.save(adminData);
    return toTermsPageData(saved);
  },
};

registerSearchProvider('terms-conditions', (q) => {
  const lower = q.toLowerCase();
  if ('terms'.includes(lower) || 'conditions'.includes(lower) || 'terms & conditions'.includes(lower)) {
    return [{ id: 'terms-conditions-page', title: 'Terms & Conditions', subtitle: 'Manage Terms & Conditions page', category: 'Pages', path: '/pages/terms-conditions' }];
  }
  return [];
});
