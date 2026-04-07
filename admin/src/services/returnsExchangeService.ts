import { registerSearchProvider } from './searchService';
import contentPageService, { type AdminContentPageData, type AdminSection } from './contentPageService';

export type ReturnsSection = AdminSection;

export interface ReturnsExchangePageData {
  id: string;
  hero_heading_en: string;
  hero_heading_ar: string;
  hero_bg_color: string;
  introduction_en: string;
  introduction_ar: string;
  sections: ReturnsSection[];
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  status: 'published' | 'draft';
  updated_at: string;
}

const PAGE_TYPE = 'returns-exchange';

function toReturnsPageData(data: AdminContentPageData): ReturnsExchangePageData {
  return {
    id: data.id,
    hero_heading_en: data.hero_title_en,
    hero_heading_ar: data.hero_title_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    meta_title_en: data.meta_title_en,
    meta_title_ar: data.meta_title_ar,
    meta_description_en: data.meta_description_en,
    meta_description_ar: data.meta_description_ar,
    status: data.status,
    updated_at: data.updated_at,
  };
}

function toAdminContentPageData(data: ReturnsExchangePageData): AdminContentPageData {
  return {
    id: data.id,
    pageType: PAGE_TYPE,
    hero_title_en: data.hero_heading_en,
    hero_title_ar: data.hero_heading_ar,
    hero_bg_color: data.hero_bg_color,
    introduction_en: data.introduction_en,
    introduction_ar: data.introduction_ar,
    sections: data.sections,
    contact_title_en: '',
    contact_title_ar: '',
    contact_message_en: '',
    contact_message_ar: '',
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

export const returnsExchangeService = {
  async getData(): Promise<ReturnsExchangePageData> {
    const data = await contentPageService.getByType(PAGE_TYPE);
    return toReturnsPageData(data);
  },

  async saveData(incoming: ReturnsExchangePageData): Promise<ReturnsExchangePageData> {
    const adminData = toAdminContentPageData(incoming);
    const saved = await contentPageService.save(adminData);
    return toReturnsPageData(saved);
  },
};

registerSearchProvider('returns-exchange', (q) => {
  const lower = q.toLowerCase();
  if ('returns'.includes(lower) || 'exchange'.includes(lower) || 'refund'.includes(lower)) {
    return [{ id: 'returns-exchange-page', title: 'Returns & Exchange', subtitle: 'Manage Returns & Exchange page', category: 'Pages', path: '/pages/returns-exchange' }];
  }
  return [];
});
