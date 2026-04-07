import api from '@/lib/axios';

export interface RecentlyViewedDto {
  id: string;
  productId: string;
  userId: string;
  viewedAt: string;
}

export interface CreateRecentlyViewedRequest {
  userId: string;
  productId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const recentlyViewedApi = {
  /**
   * Get all recently viewed products for a user
   */
  async getAllByUser(userId: string, limit: number = 50): Promise<ApiResponse<RecentlyViewedDto[]>> {
    const response = await api.get<ApiResponse<RecentlyViewedDto[]>>(
      `/RecentlyViewed/user/${userId}`,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Track a product view (add or update)
   */
  async trackView(request: CreateRecentlyViewedRequest): Promise<ApiResponse<RecentlyViewedDto>> {
    const response = await api.post<ApiResponse<RecentlyViewedDto>>(
      `/RecentlyViewed/track`,
      request
    );
    return response.data;
  },

  /**
   * Remove a recently viewed item
   */
  async remove(id: string): Promise<ApiResponse<object>> {
    const response = await api.delete<ApiResponse<object>>(
      `/RecentlyViewed/delete/${id}`
    );
    return response.data;
  },

  /**
   * Clear all recently viewed history for a user
   */
  async clearUserHistory(userId: string): Promise<ApiResponse<object>> {
    const response = await api.delete<ApiResponse<object>>(
      `/RecentlyViewed/clear/${userId}`
    );
    return response.data;
  },
};
