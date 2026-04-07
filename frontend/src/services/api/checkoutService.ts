import type { CheckoutState, OrderConfirmation } from '@/types/checkout';

const CHECKOUT_KEY = 'mayar_checkout';

export const loadCheckout = (): CheckoutState => {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return getDefaultCheckout();
};

export const saveCheckout = (state: CheckoutState): void => {
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(state));
};

export const clearCheckoutStorage = (): void => {
  sessionStorage.removeItem(CHECKOUT_KEY);
};

export const getDefaultCheckout = (): CheckoutState => ({
  customer: { firstName: '', lastName: '', email: '', phone: '' },
  address: { area: '', block: '', street: '', building: '', floor: '', flat: '', notes: '' },
  selectedAddressId: undefined,
  shippingMethodId: 'local',
  paymentMethodId: '',
  agreedToTerms: false,
});

/** Mock API — will be replaced by real POST /api/orders */
export const submitOrder = async (
  _state: CheckoutState,
  _cartTotal: number
): Promise<OrderConfirmation> => {
  await new Promise(r => setTimeout(r, 1500));
  return {
    orderId: `MYR-${Date.now().toString(36).toUpperCase()}`,
    orderDate: new Date().toISOString(),
    estimatedDelivery: '3–5 business days',
    total: _cartTotal,
  };
};
