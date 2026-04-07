import api from "@/lib/axios";

export interface NewsletterDto {
  id: string;
  userId?: string;
  email?: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const newsletterApi = {
  getAll: () => api.get<ApiResponse<NewsletterDto[]>>("/NewsLetter/get-all"),

  getById: (id: string) => api.get<ApiResponse<NewsletterDto>>(`/NewsLetter/get/${id}`),

  getByUserId: (userId: string) => api.get<ApiResponse<NewsletterDto[]>>(`/NewsLetter/get-by-user/${userId}`),

  subscribe: (email: string, userId?: string) => {
    const formData = new FormData();
    formData.append("email", email);
    if (userId) {
      formData.append("userId", userId);
    }
    return api.post<ApiResponse<NewsletterDto>>("/NewsLetter/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  unsubscribe: (id: string) => api.delete<ApiResponse<object>>(`/NewsLetter/delete/${id}`),
};
