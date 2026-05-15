export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'refundedrequested'
  | 'returnedrequested';

export type PaymentMethod = 'credit_card' | 'myfatoorah' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type UpdateSource = 'admin' | 'warehouse' | 'courier' | 'customer_support' | 'system';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note: string;
  updatedBy: string;
  source: UpdateSource;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  currency: 'KWD';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  customerNote?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded',
  refundedrequested: 'Refund Requested',
  returnedrequested: 'Return Requested',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Credit Card',
  myfatoorah: 'MyFatoorah',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  cash_on_delivery: 'Cash on Delivery',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const UPDATE_SOURCE_LABELS: Record<UpdateSource, string> = {
  admin: 'Admin',
  warehouse: 'Warehouse Team',
  courier: 'Courier / Delivery Partner',
  customer_support: 'Customer Support',
  system: 'System (Automated)',
};

// Main progression flow (non-exception statuses)
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];
