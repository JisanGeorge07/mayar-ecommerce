/**
 * Order Service
 *
 * Currently operates on local sample data.
 * To connect to the backend, replace each method body with the
 * corresponding axios call (examples shown in comments).
 *
 * Backend base: /api/Order
 */

import { sampleOrders } from '@/data/sampleOrders';
import type { Order, OrderStatus, StatusHistoryEntry, UpdateSource } from '@/types/order';

let _orders: Order[] = [...sampleOrders];

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ─── Fetch all orders ─────────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  await delay();
  return [..._orders];
  // TODO (backend): const { data } = await api.get('/Order/get-all'); return data.data;
}

// ─── Fetch single order ───────────────────────────────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  await delay();
  return _orders.find(o => o.id === id) ?? null;
  // TODO (backend): const { data } = await api.get(`/Order/${id}`); return data.data;
}

// ─── Update order status ──────────────────────────────────────────────────────
export interface UpdateStatusPayload {
  orderId: string;
  status: OrderStatus;
  note: string;
  updatedBy: string;
  source: UpdateSource;
}

export async function updateOrderStatus(payload: UpdateStatusPayload): Promise<Order> {
  await delay();
  const idx = _orders.findIndex(o => o.id === payload.orderId);
  if (idx === -1) throw new Error('Order not found');

  const entry: StatusHistoryEntry = {
    id: `sh-${Date.now()}-${Math.random()}`,
    status: payload.status,
    note: payload.note,
    updatedBy: payload.updatedBy,
    source: payload.source,
    updatedAt: new Date().toISOString(),
  };

  _orders[idx] = {
    ..._orders[idx],
    status: payload.status,
    statusHistory: [..._orders[idx].statusHistory, entry],
    updatedAt: new Date().toISOString(),
  };

  return { ..._orders[idx] };
  // TODO (backend): const { data } = await api.put(`/Order/${payload.orderId}/status`, payload); return data.data;
}

// ─── Bulk update status ───────────────────────────────────────────────────────
export async function bulkUpdateOrderStatus(
  ids: string[],
  status: OrderStatus,
  note: string,
  updatedBy: string,
  source: UpdateSource,
): Promise<Order[]> {
  const results: Order[] = [];
  for (const id of ids) {
    const updated = await updateOrderStatus({ orderId: id, status, note, updatedBy, source });
    results.push(updated);
  }
  return results;
  // TODO (backend): const { data } = await api.put('/Order/bulk-status', { ids, status, note, updatedBy, source }); return data.data;
}

// ─── Delete order ─────────────────────────────────────────────────────────────
export async function deleteOrder(id: string): Promise<void> {
  await delay();
  _orders = _orders.filter(o => o.id !== id);
  // TODO (backend): await api.delete(`/Order/${id}`);
}

// ─── Bulk delete orders ───────────────────────────────────────────────────────
export async function deleteOrders(ids: string[]): Promise<void> {
  await delay();
  _orders = _orders.filter(o => !ids.includes(o.id));
  // TODO (backend): await api.post('/Order/bulk-delete', { ids });
}

// ─── Create order (manual) ────────────────────────────────────────────────────
export type CreateOrderPayload = Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>;

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  await delay();
  const newOrder: Order = {
    ...payload,
    id: `order-${Date.now()}`,
    orderNumber: `ORD-2025-${String(_orders.length + 1).padStart(4, '0')}`,
    statusHistory: [
      {
        id: `sh-${Date.now()}`,
        status: payload.status,
        note: 'Order created manually by admin.',
        updatedBy: 'Admin',
        source: 'admin',
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  _orders.unshift(newOrder);
  return { ...newOrder };
  // TODO (backend): const { data } = await api.post('/Order/create', payload); return data.data;
}

// ─── Update admin note ────────────────────────────────────────────────────────
export async function updateAdminNote(orderId: string, note: string): Promise<Order> {
  await delay();
  const idx = _orders.findIndex(o => o.id === orderId);
  if (idx === -1) throw new Error('Order not found');
  _orders[idx] = { ..._orders[idx], adminNote: note, updatedAt: new Date().toISOString() };
  return { ..._orders[idx] };
  // TODO (backend): const { data } = await api.patch(`/Order/${orderId}/admin-note`, { note }); return data.data;
}
