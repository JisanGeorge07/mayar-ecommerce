import api from '@/lib/axios';
import type { AdminUser } from '@/types/auth';

export const adminUserService = {
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get<AdminUser[]>('/adminusers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      return [];
    }
  },

  async createAdminUser(data: any): Promise<AdminUser | null> {
    try {
      const response = await api.post<AdminUser>('/adminusers', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create admin user:', error);
      return null;
    }
  },

  async updateAdminUser(id: string, data: any): Promise<boolean> {
    try {
      await api.put(`/adminusers/${id}`, data);
      return true;
    } catch (error) {
      console.error('Failed to update admin user:', error);
      return false;
    }
  },

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      await api.delete(`/adminusers/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete admin user:', error);
      return false;
    }
  }
};
