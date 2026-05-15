import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShoppingBag, Clock, Settings2, Truck, CheckCircle2, DollarSign,
  Search, Eye, RefreshCw, AlertTriangle, XCircle, RotateCcw, Ban,
  Plus, Trash2, Download, Upload, Printer, ChevronLeft, ChevronRight,
  X, FileText, ChevronsLeft, ChevronsRight, Filter,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getOrders, updateOrderStatus, bulkUpdateOrderStatus,
  deleteOrder, deleteOrders, createOrder,
  type CreateOrderPayload, FRONTEND_TO_BACKEND_STATUS
} from '@/services/orderService';
import { productService } from '@/services';
import { Product, ProductVariant } from '@/types';
import type { Order, OrderStatus, PaymentMethod, PaymentStatus, UpdateSource } from '@/types/order';
import {
  ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, UPDATE_SOURCE_LABELS,
} from '@/types/order';

// ─── Display constants ────────────────────────────────────────────────────────

const fmt = (n: number) => `KD ${n.toFixed(3)}`;

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-violet-100 text-violet-800 border-violet-200',
  shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  returned: 'bg-gray-100 text-gray-700 border-gray-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
  refundedrequested: 'bg-rose-100 text-rose-800 border-rose-200',
  returnedrequested: 'bg-orange-100 text-orange-800 border-orange-200',
};

const paymentStatusColor: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
};

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery',
  'delivered', 'cancelled', 'returnedrequested', 'returned', 'refundedrequested', 'refunded',
];

const PAGE_SIZES = [10, 25, 50, 100];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-KW', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Invoice printer ──────────────────────────────────────────────────────────

function printInvoice(order: Order) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) { toast.error('Pop-up blocked. Allow pop-ups and try again.'); return; }
  const itemRows = order.items.map(i => `
    <tr>
      <td>${i.productName}</td>
      <td style="color:#888;font-size:12px">${i.variant} · ${i.sku}</td>
      <td style="text-align:center">${i.quantity}</td>
      <td style="text-align:right">KD ${i.unitPrice.toFixed(3)}</td>
      <td style="text-align:right">KD ${i.totalPrice.toFixed(3)}</td>
    </tr>`).join('');
  const discountRow = order.discount > 0
    ? `<tr><td colspan="4" style="text-align:right;color:#16a34a">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td><td style="text-align:right;color:#16a34a">- KD ${order.discount.toFixed(3)}</td></tr>`
    : '';
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Invoice – ${order.orderNumber}</title>
  <style>
    *{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:14px;color:#333;margin:0;padding:28px}
    .hdr{display:flex;justify-content:space-between;margin-bottom:28px}
    .co{font-size:22px;font-weight:700;color:#1a1a2e}.inv{font-size:26px;font-weight:700;color:#888}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
    .box h3{font-size:11px;text-transform:uppercase;color:#999;margin:0 0 6px;letter-spacing:.5px}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#f5f5f5;padding:9px 10px;text-align:left;font-size:11px;text-transform:uppercase;color:#666}
    td{padding:9px 10px;border-bottom:1px solid #eee}
    .tot td{font-weight:700;font-size:15px;border-bottom:none}
    .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700}
    .paid{background:#d1fae5;color:#065f46}.pending{background:#fef3c7;color:#92400e}
    .failed{background:#fee2e2;color:#991b1b}.refunded{background:#ede9fe;color:#5b21b6}
    .footer{margin-top:24px;display:flex;justify-content:space-between;align-items:flex-end}
    @media print{body{padding:0}}
  </style></head><body>
  <div class="hdr">
    <div><div class="co">Mayar International</div><div style="color:#aaa;font-size:12px;margin-top:3px">mayarshop.com · support@mayarshop.com</div></div>
    <div style="text-align:right"><div class="inv">INVOICE</div><div style="color:#888;font-size:13px">${order.orderNumber}</div><div style="color:#aaa;font-size:12px">Date: ${formatDate(order.createdAt)}</div></div>
  </div>
  <div class="grid2">
    <div class="box"><h3>Bill To</h3><strong>${order.customer.name}</strong><br>${order.customer.email}<br>${order.customer.phone}</div>
    <div class="box"><h3>Ship To</h3><strong>${order.shippingAddress.fullName}</strong><br>${order.shippingAddress.line1}<br>${order.shippingAddress.city}, ${order.shippingAddress.state}<br>${order.shippingAddress.country} ${order.shippingAddress.postalCode}</div>
  </div>
  <table>
    <thead><tr><th>Product</th><th>Variant / SKU</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${itemRows}</tbody>
    <tfoot>
      <tr><td colspan="4" style="text-align:right;color:#888">Subtotal</td><td style="text-align:right">KD ${order.subtotal.toFixed(3)}</td></tr>
      <tr><td colspan="4" style="text-align:right;color:#888">Shipping</td><td style="text-align:right">${order.shippingFee === 0 ? 'Free' : 'KD ' + order.shippingFee.toFixed(3)}</td></tr>
      ${discountRow}
      <tr class="tot"><td colspan="4" style="text-align:right">TOTAL</td><td style="text-align:right">KD ${order.total.toFixed(3)}</td></tr>
    </tfoot>
  </table>
  <div class="footer">
    <div style="font-size:12px"><strong>Payment:</strong> ${PAYMENT_METHOD_LABELS[order.paymentMethod]}<br><span class="badge ${order.paymentStatus}">${PAYMENT_STATUS_LABELS[order.paymentStatus]}</span></div>
    <div style="font-size:11px;color:#aaa;text-align:right">Thank you for your order!<br>Mayar International · Kuwait</div>
  </div>
  <script>window.onload=()=>window.print();<\/script>
  </body></html>`);
  w.document.close();
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportToCSV(orders: Order[]) {
  const headers = [
    'Order #', 'Customer Name', 'Email', 'Phone',
    'Items Count', 'Subtotal (KWD)', 'Shipping (KWD)', 'Discount (KWD)', 'Total (KWD)',
    'Coupon', 'Payment Method', 'Payment Status', 'Order Status', 'Created At',
    'Ship Full Name', 'Ship Address', 'Ship City', 'Ship State', 'Ship Country', 'Ship Postal',
  ];
  const rows = orders.map(o => [
    o.orderNumber,
    `"${o.customer.name}"`,
    o.customer.email,
    o.customer.phone,
    o.items.reduce((s, i) => s + i.quantity, 0),
    o.subtotal.toFixed(3),
    o.shippingFee.toFixed(3),
    o.discount.toFixed(3),
    o.total.toFixed(3),
    o.couponCode ?? '',
    PAYMENT_METHOD_LABELS[o.paymentMethod],
    PAYMENT_STATUS_LABELS[o.paymentStatus],
    ORDER_STATUS_LABELS[o.status],
    o.createdAt,
    `"${o.shippingAddress.fullName}"`,
    `"${o.shippingAddress.line1}"`,
    o.shippingAddress.city,
    o.shippingAddress.state,
    o.shippingAddress.country,
    o.shippingAddress.postalCode,
  ].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${orders.length} order${orders.length !== 1 ? 's' : ''} to CSV`);
}

function downloadImportTemplate() {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone',
    'Area', 'Block', 'Street', 'Building', 'Floor', 'Flat/Office', 'Address Notes',
    'Product Name', 'Variant', 'Quantity', 'Unit Price (KWD)',
    'Shipping Fee (KWD)', 'Discount (KWD)', 'Coupon Code',
    'Payment Method (credit_card|apple_pay|google_pay|cash_on_delivery)', 'Payment Status (pending|paid|failed)',
    'Customer Note',
  ];
  const example = [
    'Fatima', 'Al-Rashidi', 'fatima@example.com', '+965 9912 3456',
    'Salmiya', '4', '12', '45', '2', '10', 'Near mosque',
    'Luxury Black Abaya', 'Black / M', '1', '18.500',
    '1.500', '0', '',
    'credit_card', 'paid',
    '',
  ];
  const csv = [headers.join(','), example.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseImportCSV(text: string): CreateOrderPayload[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const results: CreateOrderPayload[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
    if (cols.length < 15 || !cols[0]) continue;

    // Mapping:
    // 0: First Name, 1: Last Name, 2: Email, 3: Phone
    // 4: Area, 5: Block, 6: Street, 7: Building, 8: Floor, 9: Flat/Office, 10: Address Notes
    // 11: Product Name, 12: Variant, 13: Quantity, 14: Unit Price (KWD)
    // 15: Shipping Fee (KWD), 16: Discount (KWD), 17: Coupon Code
    // 18: Payment Method, 19: Payment Status, 20: Customer Note

    const qty = parseInt(cols[13]) || 1;
    const unitPrice = parseFloat(cols[14]) || 0;
    const shippingFee = parseFloat(cols[15]) || 0;
    const discount = parseFloat(cols[16]) || 0;
    const subtotal = unitPrice * qty;
    const total = subtotal + shippingFee - discount;

    results.push({
      customer: { firstName: cols[0], lastName: cols[1], email: cols[2], phone: cols[3] },
      address: {
        area: cols[4],
        block: cols[5],
        street: cols[6],
        building: cols[7],
        floor: cols[8] || undefined,
        flatOffice: cols[9] || undefined,
        notes: cols[10] || undefined
      },
      shippingMethod: {
        id: 'manual',
        name: { en: 'Standard Shipping', ar: 'شحن قياسي' },
        estimate: { en: '2-3 days', ar: '2-3 أيام' },
        price: shippingFee
      },
      paymentMethodId: cols[18] === 'cash_on_delivery' ? 'cod' : 'myfatoorah',
      items: [{
        productId: '', // Admin creation endpoint usually handles lookup by name or needs valid ID
        variantId: undefined,
        nameEn: cols[12] ? `${cols[11]} (${cols[12]})` : cols[11],
        nameAr: cols[12] ? `${cols[11]} (${cols[12]})` : cols[11],
        image: 'https://placehold.co/60x60/888/white?text=Item',
        quantity: qty,
        unitPrice,
      }],
      totals: {
        subtotal,
        discount,
        shippingCost: shippingFee,
        total: Math.max(0, total)
      },
      currency: 'KWD',
      status: 'Pending',
      paymentStatus: cols[19] ? cols[19].charAt(0).toUpperCase() + cols[19].slice(1) : 'Pending'
    });
  }
  return results;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
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

// ─── Quick Status Dropdown (inline in table row) ───────────────────────────────

function QuickStatus({ order, onUpdated }: { order: Order; onUpdated: (o: Order) => void }) {
  const [busy, setBusy] = useState(false);
  const handle = async (v: string) => {
    if (v === order.status) return;
    setBusy(true);
    try {
      const u = await updateOrderStatus({
        orderId: order.id, status: v as OrderStatus,
        note: `Status changed to "${ORDER_STATUS_LABELS[v as OrderStatus]}" from orders list.`,
        updatedBy: 'Admin', source: 'admin',
      });
      onUpdated(u);
      toast.success(`${order.orderNumber} → ${ORDER_STATUS_LABELS[v as OrderStatus]}`);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    }
    finally { setBusy(false); }
  };
  return (
    <Select value={order.status} onValueChange={handle} disabled={busy}>
      <SelectTrigger className={`h-7 w-44 text-xs border font-medium ${statusColor[order.status]}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map(s => (
          <SelectItem key={s} value={s} className="text-xs">{ORDER_STATUS_LABELS[s]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Add Order Dialog ─────────────────────────────────────────────────────────

interface NewItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  image: string;
  color?: string;
  size?: string;
  nameAr: string;
}

const emptyItem = (): NewItem => ({
  id: Math.random().toString(36).slice(2),
  productId: '', variantId: '', productName: '', variant: '', quantity: 1, unitPrice: 0, image: '', nameAr: '',
});

function AddOrderDialog({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: (o: Order) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [f, setF] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    area: '', block: '', street: '', building: '',
    floor: '', flatOffice: '', addressNotes: '',
    paymentMethod: 'cash_on_delivery' as PaymentMethod,
    paymentStatus: 'pending' as PaymentStatus,
    shippingFee: '0.000', discount: '0.000', couponCode: '',
    status: 'pending' as OrderStatus, customerNote: '',
  });
  const [items, setItems] = useState<NewItem[]>([emptyItem()]);

  const resetForm = () => {
    setF({
      firstName: '', lastName: '', email: '', phone: '',
      area: '', block: '', street: '', building: '',
      floor: '', flatOffice: '', addressNotes: '',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      shippingFee: '0.000', discount: '0.000', couponCode: '',
      status: 'pending', customerNote: '',
    });
    setItems([emptyItem()]);
  };

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    }
  };

  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const setItem = (id: string, k: keyof NewItem, v: any) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [k]: v } : i));

  const handleProductChange = (itemId: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          productId,
          productName: product.name,
          nameAr: product.name, // Assuming English name for now if Arabic not in Product type
          unitPrice: product.base_price_kwd,
          image: product.image_url || '',
          variantId: '',
          variant: '',
          color: '',
          size: ''
        };
      }
      return i;
    }));
  };

  const handleVariantChange = (itemId: string, variantId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const product = products.find(p => p.id === item.productId);
    if (!product || !product.variants) return;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          variantId,
          variant: [variant.color?.nameEnglish, variant.size?.label].filter(Boolean).join(' / ') || 'Default',
          unitPrice: variant.basePriceKWD || i.unitPrice,
          image: variant.imageUrl || i.image,
          color: variant.color?.nameEnglish,
          size: variant.size?.label
        };
      }
      return i;
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = subtotal + (parseFloat(f.shippingFee) || 0) - (parseFloat(f.discount) || 0);

  const handleSubmit = async () => {
    if (!f.firstName || !f.email || !f.area || !f.block || !f.street || !f.building) {
      toast.error('Fill in all required customer and address fields.'); return;
    }
    if (items.some(i => !i.productId || i.unitPrice < 0)) {
      toast.error('Each item must have a product and a valid price.'); return;
    }
    setBusy(true);
    try {
      const payload: CreateOrderPayload = {
        customer: { firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone },
        address: {
          area: f.area, block: f.block, street: f.street, building: f.building,
          floor: f.floor || undefined, flatOffice: f.flatOffice || undefined, notes: f.addressNotes || undefined
        },
        shippingMethod: {
          id: 'manual',
          name: { en: 'Standard Shipping', ar: 'شحن قياسي' },
          estimate: { en: '2-3 days', ar: '2-3 أيام' },
          price: parseFloat(f.shippingFee) || 0
        },
        paymentMethodId: f.paymentMethod === 'cash_on_delivery' ? 'cod' : 'myfatoorah',
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          nameEn: i.productName,
          nameAr: i.nameAr,
          image: i.image,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        totals: {
          subtotal,
          discount: parseFloat(f.discount) || 0,
          shippingCost: parseFloat(f.shippingFee) || 0,
          total: Math.max(0, total)
        },
        currency: 'KWD',
        status: FRONTEND_TO_BACKEND_STATUS[f.status],
        paymentStatus: f.paymentStatus.charAt(0).toUpperCase() + f.paymentStatus.slice(1)
      };

      const order = await createOrder(payload);
      onCreated(order);
      toast.success(`Order created successfully`);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Customer */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Information</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">First Name <span className="text-destructive">*</span></Label>
                <Input placeholder="First name" value={f.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Last Name</Label>
                <Input placeholder="Last name" value={f.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email <span className="text-destructive">*</span></Label>
                <Input type="email" placeholder="email@example.com" value={f.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input placeholder="+965 XXXX XXXX" value={f.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipping Address (Kuwait)</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Area <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. Salmiya" value={f.area} onChange={e => set('area', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Block <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. 4" value={f.block} onChange={e => set('block', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Street <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. 12" value={f.street} onChange={e => set('street', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Building/House <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. 45" value={f.building} onChange={e => set('building', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Floor</Label>
                <Input placeholder="e.g. 2" value={f.floor} onChange={e => set('floor', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Flat/Office</Label>
                <Input placeholder="e.g. 10" value={f.flatOffice} onChange={e => set('flatOffice', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Address Notes</Label>
                <Input placeholder="Near mosque, etc." value={f.addressNotes} onChange={e => set('addressNotes', e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Items</p>
              <Button variant="outline" size="sm" onClick={() => setItems(p => [...p, emptyItem()])} className="h-7 text-[10px]">
                <Plus className="mr-1 h-3 w-3" /> Add Item
              </Button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[2fr_1.5fr_60px_90px_36px] gap-2 px-1">
                {['Product', 'Variant', 'Qty', 'Unit Price (KD)', ''].map((h, i) => (
                  <p key={i} className="text-[10px] font-semibold uppercase text-muted-foreground">{h}</p>
                ))}
              </div>
              {items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.id} className="grid grid-cols-[2fr_1.5fr_60px_90px_36px] gap-2 items-start">
                    <div className="space-y-1">
                      <Select value={item.productId} onValueChange={(v) => handleProductChange(item.id, v)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      {product && product.variants && product.variants.length > 0 ? (
                        <Select value={item.variantId} onValueChange={(v) => handleVariantChange(item.id, v)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select Variant" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.variants.map(v => (
                              <SelectItem key={v.id} value={v.id} className="text-xs">
                                {[v.color?.nameEnglish, v.size?.label].filter(Boolean).join(' / ')}
                                {v.stockQuantity !== undefined ? ` (${v.stockQuantity} in stock)` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-8 flex items-center px-3 text-[10px] text-muted-foreground bg-muted/50 rounded-md">No variants</div>
                      )}
                    </div>

                    <Input type="number" min={1} value={item.quantity} onChange={e => setItem(item.id, 'quantity', parseInt(e.target.value) || 1)} className="h-8 text-xs text-center" />
                    <Input type="number" min={0} step="0.001" value={item.unitPrice} onChange={e => setItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="h-8 text-xs" />

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={items.length === 1}
                      onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Payment */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment & Pricing</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Payment Method</Label>
                <Select value={f.paymentMethod} onValueChange={v => set('paymentMethod', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                    <SelectItem value="credit_card">MyFatoorah (Online)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Payment Status</Label>
                <Select value={f.paymentStatus} onValueChange={v => set('paymentStatus', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map(s => (
                      <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Initial Order Status</Label>
                <Select value={f.status} onValueChange={v => set('status', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Shipping Fee (KD)</Label>
                <Input type="number" min={0} step="0.001" value={f.shippingFee} onChange={e => set('shippingFee', e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Discount (KD)</Label>
                <Input type="number" min={0} step="0.001" value={f.discount} onChange={e => set('discount', e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Coupon Code</Label>
                <Input placeholder="Optional" value={f.couponCode} onChange={e => set('couponCode', e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-6 rounded-lg bg-muted px-4 py-2 text-sm">
              <span className="text-muted-foreground">Subtotal: <strong>{fmt(subtotal)}</strong></span>
              <span className="text-muted-foreground">Total: <strong className="text-foreground">{fmt(Math.max(0, total))}</strong></span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={busy}>
            {busy ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Creating…</> : 'Create Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Import CSV Dialog ────────────────────────────────────────────────────────

function ImportDialog({ open, onClose, onImported }: {
  open: boolean; onClose: () => void; onImported: (orders: Order[]) => void;
}) {
  const [preview, setPreview] = useState<CreateOrderPayload[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseImportCSV(text);
      setPreview(parsed);
      if (parsed.length === 0) toast.error('No valid rows found. Check the CSV format.');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setBusy(true);
    try {
      const created: Order[] = [];
      for (const payload of preview) {
        const o = await createOrder(payload);
        created.push(o);
      }
      onImported(created);
      toast.success(`Imported ${created.length} order${created.length !== 1 ? 's' : ''}`);
      onClose();
    } catch { toast.error('Import failed'); }
    finally { setBusy(false); setPreview([]); }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { setPreview([]); onClose(); } }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Orders from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Select a CSV file to import</p>
            <p className="mt-0.5 text-xs text-muted-foreground">One order per row. Each row creates a new order.</p>
            <div className="mt-3 flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadImportTemplate}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download Template
              </Button>
              <Button size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File
              </Button>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFile} />
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Preview: <span className="text-primary">{preview.length} order{preview.length !== 1 ? 's' : ''}</span> ready to import
              </p>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">#</th>
                      <th className="px-3 py-2 text-left font-semibold">Customer</th>
                      <th className="px-3 py-2 text-left font-semibold">Product</th>
                      <th className="px-3 py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((o, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="px-3 py-1.5 text-muted-foreground">{idx + 1}</td>
                        <td className="px-3 py-1.5">{`${o.customer.firstName} ${o.customer.lastName}`.trim()}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{o.items[0]?.nameEn}</td>
                        <td className="px-3 py-1.5 text-right font-medium">{fmt(o.totals.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setPreview([]); onClose(); }}>Cancel</Button>
          <Button onClick={handleImport} disabled={busy || preview.length === 0}>
            {busy ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Importing…</> : `Import ${preview.length} Order${preview.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const navigate = useNavigate();

  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatus>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [dateAddedFrom, setDateAddedFrom] = useState('');
  const [dateAddedTo, setDateAddedTo] = useState('');
  const [dateModifiedFrom, setDateModifiedFrom] = useState('');
  const [dateModifiedTo, setDateModifiedTo] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Dialog visibility
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showBulkStatus, setShowBulkStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[]>([]);

  // Bulk status form
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('');
  const [bulkNote, setBulkNote] = useState('');
  const [bulkSource, setBulkSource] = useState<UpdateSource>('admin');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const importFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setOrders(await getOrders()); }
    catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  // ── Stats ──
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length;
    const shipped = orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders.filter(o => o.paymentStatus === 'paid' && o.status !== 'refunded')
      .reduce((s, o) => s + o.total, 0);
    return { total, pending, processing, shipped, delivered, revenue };
  }, [orders]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (paymentFilter !== 'all') list = list.filter(o => o.paymentStatus === paymentFilter);
    if (dateAddedFrom) list = list.filter(o => o.createdAt >= dateAddedFrom);
    if (dateAddedTo) list = list.filter(o => o.createdAt <= dateAddedTo + 'T23:59:59Z');
    if (dateModifiedFrom) list = list.filter(o => o.updatedAt >= dateModifiedFrom);
    if (dateModifiedTo) list = list.filter(o => o.updatedAt <= dateModifiedTo + 'T23:59:59Z');

    list.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortOrder === 'highest') return b.total - a.total;
      return a.total - b.total;
    });
    return list;
  }, [orders, search, statusFilter, paymentFilter, sortOrder, dateAddedFrom, dateAddedTo, dateModifiedFrom, dateModifiedTo]);

  // ── Paginated ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ── Selection helpers ──
  const allPageSelected = paginated.length > 0 && paginated.every(o => selected.has(o.id));
  const somePageSelected = paginated.some(o => selected.has(o.id));
  const selectedCount = selected.size;

  const toggleAll = () => {
    setSelected(prev => {
      const s = new Set(prev);
      if (allPageSelected) paginated.forEach(o => s.delete(o.id));
      else paginated.forEach(o => s.add(o.id));
      return s;
    });
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map(o => o.id)));
  const clearSelection = () => setSelected(new Set());

  const handleOrderUpdated = (updated: Order) =>
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));

  // ── Delete ──
  const openDelete = (ids: string[]) => { setDeleteTarget(ids); setShowDeleteConfirm(true); };

  const confirmDelete = async () => {
    try {
      await deleteOrders(deleteTarget);
      setOrders(prev => prev.filter(o => !deleteTarget.includes(o.id)));
      setSelected(prev => { const s = new Set(prev); deleteTarget.forEach(id => s.delete(id)); return s; });
      toast.success(`Deleted ${deleteTarget.length} order${deleteTarget.length !== 1 ? 's' : ''}`);
    } catch { toast.error('Delete failed'); }
    finally { setShowDeleteConfirm(false); setDeleteTarget([]); }
  };

  // ── Bulk status update ──
  const handleBulkStatus = async () => {
    if (!bulkStatus || !bulkNote.trim()) { toast.error('Select a status and add a note.'); return; }
    setBulkUpdating(true);
    try {
      const ids = Array.from(selected);
      const updated = await bulkUpdateOrderStatus(ids, bulkStatus, bulkNote.trim(), 'Admin', bulkSource);
      updated.forEach(u => handleOrderUpdated(u));
      toast.success(`Updated ${updated.length} orders to "${ORDER_STATUS_LABELS[bulkStatus]}"`);
      setShowBulkStatus(false);
      setBulkStatus('');
      setBulkNote('');
    } catch { toast.error('Bulk update failed'); }
    finally { setBulkUpdating(false); }
  };

  // ── Export ──
  const handleExport = () => {
    const toExport = selectedCount > 0 ? orders.filter(o => selected.has(o.id)) : filtered;
    exportToCSV(toExport);
  };

  // ── Print ──
  const handlePrint = () => {
    const toPrint = selectedCount > 0 ? orders.filter(o => selected.has(o.id)) : paginated;
    if (toPrint.length === 0) { toast.error('No orders to print.'); return; }
    toPrint.forEach((o, i) => setTimeout(() => printInvoice(o), i * 300));
  };

  const clearFilters = () => {
    setSearch(''); setStatusFilter('all'); setPaymentFilter('all'); setSortOrder('newest');
    setDateAddedFrom(''); setDateAddedTo(''); setDateModifiedFrom(''); setDateModifiedTo('');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || statusFilter !== 'all' || paymentFilter !== 'all' ||
    dateAddedFrom || dateAddedTo || dateModifiedFrom || dateModifiedTo;

  if (loading) return (
    <AdminLayout>
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-4">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="bg-primary/10 text-primary" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-100 text-amber-700" />
          <StatCard label="Processing" value={stats.processing} icon={Settings2} color="bg-violet-100 text-violet-700" />
          <StatCard label="Shipped" value={stats.shipped} icon={Truck} color="bg-cyan-100 text-cyan-700" />
          <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle2} color="bg-green-100 text-green-700" />
          <StatCard label="Revenue" value={fmt(stats.revenue)} icon={DollarSign} color="bg-emerald-100 text-emerald-700" />
        </div>

        {/* ── Action toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Order
            </Button>
            <Button variant="outline" size="icon" title="Refresh" onClick={load}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title={showFilters ? 'Hide Filters' : 'Show Filters'}
              onClick={() => setShowFilters(v => !v)}
              className={showFilters ? 'bg-muted' : ''}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} title={selectedCount > 0 ? `Export ${selectedCount} selected` : 'Export filtered'}>
              <Download className="mr-1.5 h-4 w-4" />
              Export CSV {selectedCount > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">{selectedCount}</span>}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Upload className="mr-1.5 h-4 w-4" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}
              title={selectedCount > 0 ? `Print ${selectedCount} invoices` : 'Print page invoices'}>
              <Printer className="mr-1.5 h-4 w-4" />
              Print Invoice{selectedCount > 1 ? 's' : ''} {selectedCount > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">{selectedCount}</span>}
            </Button>
            {selectedCount > 0 && (
              <Button variant="destructive" size="sm" onClick={() => openDelete(Array.from(selected))}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete ({selectedCount})
              </Button>
            )}
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Order #, name, email, phone…" value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v as typeof statusFilter); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Order Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={v => { setPaymentFilter(v as typeof paymentFilter); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Payment Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={v => setSortOrder(v as typeof sortOrder)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Total</SelectItem>
                  <SelectItem value="lowest">Lowest Total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 2 – Date filters */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Date Added – From</Label>
                <Input type="date" value={dateAddedFrom} onChange={e => { setDateAddedFrom(e.target.value); setCurrentPage(1); }}
                  className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Date Added – To</Label>
                <Input type="date" value={dateAddedTo} onChange={e => { setDateAddedTo(e.target.value); setCurrentPage(1); }}
                  className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Date Modified – From</Label>
                <Input type="date" value={dateModifiedFrom} onChange={e => { setDateModifiedFrom(e.target.value); setCurrentPage(1); }}
                  className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Date Modified – To</Label>
                <Input type="date" value={dateModifiedTo} onChange={e => { setDateModifiedTo(e.target.value); setCurrentPage(1); }}
                  className="h-9 text-sm" />
              </div>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                <X className="mr-1.5 h-3.5 w-3.5" /> Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* ── Bulk action bar ── */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
            <span className="text-sm font-semibold text-primary">
              {selectedCount} order{selectedCount !== 1 ? 's' : ''} selected
            </span>
            {selectedCount < filtered.length && (
              <button onClick={selectAll} className="text-xs text-primary underline hover:no-underline">
                Select all {filtered.length}
              </button>
            )}
            <Separator orientation="vertical" className="h-4" />
            <Button size="sm" variant="outline" onClick={() => setShowBulkStatus(true)}>
              <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Bulk Update Status
            </Button>
            <Button size="sm" variant="outline" onClick={() => { orders.filter(o => selected.has(o.id)).forEach((o, i) => setTimeout(() => printInvoice(o), i * 300)); }}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print Invoices
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportToCSV(orders.filter(o => selected.has(o.id)))}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" variant="destructive" onClick={() => openDelete(Array.from(selected))}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
            <button onClick={clearSelection} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all on page"
                    className={somePageSelected && !allPageSelected ? 'opacity-50' : ''}
                  />
                </TableHead>
                <TableHead className="w-36">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center w-16">Items</TableHead>
                <TableHead className="text-right w-28">Total</TableHead>
                <TableHead className="w-44">Payment</TableHead>
                <TableHead className="w-48">Status</TableHead>
                <TableHead className="w-28">Date Added</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No orders found.{hasActiveFilters && <> <button onClick={clearFilters} className="ml-1 text-primary underline">Clear filters</button></>}
                  </TableCell>
                </TableRow>
              )}
              {paginated.map(order => (
                <TableRow key={order.id} className={selected.has(order.id) ? 'bg-primary/5' : 'hover:bg-muted/40'}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(order.id)}
                      onCheckedChange={() => toggleOne(order.id)}
                      aria-label={`Select ${order.orderNumber}`}
                    />
                  </TableCell>
                  <TableCell>
                    <button onClick={() => navigate(`/orders/${order.id}`)}
                      className="font-mono text-xs font-semibold text-primary hover:underline">
                      {order.orderNumber}
                    </button>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground leading-tight">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">{fmt(order.total)}</TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
                    <span className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${paymentStatusColor[order.paymentStatus]}`}>
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <QuickStatus order={order} onUpdated={handleOrderUpdated} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printInvoice(order)}>
                          <Printer className="mr-2 h-4 w-4" /> Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status === 'pending' && (
                          <DropdownMenuItem onClick={async () => {
                            const u = await updateOrderStatus({ orderId: order.id, status: 'confirmed', note: 'Confirmed by admin.', updatedBy: 'Admin', source: 'admin' });
                            handleOrderUpdated(u); toast.success('Order confirmed');
                          }}>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Confirm Order
                          </DropdownMenuItem>
                        )}
                        {order.status === 'returnedrequested' && (
                          <DropdownMenuItem onClick={async () => {
                            const u = await updateOrderStatus({ orderId: order.id, status: 'returned', note: 'Return approved.', updatedBy: 'Admin', source: 'admin' });
                            handleOrderUpdated(u); toast.success('Return approved');
                          }}>
                            <RotateCcw className="mr-2 h-4 w-4 text-orange-600" /> Approve Return
                          </DropdownMenuItem>
                        )}
                        {order.status === 'refundedrequested' && (
                          <DropdownMenuItem onClick={async () => {
                            const u = await updateOrderStatus({ orderId: order.id, status: 'refunded', note: 'Refund processed.', updatedBy: 'Admin', source: 'admin' });
                            handleOrderUpdated(u); toast.success('Refund processed');
                          }}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-rose-600" /> Process Refund
                          </DropdownMenuItem>
                        )}
                        {['pending', 'confirmed', 'processing'].includes(order.status) && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive"
                            onClick={async () => {
                              const u = await updateOrderStatus({ orderId: order.id, status: 'cancelled', note: 'Cancelled by admin.', updatedBy: 'Admin', source: 'admin' });
                              handleOrderUpdated(u); toast.success('Order cancelled');
                            }}>
                            <Ban className="mr-2 h-4 w-4" /> Cancel Order
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive"
                          onClick={() => openDelete([order.id])}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{selectedCount > 0 ? `${selectedCount} selected · ` : ''}{filtered.length} orders</span>
            <div className="flex items-center gap-1.5">
              <Label className="text-xs whitespace-nowrap">Rows per page:</Label>
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-7 w-16 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map(n => <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-3 text-xs text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>

      {/* ── Dialogs ── */}

      <AddOrderDialog open={showAdd} onClose={() => setShowAdd(false)}
        onCreated={o => setOrders(prev => [o, ...prev])} />

      <ImportDialog open={showImport} onClose={() => setShowImport(false)}
        onImported={newOrders => setOrders(prev => [...newOrders, ...prev])} />

      {/* Bulk Status Update */}
      <Dialog open={showBulkStatus} onOpenChange={v => !v && setShowBulkStatus(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Updating <strong>{selectedCount} order{selectedCount !== 1 ? 's' : ''}</strong> to a new status.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs">New Status</Label>
              <Select value={bulkStatus} onValueChange={v => setBulkStatus(v as OrderStatus)}>
                <SelectTrigger><SelectValue placeholder="Select status…" /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Updated By</Label>
              <Select value={bulkSource} onValueChange={v => setBulkSource(v as UpdateSource)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(UPDATE_SOURCE_LABELS) as UpdateSource[]).map(s => (
                    <SelectItem key={s} value={s}>{UPDATE_SOURCE_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Note <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Reason for bulk status update…" rows={3}
                value={bulkNote} onChange={e => setBulkNote(e.target.value)} className="resize-none text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkStatus(false)}>Cancel</Button>
            <Button onClick={handleBulkStatus} disabled={bulkUpdating || !bulkStatus || !bulkNote.trim()}>
              {bulkUpdating ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Updating…</> : `Update ${selectedCount} Orders`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={v => !v && setShowDeleteConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget.length} Order{deleteTarget.length !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget.length === 1 ? 'this order' : `these ${deleteTarget.length} orders`}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}
