import api from '@/lib/axios';
import type { OrderRecord, PaymentResult } from '@/types/order';
import type { CartItem } from '@/types/cart';
import type { CheckoutState } from '@/types/checkout';
import type { ShippingMethod, PaymentMethod } from '@/types/checkout';

// Helper to validate GUID format
const isValidGuid = (value: string | undefined): boolean => {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

// Types for API requests/responses
interface CreateOrderRequest {
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
    floor?: string;
    flatOffice?: string;
    notes?: string;
  };
  savedAddressId?: string;
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
  totals: {
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
  };
  promoCode?: string;
  couponCodeId?: string;
  currency?: string;
}

interface OrderApiResponse {
  id: string;
  orderNumber: string;
  trackingId: string;
  createdAt: string;
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
    floor?: string;
    flatOffice?: string;
    notes?: string;
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
  items: Array<{
    productId: string;
    name: { en: string; ar: string };
    image: string;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  promoCode?: string;
  total: number;
  status: string;
  paymentStatus: string;
}

// Convert API response to OrderRecord
const mapApiResponseToOrderRecord = (response: OrderApiResponse): OrderRecord => ({
  id: response.id,
  orderNumber: response.orderNumber,
  trackingId: response.trackingId,
  createdAt: response.createdAt,
  customer: response.customer,
  address: response.address,
  shipping: response.shipping,
  payment: response.payment,
  items: response.items,
  subtotal: response.subtotal,
  shippingTotal: response.shippingTotal,
  discountTotal: response.discountTotal,
  promoCode: response.promoCode,
  total: response.total,
  status: response.status as OrderRecord['status'],
});

// Create a new order
export const createOrder = async (
  checkoutState: CheckoutState,
  cartItems: CartItem[],
  shippingMethod: ShippingMethod,
  paymentMethod: PaymentMethod,
  totals: { subtotal: number; discount: number; shippingCost: number; total: number; promoCode?: string; couponCodeId?: string },
  currency: string = 'KWD'
): Promise<OrderRecord> => {
  const request: CreateOrderRequest = {
    customer: { ...checkoutState.customer },
    address: {
      area: checkoutState.address.area,
      block: checkoutState.address.block,
      street: checkoutState.address.street,
      building: checkoutState.address.building,
      floor: checkoutState.address.floor || undefined,
      flatOffice: checkoutState.address.flat || undefined,
      notes: checkoutState.address.notes || undefined,
    },
    savedAddressId: isValidGuid(checkoutState.selectedAddressId)
      ? checkoutState.selectedAddressId
      : undefined,
    shippingMethod: {
      id: shippingMethod.id,
      name: { en: shippingMethod.name.en, ar: shippingMethod.name.ar },
      estimate: { en: shippingMethod.estimatedDays.en, ar: shippingMethod.estimatedDays.ar },
      price: shippingMethod.price,
    },
    paymentMethodId: paymentMethod.id,
    items: cartItems.map(item => ({
      productId: item.productId,
      variantId: isValidGuid(item.variantId) ? item.variantId : undefined,
      nameEn: item.name.en,
      nameAr: item.name.ar,
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingCost: totals.shippingCost,
      total: totals.total,
    },
    promoCode: totals.promoCode,
    couponCodeId: totals.couponCodeId,
    currency: currency,
  };

  console.log('Creating order with request:', request);

  try {
    const response = await api.post<OrderApiResponse>('/order', request);
    console.log('Order API response:', response.data);
    return mapApiResponseToOrderRecord(response.data);
  } catch (error: any) {
    console.error('Order creation failed:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error message:', error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create order');
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<OrderRecord | null> => {
  try {
    const response = await api.get<OrderApiResponse>(`/order/${orderId}`);
    return mapApiResponseToOrderRecord(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Get order by order number
export const getOrderByNumber = async (orderNumber: string): Promise<OrderRecord | null> => {
  try {
    const response = await api.get<OrderApiResponse>(`/order/by-number/${orderNumber}`);
    return mapApiResponseToOrderRecord(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Get order tracking info
export const getOrderTracking = async (orderId: string): Promise<{
  trackingId: string;
  status: OrderRecord['status'];
  estimatedDelivery: string;
} | null> => {
  const order = await getOrderById(orderId);
  if (!order) return null;
  return {
    trackingId: order.trackingId,
    status: order.status,
    estimatedDelivery: order.shipping.estimate.en,
  };
};

// Get order history for current user
export const getOrderHistory = async (): Promise<OrderRecord[]> => {
  const response = await api.get<OrderApiResponse[]>('/order');
  return response.data.map(mapApiResponseToOrderRecord);
};

// Cancel an order
export const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
  try {
    await api.post(`/order/${orderId}/cancel`, { reason });
    return true;
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return false;
  }
};

// Payment processing (placeholder - actual payment is handled by backend)
export const processPayment = async (
  paymentMethodId: string,
  _total: number
): Promise<PaymentResult> => {
  // This is now handled by the backend payment service
  // This function is kept for backwards compatibility
  return {
    success: true,
    transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
    gateway: paymentMethodId,
  };
};
