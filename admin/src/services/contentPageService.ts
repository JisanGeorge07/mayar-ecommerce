import api from '@/lib/axios';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Backend DTO types
export interface ContentSectionDto {
  id: string;
  contentPageId: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface ContentPageDto {
  id: string;
  pageType: string;
  titleEn: string;
  titleAr: string;
  introEn: string;
  introAr: string;
  heroBgColor: string | null;
  contactTitleEn: string | null;
  contactTitleAr: string | null;
  contactNoteEn: string | null;
  contactNoteAr: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
  effectiveDate: string | null;
  lastRevisedDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sections: ContentSectionDto[];
}

// Admin UI types (common structure for all content pages)
export interface AdminSection {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  sort_order: number;
  is_active: boolean;
}

export interface AdminContentPageData {
  id: string;
  pageType: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_bg_color: string;
  introduction_en: string;
  introduction_ar: string;
  sections: AdminSection[];
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

// Transform backend DTO to admin UI format
function toAdminFormat(dto: ContentPageDto): AdminContentPageData {
  return {
    id: dto.id,
    pageType: dto.pageType,
    hero_title_en: dto.titleEn,
    hero_title_ar: dto.titleAr,
    hero_bg_color: dto.heroBgColor || '#1a1a2e',
    introduction_en: dto.introEn,
    introduction_ar: dto.introAr,
    sections: dto.sections.map(s => ({
      id: s.id,
      title_en: s.titleEn,
      title_ar: s.titleAr,
      content_en: s.bodyEn,
      content_ar: s.bodyAr,
      sort_order: s.displayOrder,
      is_active: s.isActive,
    })),
    contact_title_en: dto.contactTitleEn || '',
    contact_title_ar: dto.contactTitleAr || '',
    contact_message_en: dto.contactNoteEn || '',
    contact_message_ar: dto.contactNoteAr || '',
    contact_email: dto.contactEmail || '',
    contact_phone: dto.contactPhone || '',
    meta_title_en: dto.metaTitleEn || '',
    meta_title_ar: dto.metaTitleAr || '',
    meta_description_en: dto.metaDescriptionEn || '',
    meta_description_ar: dto.metaDescriptionAr || '',
    effective_date: dto.effectiveDate ? dto.effectiveDate.split('T')[0] : '',
    last_revised_date: dto.lastRevisedDate ? dto.lastRevisedDate.split('T')[0] : '',
    status: dto.status as 'published' | 'draft',
    updated_at: dto.updatedAt,
  };
}

// Transform admin UI format to backend DTO
function toBackendFormat(data: AdminContentPageData): Partial<ContentPageDto> {
  return {
    id: data.id,
    pageType: data.pageType,
    titleEn: data.hero_title_en,
    titleAr: data.hero_title_ar,
    introEn: data.introduction_en,
    introAr: data.introduction_ar,
    heroBgColor: data.hero_bg_color || null,
    contactTitleEn: data.contact_title_en || null,
    contactTitleAr: data.contact_title_ar || null,
    contactNoteEn: data.contact_message_en || null,
    contactNoteAr: data.contact_message_ar || null,
    contactEmail: data.contact_email || null,
    contactPhone: data.contact_phone || null,
    metaTitleEn: data.meta_title_en || null,
    metaTitleAr: data.meta_title_ar || null,
    metaDescriptionEn: data.meta_description_en || null,
    metaDescriptionAr: data.meta_description_ar || null,
    effectiveDate: data.effective_date ? `${data.effective_date}T00:00:00Z` : null,
    lastRevisedDate: data.last_revised_date ? `${data.last_revised_date}T00:00:00Z` : null,
    status: data.status,
    isActive: data.status === 'published',
    sections: data.sections.map(s => ({
      id: s.id,
      contentPageId: data.id,
      titleEn: s.title_en,
      titleAr: s.title_ar,
      bodyEn: s.content_en,
      bodyAr: s.content_ar,
      displayOrder: s.sort_order,
      isActive: s.is_active,
      createdAt: new Date().toISOString(),
    })),
  };
}

// Default data factory for creating new pages
function createDefaultData(pageType: string): AdminContentPageData {
  const defaults: Record<string, Partial<AdminContentPageData>> = {
    'privacy-policy': {
      hero_title_en: 'Privacy Policy',
      hero_title_ar: 'سياسة الخصوصية',
      introduction_en: '',
      introduction_ar: '',
    },
    'terms-conditions': {
      hero_title_en: 'Terms & Conditions',
      hero_title_ar: 'الشروط والأحكام',
      introduction_en: '',
      introduction_ar: '',
    },
    'shipping-info': {
      hero_title_en: 'Shipping Information',
      hero_title_ar: 'معلومات الشحن',
      introduction_en: '',
      introduction_ar: '',
    },
    'returns-exchange': {
      hero_title_en: 'Returns & Exchange',
      hero_title_ar: 'الإرجاع والاستبدال',
      introduction_en: '',
      introduction_ar: '',
    },
  };

  const defaultSettings = defaults[pageType] || {};

  return {
    id: '',
    pageType,
    hero_title_en: defaultSettings.hero_title_en || '',
    hero_title_ar: defaultSettings.hero_title_ar || '',
    hero_bg_color: '#1a1a2e',
    introduction_en: defaultSettings.introduction_en || '',
    introduction_ar: defaultSettings.introduction_ar || '',
    sections: [],
    contact_title_en: '',
    contact_title_ar: '',
    contact_message_en: '',
    contact_message_ar: '',
    contact_email: '',
    contact_phone: '',
    meta_title_en: '',
    meta_title_ar: '',
    meta_description_en: '',
    meta_description_ar: '',
    effective_date: '',
    last_revised_date: '',
    status: 'draft',
    updated_at: new Date().toISOString(),
  };
}

export const contentPageService = {
  async getByType(pageType: string): Promise<AdminContentPageData> {
    try {
      const response = await api.get<ApiResponse<ContentPageDto>>(`/ContentPage/get-by-type/${pageType}`);
      return toAdminFormat(response.data.data);
    } catch (error: any) {
      // If page doesn't exist, return default data
      if (error.response?.status === 404) {
        return createDefaultData(pageType);
      }
      throw error;
    }
  },

  async save(data: AdminContentPageData): Promise<AdminContentPageData> {
    const backendData = toBackendFormat(data);

    try {
      let response;
      if (data.id) {
        // Update existing page
        response = await api.put<ApiResponse<ContentPageDto>>(`/ContentPage/update/${data.id}`, backendData);
      } else {
        // Create new page (shouldn't happen since pages are seeded, but handle it)
        response = await api.post<ApiResponse<ContentPageDto>>('/ContentPage/create', backendData);
      }
      return toAdminFormat(response.data.data);
    } catch (error) {
      console.error('Error saving content page:', error);
      throw error;
    }
  },

  async getAll(): Promise<AdminContentPageData[]> {
    const response = await api.get<ApiResponse<ContentPageDto[]>>('/ContentPage/get-all');
    return response.data.data.map(toAdminFormat);
  },
};

export default contentPageService;
