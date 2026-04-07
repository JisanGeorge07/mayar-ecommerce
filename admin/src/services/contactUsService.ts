import api from '@/lib/axios';
import { registerSearchProvider } from './searchService';

export interface ContactCard {
  id: string;
  icon: 'MapPin' | 'Phone' | 'Mail' | 'MessageCircle' | 'Clock';
  label_en: string;
  label_ar: string;
  value_en: string;
  value_ar: string;
  sort_order: number;
}

export interface ContactUsPageData {
  hero_heading_en: string;
  hero_heading_ar: string;
  hero_subheading_en: string;
  hero_subheading_ar: string;
  hero_bg_color: string;
  contact_cards: ContactCard[];
  show_map: boolean;
  map_height: number;
  map_embed_url: string;
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  status: 'published' | 'draft';
  updated_at: string;
}

export const contactUsService = {
  async getData(): Promise<ContactUsPageData> {
    const response = await api.get('/contact');
    return response.data.data;
  },

  async saveData(incoming: ContactUsPageData): Promise<ContactUsPageData> {
    const response = await api.put('/contact', incoming);
    return response.data.data;
  },
};

registerSearchProvider('contact-us', (q) => {
  const lower = q.toLowerCase();
  if ('contact us'.includes(lower) || 'contact mayar'.includes(lower)) {
    return [{ id: 'contact-us-page', title: 'Contact Us', subtitle: 'Manage Contact Us page', category: 'Pages', path: '/pages/contact-us' }];
  }
  return [];
});
