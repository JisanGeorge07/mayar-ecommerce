import api from '@/lib/axios';

export interface ContactCard {
  id: string;
  icon: 'MapPin' | 'Phone' | 'Mail' | 'MessageCircle' | 'Clock';
  label_en: string;
  label_ar: string;
  value_en: string;
  value_ar: string;
  sort_order: number;
}

export interface ContactPageData {
  id: string;
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

export const contactService = {
  async getContactPage(): Promise<ContactPageData> {
    const response = await api.get('/contact');
    return response.data.data;
  },
};
