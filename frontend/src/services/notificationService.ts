import api from '@/lib/axios';

export interface TranslatedText {
  en: string;
  ar: string;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'delivery' | 'promo' | 'account';
  title: TranslatedText;
  message: TranslatedText;
  date: string;
  read: boolean;
}

export const notificationService = {
  getUserNotifications: async () => {
    const response = await api.get<any[]>('/notifications');
    return response.data.map(n => ({
      id: n.id,
      type: n.type,
      title: { en: n.titleEnglish, ar: n.titleArabic },
      message: { en: n.messageEnglish, ar: n.messageArabic },
      date: n.createdAt,
      read: n.isRead
    })) as NotificationItem[];
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all?isAdmin=false');
  },

  getUnreadCount: async () => {
    const response = await api.get<number>('/notifications/unread-count?isAdmin=false');
    return response.data;
  }
};
