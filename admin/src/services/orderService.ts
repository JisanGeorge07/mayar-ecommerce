/**
 * Order Service
 *
 * Connects to the backend API for all order operations.
 * Backend base: /api/Order
 */

import api from '@/lib/axios';
import type { Order, OrderStatus, StatusHistoryEntry, UpdateSource } from '@/types/order';

// ─── Backend DTO types (what the API returns) ─────────────────────────────────

interface BackendOrderDto {
  id: string;
  orderNumber: string;
  trackingId: string;
  createdAt: string;
  updatedAt: string | null;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    area: string;
    block: string;
    street: string;
    building: string;
    floor: string | null;
    flatOffice: string | null;
    notes: string | null;
  };
  shipping: {
    id: string;
    name: { en: string; ar: string };
    fee: number;
    estimate: { en: string; ar: string };
  };
  payment: {
    id: string;
    name: { en: string; ar: string };
  };
  items: BackendOrderItemDto[];
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  promoCode: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  notes: string | null;
  adminNote: string | null;
  statusHistory: BackendStatusHistoryDto[];
}

interface BackendOrderItemDto {
  productId: string;
  variantId: string | null;
  name: { en: string; ar: string };
  image: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface BackendStatusHistoryDto {
  id: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  updatedByName: string | null;
  source: string | null;
  changedBy: string | null;
  createdAt: string;
}

// ─── Status mapping (backend enum → frontend type) ───────────────────────────

const BACKEND_STATUS_MAP: Record<string, OrderStatus> = {
  pending: 'pending',
  confirmed: 'confirmed',
  packed: 'processing',
  pickedup: 'shipped',
  intransit: 'shipped',
  arrivedathub: 'out_for_delivery',
  outfordelivery: 'out_for_delivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

export const FRONTEND_TO_BACKEND_STATUS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Packed',
  shipped: 'PickedUp',
  out_for_delivery: 'OutForDelivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Cancelled',
  returned: 'Cancelled',
  refund_requested: 'Cancelled',
  refunded: 'Cancelled',
};

function mapBackendStatus(backendStatus: string): OrderStatus {
  return BACKEND_STATUS_MAP[backendStatus.toLowerCase()] ?? 'pending';
}

// ─── Payment mapping ──────────────────────────────────────────────────────────

type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery' | 'myfatoorah';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

function mapPaymentMethod(backendPaymentId: string): PaymentMethod {
  const id = backendPaymentId.toLowerCase();
  if (id === 'cashondelivery' || id === 'cash_on_delivery') return 'cash_on_delivery';
  if (id === 'myfatoorah') return 'myfatoorah';
  return 'credit_card';
}

function mapPaymentStatus(backendStatus: string): PaymentStatus {
  const s = backendStatus.toLowerCase();
  if (s === 'paid') return 'paid';
  if (s === 'failed') return 'failed';
  if (s === 'refunded' || s === 'partiallyrefunded') return 'refunded';
  return 'pending';
}

// ─── Source mapping ───────────────────────────────────────────────────────────

function mapSource(source: string | null): UpdateSource {
  if (!source) return 'system';
  const s = source.toLowerCase();
  if (s === 'admin') return 'admin';
  if (s === 'warehouse') return 'warehouse';
  if (s === 'courier') return 'courier';
  if (s === 'customer_support') return 'customer_support';
  return 'system';
}

// ─── DTO → Frontend mapping ──────────────────────────────────────────────────

function mapOrderDtoToOrder(dto: BackendOrderDto): Order {
  const customerName = [dto.customer.firstName, dto.customer.lastName].filter(Boolean).join(' ') || 'Guest';

  // Build address line from Kuwait-style fields
  const addressParts = [
    dto.address.area && `Area: ${dto.address.area}`,
    dto.address.block && `Block ${dto.address.block}`,
    dto.address.street && `Street ${dto.address.street}`,
    dto.address.building && `Building ${dto.address.building}`,
    dto.address.floor && `Floor ${dto.address.floor}`,
    dto.address.flatOffice && `Flat/Office ${dto.address.flatOffice}`,
  ].filter(Boolean).join(', ');

  const statusHistory: StatusHistoryEntry[] = (dto.statusHistory ?? []).map(h => ({
    id: h.id,
    status: mapBackendStatus(h.toStatus ?? 'pending'),
    note: h.note ?? '',
    updatedBy: h.updatedByName ?? 'System',
    source: mapSource(h.source),
    updatedAt: h.createdAt,
  }));

  return {
    id: dto.id,
    orderNumber: dto.orderNumber ?? '',
    customer: {
      id: dto.id,
      name: customerName,
      email: dto.customer.email ?? '',
      phone: dto.customer.phone ?? '',
    },
    shippingAddress: {
      fullName: customerName,
      line1: addressParts || 'N/A',
      line2: dto.address.notes ?? undefined,
      city: dto.address.area || 'Kuwait',
      state: '',
      country: 'Kuwait',
      postalCode: '',
    },
    items: (dto.items ?? []).map(item => ({
      id: `${item.productId}-${item.variantId ?? 'default'}`,
      productId: item.productId,
      productName: item.name?.en || item.name?.ar || 'Product',
      productImage: item.image || 'https://placehold.co/60x60/888/white?text=Item',
      variant: [item.color, item.size].filter(Boolean).join(' / ') || 'Default',
      sku: item.sku ?? '',
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice ?? 0,
      totalPrice: item.lineTotal ?? 0,
    })),
    subtotal: dto.subtotal ?? 0,
    shippingFee: dto.shippingTotal ?? 0,
    discount: dto.discountTotal ?? 0,
    couponCode: dto.promoCode ?? undefined,
    total: dto.total ?? 0,
    currency: 'KWD',
    paymentMethod: mapPaymentMethod(dto.payment?.id ?? 'credit_card'),
    paymentStatus: mapPaymentStatus(dto.paymentStatus ?? 'pending'),
    transactionId: dto.trackingId || undefined,
    status: mapBackendStatus(dto.status ?? 'pending'),
    statusHistory,
    customerNote: dto.notes ?? undefined,
    adminNote: dto.adminNote ?? undefined,
    createdAt: dto.createdAt ?? new Date().toISOString(),
    updatedAt: dto.updatedAt ?? dto.createdAt ?? new Date().toISOString(),
  };
}

// ─── Fetch all orders (admin) ─────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<BackendOrderDto[]>('/Order/admin/all');
  return (data ?? []).map(mapOrderDtoToOrder);
}

// ─── Fetch single order (admin – no user scoping) ─────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data } = await api.get<BackendOrderDto>(`/Order/admin/${id}`);
    return data ? mapOrderDtoToOrder(data) : null;
  } catch {
    return null;
  }
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
  const backendStatus = FRONTEND_TO_BACKEND_STATUS[payload.status] ?? 'Pending';
  const { data } = await api.patch<BackendOrderDto>(`/Order/${payload.orderId}/status`, {
    status: backendStatus,
    note: payload.note,
    updatedByName: payload.updatedBy,
    source: payload.source,
  });
  return mapOrderDtoToOrder(data);
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
}

// ─── Delete order (soft delete) ───────────────────────────────────────────────
export async function deleteOrder(id: string): Promise<void> {
  await api.delete(`/Order/admin/${id}`);
}

// ─── Bulk delete orders (soft delete) ─────────────────────────────────────────
export async function deleteOrders(ids: string[]): Promise<void> {
  await api.post('/Order/admin/bulk-delete', { ids });
}

// ─── Create order (manual – admin panel) ──────────────────────────────────────
export interface CreateOrderPayload {
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: {
    area: string;
    block: string;
    street: string;
    building: string;
    floor?: string;
    flatOffice?: string;
    notes?: string;
  };
  shippingMethod: {
    id: string;
    name: { en: string; ar: string };
    estimate: { en: string; ar: string };
    price: number;
  };
  paymentMethodId: string;
  items: Array<{
    productId: string;
    variantId?: string;
    nameEn: string;
    nameAr: string;
    image: string;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
  }>;
  totals: { subtotal: number; discount: number; shippingCost: number; total: number };
  currency: string;
  status?: string;
  paymentStatus?: string;
}

export type AdminCreateOrderPayload = CreateOrderPayload;

export async function createOrder(payload: any): Promise<Order> {
  const { data } = await api.post<BackendOrderDto>('/Order/admin/create', payload);
  return mapOrderDtoToOrder(data);
}

// ─── Update admin note ────────────────────────────────────────────────────────
export async function updateAdminNote(orderId: string, note: string): Promise<Order> {
  const { data } = await api.patch<BackendOrderDto>(`/Order/admin/${orderId}/admin-note`, { note });
  return mapOrderDtoToOrder(data);
}
