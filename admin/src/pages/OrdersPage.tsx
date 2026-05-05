import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShoppingBag, Clock, Settings2, Truck, CheckCircle2, DollarSign,
  Search, Eye, ChevronDown, RefreshCw, AlertTriangle, XCircle,
  RotateCcw, Ban,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { getOrders, updateOrderStatus } from '@/services/orderService';
import type { Order, OrderStatus, PaymentStatus } from '@/types/order';
import {
  ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS,
} from '@/types/order';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `KD ${n.toFixed(3)}`;

const statusVariant = (s: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (s === 'delivered' || s === 'returned' || s === 'refunded') return 'secondary';
  if (s === 'cancelled') return 'destructive';
  return 'default';
};

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

const paymentStatusColor: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-KW', { day: '2-digit', month: 'short', year: 'numeric' });

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery',
  'delivered', 'cancelled', 'return_requested', 'returned', 'refund_requested', 'refunded',
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color,
}: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick Status Dropdown ────────────────────────────────────────────────────

function QuickStatusUpdate({
  order,
  onUpdated,
}: { order: Order; onUpdated: (updated: Order) => void }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === order.status) return;
    setLoading(true);
    try {
      const updated = await updateOrderStatus({
        orderId: order.id,
        status: newStatus as OrderStatus,
        note: `Status updated to "${ORDER_STATUS_LABELS[newStatus as OrderStatus]}" from order list.`,
        updatedBy: 'Admin',
        source: 'admin',
      });
      onUpdated(updated);
      toast.success(`Order ${order.orderNumber} → ${ORDER_STATUS_LABELS[newStatus as OrderStatus]}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select value={order.status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className={`h-7 w-44 text-xs border font-medium ${statusColor[order.status]}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map(s => (
          <SelectItem key={s} value={s} className="text-xs">
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatus>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // ── Stats ──
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length;
    const shipped = orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders
      .filter(o => o.paymentStatus === 'paid' && o.status !== 'refunded')
      .reduce((sum, o) => sum + o.total, 0);
    return { total, pending, processing, shipped, delivered, revenue };
  }, [orders]);

  // ── Filtered + sorted list ──
  const filtered = useMemo(() => {
    let list = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.customer.phone.includes(q),
      );
    }
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (paymentFilter !== 'all') list = list.filter(o => o.paymentStatus === paymentFilter);

    list.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortOrder === 'highest') return b.total - a.total;
      return a.total - b.total;
    });

    return list;
  }, [orders, search, statusFilter, paymentFilter, sortOrder]);

  const handleOrderUpdated = (updated: Order) => {
    setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
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

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="bg-primary/10 text-primary" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-100 text-amber-700" />
          <StatCard label="Processing" value={stats.processing} icon={Settings2} color="bg-violet-100 text-violet-700" />
          <StatCard label="Shipped" value={stats.shipped} icon={Truck} color="bg-cyan-100 text-cyan-700" />
          <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle2} color="bg-green-100 text-green-700" />
          <StatCard label="Revenue" value={fmt(stats.revenue)} icon={DollarSign} color="bg-emerald-100 text-emerald-700" />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order #, name, email, phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ALL_STATUSES.map(s => (
                <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={v => setPaymentFilter(v as typeof paymentFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={v => setSortOrder(v as typeof sortOrder)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Total</SelectItem>
              <SelectItem value="lowest">Lowest Total</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={load} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* ── Table ── */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map(order => (
                <TableRow key={order.id} className="hover:bg-muted/40">
                  <TableCell>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="font-mono text-xs font-semibold text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </button>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-semibold text-sm">
                    {fmt(order.total)}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${paymentStatusColor[order.paymentStatus]}`}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <QuickStatusUpdate order={order} onUpdated={handleOrderUpdated} />
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status === 'pending' && (
                          <DropdownMenuItem
                            onClick={async () => {
                              const u = await updateOrderStatus({ orderId: order.id, status: 'confirmed', note: 'Confirmed by admin.', updatedBy: 'Admin', source: 'admin' });
                              handleOrderUpdated(u);
                              toast.success('Order confirmed');
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Confirm Order
                          </DropdownMenuItem>
                        )}
                        {['pending', 'confirmed', 'processing'].includes(order.status) && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={async () => {
                              const u = await updateOrderStatus({ orderId: order.id, status: 'cancelled', note: 'Cancelled by admin.', updatedBy: 'Admin', source: 'admin' });
                              handleOrderUpdated(u);
                              toast.success('Order cancelled');
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" /> Cancel Order
                          </DropdownMenuItem>
                        )}
                        {order.status === 'return_requested' && (
                          <DropdownMenuItem
                            onClick={async () => {
                              const u = await updateOrderStatus({ orderId: order.id, status: 'returned', note: 'Return approved and processed.', updatedBy: 'Admin', source: 'admin' });
                              handleOrderUpdated(u);
                              toast.success('Return approved');
                            }}
                          >
                            <RotateCcw className="mr-2 h-4 w-4 text-orange-600" /> Approve Return
                          </DropdownMenuItem>
                        )}
                        {order.status === 'refund_requested' && (
                          <DropdownMenuItem
                            onClick={async () => {
                              const u = await updateOrderStatus({ orderId: order.id, status: 'refunded', note: 'Refund processed.', updatedBy: 'Admin', source: 'admin' });
                              handleOrderUpdated(u);
                              toast.success('Refund processed');
                            }}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4 text-rose-600" /> Process Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>
    </AdminLayout>
  );
}
