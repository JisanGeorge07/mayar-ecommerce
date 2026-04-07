import type { TranslatedText } from './index';

export interface OrderItem {
  productId: string;
  name: TranslatedText;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number; // KWD base
  lineTotal: number; // KWD base
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderAddress {
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flatOffice?: string;
  notes?: string;
}

export interface OrderShipping {
  id: string;
  name: TranslatedText;
  fee: number; // KWD base
  estimate: TranslatedText;
}

export interface OrderPayment {
  id: string;
  name: TranslatedText;
}

export type OrderStatus = 'confirmed' | 'paid' | 'processing' | 'shipped' | 'delivered';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  trackingId: string;
  createdAt: string;
  items: OrderItem[];
  customer: OrderCustomer;
  address: OrderAddress;
  shipping: OrderShipping;
  payment: OrderPayment;
  subtotal: number; // KWD base
  shippingTotal: number;
  discountTotal: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  gateway: string;
  message?: string;
}
