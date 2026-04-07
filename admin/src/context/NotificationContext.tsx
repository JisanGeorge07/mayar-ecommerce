import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType =
  | 'new_order' | 'payment_success' | 'payment_failed'
  | 'new_customer' | 'low_stock' | 'out_of_stock'
  | 'support_request' | 'delivery_update'
  | 'admin_announcement' | 'system_alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationStatus = 'draft' | 'published' | 'scheduled';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  read: boolean;
  isConfirmed?: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
  createdBy?: string;
  targetModule?: string;
  referenceType?: string;
  referenceId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  createNotification: (data: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  updateNotification: (id: string, data: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1', title: 'New order placed', message: 'Order #1024 has been placed by Ahmed K.',
    type: 'new_order', priority: 'high', status: 'published', read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'n-2', title: 'Low stock alert', message: 'Classic Polo Shirt (White, L) has only 3 units left.',
    type: 'low_stock', priority: 'medium', status: 'published', read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n-3', title: 'Payment received', message: 'Payment of 45 KWD received for order #1023.',
    type: 'payment_success', priority: 'low', status: 'published', read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'n-4', title: 'New customer registered', message: 'Sara M. has created a new account.',
    type: 'new_customer', priority: 'low', status: 'published', read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read && n.status === 'published').length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const createNotification = useCallback((data: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const notif: Notification = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
    return notif;
  }, []);

  const updateNotification = useCallback((id: string, data: Partial<Notification>) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, markAsRead, markAllAsRead,
      createNotification, updateNotification, deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
