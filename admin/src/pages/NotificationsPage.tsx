import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useNotifications, type Notification, type NotificationType, type NotificationPriority } from '@/context/NotificationContext';
import { Eye, CheckCircle2, Trash2, CheckCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPES: NotificationType[] = [
  'new_order', 'payment_success', 'payment_failed', 'new_customer',
  'low_stock', 'out_of_stock', 'support_request', 'delivery_update',
  'admin_announcement', 'system_alert',
];
const PRIORITIES: NotificationPriority[] = ['low', 'medium', 'high', 'critical'];
const typeLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

import { toast } from 'sonner';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, confirmNotification, deleteNotification } = useNotifications();
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [viewNotif, setViewNotif] = useState<Notification | null>(null);

  const filtered = notifications.filter(n => {
    if (filterType && n.type !== filterType) return false;
    if (filterStatus && n.status !== filterStatus) return false;
    if (filterRead === 'read' && !n.isRead) return false;
    if (filterRead === 'unread' && n.isRead) return false;
    return true;
  });

  const handleView = (n: Notification) => {
    markAsRead(n.id);
    setViewNotif(n);
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmNotification(id);
      toast.success('Notification confirmed');
    } catch {
      toast.error('Failed to confirm notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground mt-1">Review and confirm CMS notifications</p>
          </div>
          <button onClick={handleMarkAllAsRead} className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted transition-colors">
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select value={filterRead} onChange={e => setFilterRead(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Confirmed</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id} className={cn('border-b border-border last:border-0', !n.isRead && 'bg-primary/5')}>
                  <td className="px-4 py-3 font-medium">{n.titleEnglish}</td>
                  <td className="px-4 py-3">{typeLabel(n.type)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold',
                      n.priority === 'critical' && 'bg-destructive/10 text-destructive',
                      n.priority === 'high' && 'bg-warning/10 text-warning',
                      n.priority === 'medium' && 'bg-primary/10 text-primary',
                      n.priority === 'low' && 'bg-muted text-muted-foreground',
                    )}>{n.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold',
                      n.status === 'published' && 'bg-success/10 text-success',
                      n.status === 'draft' && 'bg-muted text-muted-foreground',
                    )}>{n.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {n.isConfirmed ? (
                      <span className="rounded-full bg-success/10 text-success px-2 py-0.5 text-xs font-semibold">Confirmed</span>
                    ) : (
                      <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-xs font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(n)} className="rounded p-1 hover:bg-muted" title="View"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                      {!n.isConfirmed && (
                        <button onClick={() => handleConfirm(n.id)} className="rounded p-1 hover:bg-success/10" title="Confirm">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(n.id)} className="rounded p-1 hover:bg-destructive/10" title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No notifications found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail View Modal */}
        {viewNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-foreground">{viewNotif.titleEnglish}</h3>
                <button onClick={() => setViewNotif(null)} className="rounded p-1 hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4 bg-background">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{viewNotif.messageEnglish}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="text-sm font-medium">{typeLabel(viewNotif.type)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Priority</p>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold',
                      viewNotif.priority === 'critical' && 'bg-destructive/10 text-destructive',
                      viewNotif.priority === 'high' && 'bg-warning/10 text-warning',
                      viewNotif.priority === 'medium' && 'bg-primary/10 text-primary',
                      viewNotif.priority === 'low' && 'bg-muted text-muted-foreground',
                    )}>{viewNotif.priority}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-medium">{viewNotif.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-medium">{new Date(viewNotif.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confirmation</p>
                    {viewNotif.isConfirmed ? (
                      <span className="rounded-full bg-success/10 text-success px-2 py-0.5 text-xs font-semibold">Confirmed</span>
                    ) : (
                      <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-xs font-semibold">Pending</span>
                    )}
                  </div>
                  {viewNotif.confirmedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confirmed At</p>
                      <p className="text-sm font-medium">{new Date(viewNotif.confirmedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {viewNotif.confirmedBy && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confirmed By</p>
                      <p className="text-sm font-medium">{viewNotif.confirmedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                {!viewNotif.isConfirmed && (
                  <button onClick={() => { handleConfirm(viewNotif.id); setViewNotif({ ...viewNotif, isConfirmed: true, confirmedAt: new Date().toISOString(), confirmedBy: 'Admin' } as any); }}
                    className="flex items-center gap-1.5 rounded-md bg-success px-4 py-2 text-sm font-semibold text-success-foreground hover:bg-success/90 transition-colors">
                    <CheckCircle2 className="h-4 w-4" /> Confirm
                  </button>
                )}
                <button onClick={() => setViewNotif(null)} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
