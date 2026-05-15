import api from '@/lib/axios';

export type NotificationType =
  | 'new_order' | 'payment_success' | 'payment_failed'
  | 'new_customer' | 'low_stock' | 'out_of_stock'
  | 'support_request' | 'delivery_update'
  | 'admin_announcement' | 'system_alert' | 'order' | 'delivery' | 'promo' | 'account';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationStatus = 'draft' | 'published' | 'scheduled';

export interface Notification {
  id: string;
  userId?: string;
  titleEnglish: string;
  titleArabic: string;
  messageEnglish: string;
  messageArabic: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  referenceType?: string;
  referenceId?: string;
  isAdminNotification: boolean;
  status: NotificationStatus;
  isConfirmed: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
}

export const notificationService = {
  getAdminNotifications: async () => {
    const response = await api.get<Notification[]>('/notifications/admin');
    return response.data;
  },

  markAsRead: async (id: string) => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (isAdmin: boolean = true) => {
    await api.put(`/notifications/read-all?isAdmin=${isAdmin}`);
  },

  confirmNotification: async (id: string) => {
    await api.put(`/notifications/${id}/confirm`);
  },

  deleteNotification: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  },

  getUnreadCount: async (isAdmin: boolean = true) => {
    const response = await api.get<number>(`/notifications/unread-count?isAdmin=${isAdmin}`);
    return response.data;
  }
};
