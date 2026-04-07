import { registerSearchProvider } from './searchService';
import axios from '@/lib/axios';

export interface AboutUsContactItem {
  id: string;
  icon: string;
  label_en: string;
  label_ar: string;
  action_type: 'none' | 'phone' | 'email' | 'link' | 'map';
  action_value: string;
  sort_order: number;
}

export interface AboutUsParagraph {
  id: string;
  content_en: string;
  content_ar: string;
}

export interface AboutUsPageData {
  id?: string;
  // Hero
  hero_title_en: string;
  hero_title_ar: string;
  hero_subtitle_en: string;
  hero_subtitle_ar: string;
  hero_bg_color: string;
  // Who We Are
  who_we_are_title_en: string;
  who_we_are_title_ar: string;
  paragraphs: AboutUsParagraph[];
  // Vision
  vision_title_en: string;
  vision_title_ar: string;
  vision_description_en: string;
  vision_description_ar: string;
  vision_icon: string;
  // Mission
  mission_title_en: string;
  mission_title_ar: string;
  mission_description_en: string;
  mission_description_ar: string;
  mission_icon: string;
  // Contact
  contact_items: AboutUsContactItem[];
  // SEO
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  // Settings
  status: 'published' | 'draft';
  updated_at: string;
}

interface ApiAboutParagraph {
  id: string;
  contentEnglish: string;
  contentArabic: string;
  sortOrder: number;
}

interface ApiAboutContactItem {
  id: string;
  icon: string;
  labelEnglish: string;
  labelArabic: string;
  actionType: string;
  actionValue: string;
  sortOrder: number;
}

interface ApiAboutData {
  id: string | null;
  heroTitleEnglish: string;
  heroTitleArabic: string;
  heroSubtitleEnglish: string;
  heroSubtitleArabic: string;
  heroBgColor: string;
  whoWeAreTitleEnglish: string;
  whoWeAreTitleArabic: string;
  paragraphs: ApiAboutParagraph[];
  visionTitleEnglish: string;
  visionTitleArabic: string;
  visionDescriptionEnglish: string;
  visionDescriptionArabic: string;
  visionIcon: string;
  missionTitleEnglish: string;
  missionTitleArabic: string;
  missionDescriptionEnglish: string;
  missionDescriptionArabic: string;
  missionIcon: string;
  contactItems: ApiAboutContactItem[];
  metaTitleEnglish: string;
  metaTitleArabic: string;
  metaDescriptionEnglish: string;
  metaDescriptionArabic: string;
  status: string;
  updatedAt: string;
}

const generateId = () => crypto.randomUUID();

const DEFAULT_DATA: AboutUsPageData = {
  hero_title_en: 'About Mayar',
  hero_title_ar: '',
  hero_subtitle_en: 'Your Trusted Partner for Seamless Shipping and Logistics Solutions',
  hero_subtitle_ar: '',
  hero_bg_color: '#1B2A4A',
  who_we_are_title_en: 'Who We Are',
  who_we_are_title_ar: '',
  paragraphs: [
    {
      id: generateId(),
      content_en: 'At Mayar International, we are committed to providing reliable and efficient delivery services within Kuwait and around the world. With a focus on customer satisfaction and operational excellence, we cater to businesses and individuals who require fast, secure, and affordable shipping solutions. Our team of professionals ensures that your goods are delivered on time, every time, with the utmost care and precision.',
      content_ar: '',
    },
    {
      id: generateId(),
      content_en: 'With years of experience in the logistics and transportation industry, we have built a reputation for trust and reliability. Whether it\'s domestic delivery within Kuwait or international shipping to any corner of the globe, we leverage state-of-the-art technology and a global network of partners to fulfill all your shipping needs.',
      content_ar: '',
    },
  ],
  vision_title_en: 'Our Vision',
  vision_title_ar: '',
  vision_description_en: 'To be the leading provider of delivery solutions in Kuwait, known for our reliability, innovation, and commitment to customer satisfaction. We strive to transform the logistics industry by offering services that are efficient, cost-effective, and tailored to meet the unique needs of our clients. Our goal is to create seamless and reliable logistics experiences that empower businesses and individuals to grow and succeed.',
  vision_description_ar: '',
  vision_icon: 'Eye',
  mission_title_en: 'Our Mission',
  mission_title_ar: '',
  mission_description_en: 'Our mission is to provide fast, secure, and reliable delivery and logistics solutions that meet the evolving needs of our customers. We are committed to excellence, integrity, and innovation, ensuring timely and efficient shipping both domestically and internationally. Through personalized service and a focus on customer satisfaction, we make shipping easier and more efficient.',
  mission_description_ar: '',
  mission_icon: 'Target',
  contact_items: [
    { id: generateId(), icon: 'MapPin', label_en: 'Shuwaikh Port, Free Trade Zone, Kuwait City, Kuwait', label_ar: '', action_type: 'map', action_value: '', sort_order: 1 },
    { id: generateId(), icon: 'Phone', label_en: '+965 50404099', label_ar: '', action_type: 'phone', action_value: '+96550404099', sort_order: 2 },
    { id: generateId(), icon: 'Mail', label_en: 'mayaralmiya@gmail.com', label_ar: '', action_type: 'email', action_value: 'mayaralmiya@gmail.com', sort_order: 3 },
    { id: generateId(), icon: 'Clock', label_en: '9:00 AM to 5:00 PM', label_ar: '', action_type: 'none', action_value: '', sort_order: 4 },
  ],
  meta_title_en: 'About Mayar | Mayar International',
  meta_title_ar: '',
  meta_description_en: 'Learn about Mayar International - your trusted partner for seamless shipping and logistics solutions in Kuwait and worldwide.',
  meta_description_ar: '',
  status: 'published',
  updated_at: new Date().toISOString(),
};

// Convert API response to frontend format
const mapApiToFrontend = (api: ApiAboutData): AboutUsPageData => ({
  id: api.id,
  hero_title_en: api.heroTitleEnglish || '',
  hero_title_ar: api.heroTitleArabic || '',
  hero_subtitle_en: api.heroSubtitleEnglish || '',
  hero_subtitle_ar: api.heroSubtitleArabic || '',
  hero_bg_color: api.heroBgColor || '#1B2A4A',
  who_we_are_title_en: api.whoWeAreTitleEnglish || '',
  who_we_are_title_ar: api.whoWeAreTitleArabic || '',
  paragraphs: (api.paragraphs || []).map((p) => ({
    id: p.id,
    content_en: p.contentEnglish || '',
    content_ar: p.contentArabic || '',
  })),
  vision_title_en: api.visionTitleEnglish || '',
  vision_title_ar: api.visionTitleArabic || '',
  vision_description_en: api.visionDescriptionEnglish || '',
  vision_description_ar: api.visionDescriptionArabic || '',
  vision_icon: api.visionIcon || 'Eye',
  mission_title_en: api.missionTitleEnglish || '',
  mission_title_ar: api.missionTitleArabic || '',
  mission_description_en: api.missionDescriptionEnglish || '',
  mission_description_ar: api.missionDescriptionArabic || '',
  mission_icon: api.missionIcon || 'Target',
  contact_items: (api.contactItems || []).map((c) => ({
    id: c.id,
    icon: c.icon || '',
    label_en: c.labelEnglish || '',
    label_ar: c.labelArabic || '',
    action_type: (c.actionType || 'none') as 'none' | 'phone' | 'email' | 'link' | 'map',
    action_value: c.actionValue || '',
    sort_order: c.sortOrder,
  })),
  meta_title_en: api.metaTitleEnglish || '',
  meta_title_ar: api.metaTitleArabic || '',
  meta_description_en: api.metaDescriptionEnglish || '',
  meta_description_ar: api.metaDescriptionArabic || '',
  status: (api.status === 'published' ? 'published' : 'draft') as 'published' | 'draft',
  updated_at: api.updatedAt || new Date().toISOString(),
});

// Convert frontend format to API format
const mapFrontendToApi = (data: AboutUsPageData): Omit<ApiAboutData, 'updatedAt'> => ({
  id: data.id || null,
  heroTitleEnglish: data.hero_title_en,
  heroTitleArabic: data.hero_title_ar,
  heroSubtitleEnglish: data.hero_subtitle_en,
  heroSubtitleArabic: data.hero_subtitle_ar,
  heroBgColor: data.hero_bg_color,
  whoWeAreTitleEnglish: data.who_we_are_title_en,
  whoWeAreTitleArabic: data.who_we_are_title_ar,
  paragraphs: data.paragraphs.map((p, idx) => ({
    id: p.id,
    contentEnglish: p.content_en,
    contentArabic: p.content_ar,
    sortOrder: idx,
  })),
  visionTitleEnglish: data.vision_title_en,
  visionTitleArabic: data.vision_title_ar,
  visionDescriptionEnglish: data.vision_description_en,
  visionDescriptionArabic: data.vision_description_ar,
  visionIcon: data.vision_icon,
  missionTitleEnglish: data.mission_title_en,
  missionTitleArabic: data.mission_title_ar,
  missionDescriptionEnglish: data.mission_description_en,
  missionDescriptionArabic: data.mission_description_ar,
  missionIcon: data.mission_icon,
  contactItems: data.contact_items.map((c) => ({
    id: c.id,
    icon: c.icon,
    labelEnglish: c.label_en,
    labelArabic: c.label_ar,
    actionType: c.action_type,
    actionValue: c.action_value,
    sortOrder: c.sort_order,
  })),
  metaTitleEnglish: data.meta_title_en,
  metaTitleArabic: data.meta_title_ar,
  metaDescriptionEnglish: data.meta_description_en,
  metaDescriptionArabic: data.meta_description_ar,
  status: data.status,
});

export const aboutUsService = {
  async getData(): Promise<AboutUsPageData> {
    try {
      const response = await axios.get<{ success: boolean; data: ApiAboutData }>('/about');
      if (response.data.success && response.data.data) {
        return mapApiToFrontend(response.data.data);
      }
      return { ...DEFAULT_DATA };
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      // Return default data if API fails or no data exists
      return { ...DEFAULT_DATA };
    }
  },

  async saveData(data: AboutUsPageData): Promise<AboutUsPageData> {
    const apiData = mapFrontendToApi(data);
    const response = await axios.put<{ success: boolean; data?: ApiAboutData }>('/about', apiData);
    if (response.data.success) {
      // Fetch the updated data
      return this.getData();
    }
    throw new Error('Failed to save about data');
  },
};

registerSearchProvider('about-us', (q) => {
  const lower = q.toLowerCase();
  if ('about us'.includes(lower) || 'about mayar'.includes(lower)) {
    return [{ id: 'about-us', title: 'About Us', subtitle: 'Page editor', category: 'Pages', path: '/pages/about-us' }];
  }
  return [];
});
