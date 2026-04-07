import axios from '@/lib/axios';

export interface AboutParagraph {
  id: string;
  contentEnglish: string;
  contentArabic: string;
  sortOrder: number;
}

export interface AboutContactItem {
  id: string;
  icon: string;
  labelEnglish: string;
  labelArabic: string;
  actionType: string;
  actionValue: string;
  sortOrder: number;
}

export interface AboutData {
  id: string;
  heroTitleEnglish: string;
  heroTitleArabic: string;
  heroSubtitleEnglish: string;
  heroSubtitleArabic: string;
  heroBgColor: string;
  whoWeAreTitleEnglish: string;
  whoWeAreTitleArabic: string;
  paragraphs: AboutParagraph[];
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
  contactItems: AboutContactItem[];
  metaTitleEnglish: string;
  metaTitleArabic: string;
  metaDescriptionEnglish: string;
  metaDescriptionArabic: string;
  status: string;
  updatedAt: string;
}

export const aboutService = {
  async getAbout(): Promise<AboutData | null> {
    try {
      const response = await axios.get<{ success: boolean; data: AboutData }>('/about');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
