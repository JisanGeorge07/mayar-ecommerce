import api from '@/lib/axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type PageVisibilityMap = Record<string, 'published' | 'draft'>;

export const pageVisibilityService = {
  async getPageVisibilities(): Promise<PageVisibilityMap> {
    try {
      const response = await api.get<ApiResponse<PageVisibilityMap>>('/Settings/page-visibility');
      if (response.data.success) {
        return response.data.data;
      }
      return {};
    } catch (error) {
      console.error('Failed to fetch page visibilities:', error);
      return {};
    }
  }
};

export default pageVisibilityService;
