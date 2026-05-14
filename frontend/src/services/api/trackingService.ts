import api from '@/lib/axios';
import type { TrackingShipment, TrackingStep } from '@/types/tracking';

// ─── Backend order DTO shape (what the API returns) ───────────────────────────

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
  items: Array<{
    productId: string;
    name: { en: string; ar: string };
    image: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  status: string;
  paymentStatus: string;
  statusHistory: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string | null;
    note: string | null;
    updatedByName: string | null;
    source: string | null;
    createdAt: string;
  }>;
}

// ─── The 8 tracking steps in order ───────────────────────────────────────────

const TRACKING_STEPS_TEMPLATE: Array<{
  backendStatus: string;
  label: { en: string; ar: string };
}> = [
  { backendStatus: 'pending',        label: { en: 'Order Placed',          ar: 'تم تقديم الطلب' } },
  { backendStatus: 'confirmed',      label: { en: 'Order Confirmed',      ar: 'تم تأكيد الطلب' } },
  { backendStatus: 'packed',         label: { en: 'Packed',                ar: 'تم التغليف' } },
  { backendStatus: 'pickedup',       label: { en: 'Picked Up',            ar: 'تم الاستلام' } },
  { backendStatus: 'intransit',      label: { en: 'In Transit',           ar: 'في الطريق' } },
  { backendStatus: 'arrivedathub',   label: { en: 'Arrived at Local Hub', ar: 'وصل إلى المركز المحلي' } },
  { backendStatus: 'outfordelivery', label: { en: 'Out for Delivery',     ar: 'في الطريق للتوصيل' } },
  { backendStatus: 'delivered',      label: { en: 'Delivered',            ar: 'تم التوصيل' } },
];

// ─── Status label mapping ────────────────────────────────────────────────────

const STATUS_DISPLAY: Record<string, { en: string; ar: string }> = {
  pending:        { en: 'Order Placed',          ar: 'تم تقديم الطلب' },
  confirmed:      { en: 'Confirmed',             ar: 'تم التأكيد' },
  packed:         { en: 'Packed',                ar: 'تم التغليف' },
  pickedup:       { en: 'Picked Up',             ar: 'تم الاستلام' },
  intransit:      { en: 'In Transit',            ar: 'في الطريق' },
  arrivedathub:   { en: 'At Local Hub',          ar: 'في المركز المحلي' },
  outfordelivery: { en: 'Out for Delivery',      ar: 'في الطريق للتوصيل' },
  delivered:      { en: 'Delivered',             ar: 'تم التوصيل' },
  cancelled:      { en: 'Cancelled',             ar: 'ملغي' },
};

// ─── Map backend order → TrackingShipment ────────────────────────────────────

function mapOrderToTrackingShipment(order: BackendOrderDto): TrackingShipment {
  const customerName = [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || 'Customer';
  const currentStatus = order.status?.toLowerCase() ?? 'pending';

  // Build address line
  const addressParts = [
    order.address.block && `Block ${order.address.block}`,
    order.address.street && `Street ${order.address.street}`,
    order.address.building && `Building ${order.address.building}`,
    order.address.floor && `Floor ${order.address.floor}`,
    order.address.flatOffice && `Flat ${order.address.flatOffice}`,
  ].filter(Boolean).join(', ');

  // Build a lookup of which statuses have been reached and when
  const historyMap = new Map<string, { timestamp: string; note: string | null }>();
  for (const h of (order.statusHistory ?? [])) {
    if (h.toStatus) {
      const key = h.toStatus.toLowerCase();
      historyMap.set(key, { timestamp: h.createdAt, note: h.note });
    }
  }

  // Determine the index of the current status in the progression
  const currentStepIndex = TRACKING_STEPS_TEMPLATE.findIndex(
    s => s.backendStatus === currentStatus
  );

  // Build the steps array
  const steps: TrackingStep[] = TRACKING_STEPS_TEMPLATE.map((template, index) => {
    const history = historyMap.get(template.backendStatus);
    let status: 'completed' | 'active' | 'pending';

    if (currentStatus === 'cancelled') {
      // If cancelled, mark everything up to where it was as completed, rest pending
      status = history ? 'completed' : 'pending';
    } else if (index < currentStepIndex) {
      status = 'completed';
    } else if (index === currentStepIndex) {
      status = 'active';
    } else {
      status = 'pending';
    }

    return {
      id: String(index + 1),
      label: template.label,
      status,
      timestamp: history?.timestamp,
      note: history?.note ? { en: history.note, ar: history.note } : undefined,
    };
  });

  // Payment type display
  const paymentId = order.payment?.id?.toLowerCase() ?? '';
  const paymentType = paymentId === 'cashondelivery' ? 'Cash on Delivery' : 'Prepaid';

  // Calculate item count
  const itemCount = (order.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  // Find shipped/dispatch date from history
  const shippedEntry = historyMap.get('pickedup') || historyMap.get('intransit');

  // Current status display text
  const statusDisplay = STATUS_DISPLAY[currentStatus] ?? { en: currentStatus, ar: currentStatus };

  return {
    trackingId: order.trackingId,
    orderId: order.orderNumber,
    currentStatus: statusDisplay,
    estimatedDelivery: order.shipping?.estimate?.en || undefined,
    lastUpdated: order.updatedAt || order.createdAt,
    courierName: 'Mayar Express',
    packageType: 'Standard Parcel',
    paymentType,
    orderDate: order.createdAt,
    dispatchDate: shippedEntry?.timestamp,
    itemCount,
    deliveryNotes: order.address.notes || undefined,
    address: {
      fullName: customerName,
      addressLine1: addressParts || 'N/A',
      area: order.address.area || '',
      city: order.address.area || 'Kuwait',
      country: 'Kuwait',
    },
    contact: {
      contactPerson: customerName,
      mobileNumber: order.customer.phone || '',
    },
    steps,
  };
}

// ─── Service methods ─────────────────────────────────────────────────────────

export const trackingService = {
  /**
   * Look up a shipment by tracking ID + mobile number.
   * Calls: GET /api/Order/by-tracking/{trackingId}?phone={phone}
   */
  trackShipment: async (
    mobileNumber: string,
    trackingId: string
  ): Promise<TrackingShipment | null> => {
    try {
      const normalized = trackingId.trim();
      const phone = mobileNumber.trim();
      const { data } = await api.get<BackendOrderDto>(
        `/Order/by-tracking/${encodeURIComponent(normalized)}`,
        { params: phone ? { phone } : undefined }
      );
      return data ? mapOrderToTrackingShipment(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get tracking by ID alone (used when navigating from account orders).
   * Calls: GET /api/Order/by-tracking/{trackingId} (no phone validation)
   */
  getTrackingById: async (
    trackingId: string
  ): Promise<TrackingShipment | null> => {
    try {
      const normalized = trackingId.trim();
      const { data } = await api.get<BackendOrderDto>(
        `/Order/by-tracking/${encodeURIComponent(normalized)}`
      );
      return data ? mapOrderToTrackingShipment(data) : null;
    } catch {
      return null;
    }
  },
};
