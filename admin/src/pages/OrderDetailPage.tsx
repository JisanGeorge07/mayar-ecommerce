import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft, RefreshCw, User, MapPin, CreditCard,
  CheckCircle2, Clock, Package, Truck, Home, XCircle,
  RotateCcw, DollarSign, ChevronRight, MessageSquare,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getOrderById, updateOrderStatus } from '@/services/orderService';
import type { Order, OrderStatus, UpdateSource } from '@/types/order';
import {
  ORDER_STATUS_LABELS, ORDER_STATUS_FLOW,
  PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS,
  UPDATE_SOURCE_LABELS,
} from '@/types/order';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `KD ${n.toFixed(3)}`;

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-violet-100 text-violet-800 border-violet-200',
  shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  return_requested: 'bg-orange-100 text-orange-800 border-orange-200',
  returned: 'bg-gray-100 text-gray-700 border-gray-200',
  refund_requested: 'bg-rose-100 text-rose-800 border-rose-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
};

const paymentStatusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
};

const flowIconMap: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
  cancelled: XCircle,
  return_requested: RotateCcw,
  returned: RotateCcw,
  refund_requested: DollarSign,
  refunded: DollarSign,
};

const sourceColor: Record<string, string> = {
  admin: 'bg-blue-50 text-blue-700 border-blue-200',
  warehouse: 'bg-amber-50 text-amber-700 border-amber-200',
  courier: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  customer_support: 'bg-violet-50 text-violet-700 border-violet-200',
  system: 'bg-gray-100 text-gray-600 border-gray-200',
};

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery',
  'delivered', 'cancelled', 'return_requested', 'returned', 'refund_requested', 'refunded',
];

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-KW', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// ─── Status Stepper ───────────────────────────────────────────────────────────

function StatusStepper({ currentStatus }: { currentStatus: OrderStatus }) {
  const isException = ['cancelled', 'return_requested', 'returned', 'refund_requested', 'refunded'].includes(currentStatus);
  const currentFlowIdx = ORDER_STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between overflow-x-auto gap-1">
        {ORDER_STATUS_FLOW.map((step, idx) => {
          const Icon = flowIconMap[step];
          const isPast = !isException && idx < currentFlowIdx;
          const isCurrent = !isException && idx === currentFlowIdx;
          const isFuture = isException || idx > currentFlowIdx;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1 min-w-[72px]">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors
                  ${isPast ? 'border-green-500 bg-green-500 text-white' : ''}
                  ${isCurrent ? 'border-primary bg-primary text-primary-foreground' : ''}
                  ${isFuture ? 'border-muted bg-muted text-muted-foreground' : ''}
                `}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-center text-[10px] font-medium leading-tight
                  ${isPast ? 'text-green-600' : ''}
                  ${isCurrent ? 'text-primary' : ''}
                  ${isFuture ? 'text-muted-foreground' : ''}
                `}>
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
              {idx < ORDER_STATUS_FLOW.length - 1 && (
                <div className={`flex-1 h-0.5 min-w-[16px] transition-colors
                  ${isPast ? 'bg-green-400' : 'bg-muted'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isException && (
        <div className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${statusColor[currentStatus]}`}>
          {React.createElement(flowIconMap[currentStatus], { className: 'h-4 w-4' })}
          {ORDER_STATUS_LABELS[currentStatus]}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Status update form
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');
  const [updatedBy, setUpdatedBy] = useState('Admin');
  const [source, setSource] = useState<UpdateSource>('admin');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) load(id);
  }, [id]);

  const load = async (orderId: string) => {
    setLoading(true);
    try {
      const data = await getOrderById(orderId);
      if (!data) { toast.error('Order not found'); navigate('/orders'); return; }
      setOrder(data);
    } catch {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;
    if (!note.trim()) { toast.error('Please add a note describing this status update.'); return; }
    if (!updatedBy.trim()) { toast.error('Please enter who is updating this status.'); return; }

    setUpdating(true);
    try {
      const updated = await updateOrderStatus({
        orderId: order.id,
        status: newStatus,
        note: note.trim(),
        updatedBy: updatedBy.trim(),
        source,
      });
      setOrder(updated);
      setNewStatus('');
      setNote('');
      toast.success(`Status updated to "${ORDER_STATUS_LABELS[newStatus]}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) return null;

  const itemTotal = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-lg font-bold text-foreground">{order.orderNumber}</h1>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Placed on {formatDateTime(order.createdAt)} · {itemTotal} item{itemTotal !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${paymentStatusColor[order.paymentStatus]}`}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
            <span className="text-sm font-bold text-foreground">{fmt(order.total)}</span>
          </div>
        </div>

        {/* ── Status Stepper ── */}
        <StatusStepper currentStatus={order.status} />

        {/* ── Info Cards Row ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Customer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              <p className="text-muted-foreground">{order.customer.phone}</p>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5 text-sm">
              <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="text-muted-foreground">{order.shippingAddress.line2}</p>}
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-muted-foreground">
                {order.shippingAddress.country} {order.shippingAddress.postalCode}
              </p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${paymentStatusColor[order.paymentStatus]}`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tx ID</span>
                  <span className="font-mono text-xs">{order.transactionId}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coupon</span>
                  <span className="font-mono text-xs text-green-700">{order.couponCode}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Order Items ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-semibold text-xs text-muted-foreground">Product</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-xs text-muted-foreground">SKU</th>
                  <th className="px-4 py-2.5 text-center font-semibold text-xs text-muted-foreground">Qty</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-xs text-muted-foreground">Unit</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-xs text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-10 w-10 rounded-md object-cover border border-border"
                        />
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{fmt(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-border px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingFee === 0 ? 'Free' : fmt(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>- {fmt(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{fmt(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Customer Note ── */}
        {order.customerNote && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-4">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Customer Note</p>
                <p className="text-sm text-amber-900">{order.customerNote}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Bottom Row: Update Status + History ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Update Status Panel */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">New Status</Label>
                <Select value={newStatus} onValueChange={v => setNewStatus(v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status…" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.filter(s => s !== order.status).map(s => (
                      <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Updated By</Label>
                <Select value={source} onValueChange={v => {
                  const s = v as UpdateSource;
                  setSource(s);
                  const defaults: Record<UpdateSource, string> = {
                    admin: 'Admin',
                    warehouse: 'Warehouse Team',
                    courier: 'Courier / Delivery Partner',
                    customer_support: 'Customer Support',
                    system: 'System',
                  };
                  setUpdatedBy(defaults[s]);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(UPDATE_SOURCE_LABELS) as UpdateSource[]).map(s => (
                      <SelectItem key={s} value={s}>{UPDATE_SOURCE_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Note / Remark <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="Describe the status change (e.g. Dispatched via Aramex, tracking ARX-12345)"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleUpdateStatus}
                disabled={updating || !newStatus || !note.trim()}
              >
                {updating ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Updating…</>
                ) : (
                  'Update Status'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Order History Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {[...order.statusHistory].reverse().map((entry, idx, arr) => {
                  const Icon = flowIconMap[entry.status] ?? Clock;
                  return (
                    <div key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {idx < arr.length - 1 && (
                        <div className="absolute left-[14px] top-8 bottom-0 w-px bg-border" />
                      )}
                      <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${statusColor[entry.status]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-foreground">
                            {ORDER_STATUS_LABELS[entry.status]}
                          </span>
                          <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${sourceColor[entry.source]}`}>
                            {UPDATE_SOURCE_LABELS[entry.source]}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {entry.updatedBy} · {formatDateTime(entry.updatedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
