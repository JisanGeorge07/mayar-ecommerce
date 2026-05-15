import api from '@/lib/axios';

export interface Role {
  id: string;
  name: string;
  description: string;
  allowedPaths: string[];
}

export const rolesService = {
  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get<Role[]>('/roles');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      return [];
    }
  },

  async createRole(data: Omit<Role, 'id'>): Promise<Role | null> {
    try {
      const response = await api.post<Role>('/roles', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create role:', error);
      return null;
    }
  },

  async updateRole(id: string, data: Omit<Role, 'id'>): Promise<boolean> {
    try {
      await api.put(`/roles/${id}`, data);
      return true;
    } catch (error) {
      console.error('Failed to update role:', error);
      return false;
    }
  },

  async deleteRole(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      await api.delete(`/roles/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete role:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete role' 
      };
    }
  }
};
