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

// Frontend display types
export interface ContentSection {
  title: { en: string; ar: string };
  body: { en: string; ar: string };
}

export interface ContentPageData {
  title: { en: string; ar: string };
  intro: { en: string; ar: string };
  heroBgColor?: string;
  sections: ContentSection[];
  contactNote?: { en: string; ar: string };
  contactTitle?: { en: string; ar: string };
  contactEmail?: string;
  contactPhone?: string;
  metaTitle?: { en: string; ar: string };
  metaDescription?: { en: string; ar: string };
}

// Transform backend DTO to frontend display format
function toFrontendFormat(dto: ContentPageDto): ContentPageData {
  const activeSections = dto.sections
    .filter(s => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const data: ContentPageData = {
    title: { en: dto.titleEn, ar: dto.titleAr },
    intro: { en: dto.introEn, ar: dto.introAr },
    heroBgColor: dto.heroBgColor || undefined,
    sections: activeSections.map(s => ({
      title: { en: s.titleEn, ar: s.titleAr },
      body: { en: s.bodyEn, ar: s.bodyAr },
    })),
  };

  // Add contact info if present
  if (dto.contactNoteEn || dto.contactNoteAr) {
    data.contactNote = { en: dto.contactNoteEn || '', ar: dto.contactNoteAr || '' };
  }
  if (dto.contactTitleEn || dto.contactTitleAr) {
    data.contactTitle = { en: dto.contactTitleEn || '', ar: dto.contactTitleAr || '' };
  }
  if (dto.contactEmail) {
    data.contactEmail = dto.contactEmail;
  }
  if (dto.contactPhone) {
    data.contactPhone = dto.contactPhone;
  }

  // Add SEO fields if present
  if (dto.metaTitleEn || dto.metaTitleAr) {
    data.metaTitle = { en: dto.metaTitleEn || '', ar: dto.metaTitleAr || '' };
  }
  if (dto.metaDescriptionEn || dto.metaDescriptionAr) {
    data.metaDescription = { en: dto.metaDescriptionEn || '', ar: dto.metaDescriptionAr || '' };
  }

  return data;
}

export const contentPageService = {
  async getByType(pageType: string): Promise<ContentPageData | null> {
    try {
      const response = await api.get<ApiResponse<ContentPageDto>>(`/ContentPage/get-by-type/${pageType}`);
      if (!response.data.success || !response.data.data) {
        return null;
      }
      return toFrontendFormat(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getPrivacyPolicy(): Promise<ContentPageData | null> {
    return this.getByType('privacy-policy');
  },

  async getTermsConditions(): Promise<ContentPageData | null> {
    return this.getByType('terms-conditions');
  },

  async getShippingInfo(): Promise<ContentPageData | null> {
    return this.getByType('shipping-info');
  },

  async getReturnsExchange(): Promise<ContentPageData | null> {
    return this.getByType('returns-exchange');
  },
};

export default contentPageService;
