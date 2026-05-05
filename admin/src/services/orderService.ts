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

// In-memory store so updates persist within a session
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
    id: `sh-${Date.now()}`,
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

  // TODO (backend):
  // const { data } = await api.put(`/Order/${payload.orderId}/status`, {
  //   status: payload.status,
  //   note: payload.note,
  //   updatedBy: payload.updatedBy,
  //   source: payload.source,
  // });
  // return data.data;
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
