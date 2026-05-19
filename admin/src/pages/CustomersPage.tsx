import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Contact, ArrowLeft, ShoppingBag, Heart, MapPin, Clock,
  Bell, Shield, User, Search, Eye, Mail, Phone, Globe,
  Star, Package, CheckCircle, XCircle, AlertCircle, Pencil,
  Trash2, Plus, ToggleRight, ToggleLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flat?: string;
  notes?: string;
  isDefault: boolean;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'processing' | 'cancelled' | 'shipped';
  total: number;
  items: number;
}

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface RecentlyViewedItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  pinCode: string;
  avatar: string;
  status: 'active' | 'inactive' | 'blocked';
  joinedAt: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  wishlist: WishlistItem[];
  recentlyViewed: RecentlyViewedItem[];
  notifications: CustomerNotification[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Shahul Uniweb',
    email: 'shahul@uniwebonline.com',
    phone: '+965 6575403',
    country: 'Kuwait',
    city: 'Kuwait City',
    pinCode: '607106',
    avatar: 'S',
    status: 'active',
    joinedAt: 'May 17, 2026',
    lastLogin: 'May 19, 2026, 10:59 AM',
    totalOrders: 0,
    totalSpent: 0,
    addresses: [],
    orders: [],
    wishlist: [],
    recentlyViewed: [
      {
        id: 'rv1',
        name: 'Silk Pleated Midi Dress',
        brand: 'SPLASH',
        price: 24.900,
        originalPrice: 41.500,
        discount: 40,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop',
        rating: 5,
        reviews: 5800,
        isNew: true,
      },
    ],
    notifications: [
      { id: 'n1', title: 'Welcome to Mayar!', message: 'Your account has been created successfully. Start shopping now!', date: 'May 17, 04:03 PM', read: false },
    ],
  },
  {
    id: 'c2',
    name: 'Fatima Al Rashidi',
    email: 'fatima.rashidi@gmail.com',
    phone: '+965 9912 3456',
    country: 'Kuwait',
    city: 'Salmiya',
    pinCode: '220001',
    avatar: 'FA',
    status: 'active',
    joinedAt: 'Mar 2, 2026',
    lastLogin: 'May 18, 2026, 3:40 PM',
    totalOrders: 7,
    totalSpent: 184.750,
    addresses: [
      { id: 'a1', label: 'Home', firstName: 'Fatima', lastName: 'Al Rashidi', email: 'fatima.rashidi@gmail.com', phone: '+965 9912 3456', area: 'Salmiya', block: '12', street: '5', building: 'Al Noor Tower', floor: '3', flat: '302', isDefault: true },
      { id: 'a2', label: 'Office', firstName: 'Fatima', lastName: 'Al Rashidi', email: 'fatima.rashidi@gmail.com', phone: '+965 9912 3456', area: 'Kuwait City', block: '1', street: '3', building: 'Gulf Complex', floor: '7', flat: '701', isDefault: false },
    ],
    orders: [
      { id: 'o1', orderNumber: '#MYR-2843', date: 'May 15, 2026', status: 'delivered', total: 42.500, items: 3 },
      { id: 'o2', orderNumber: '#MYR-2791', date: 'Apr 28, 2026', status: 'delivered', total: 31.250, items: 2 },
      { id: 'o3', orderNumber: '#MYR-2644', date: 'Mar 10, 2026', status: 'delivered', total: 55.000, items: 4 },
    ],
    wishlist: [
      { id: 'w1', name: 'Floral Wrap Dress', brand: 'Zara', price: 28.900, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=300&h=400&fit=crop', inStock: true },
      { id: 'w2', name: 'Linen Blazer', brand: 'H&M', price: 19.500, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop', inStock: false },
    ],
    recentlyViewed: [
      { id: 'rv2', name: 'Embroidered Abaya', brand: 'Max Fashion', price: 45.000, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop', rating: 4, reviews: 1240 },
    ],
    notifications: [
      { id: 'n2', title: 'Order Delivered', message: 'Your order #MYR-2843 has been delivered successfully.', date: 'May 15, 06:22 PM', read: true },
      { id: 'n3', title: 'New Arrivals', message: 'Check out our latest summer collection — up to 50% off!', date: 'May 10, 10:00 AM', read: true },
      { id: 'n4', title: 'Welcome to Mayar!', message: 'Your account has been created successfully. Start shopping now!', date: 'Mar 2, 09:00 AM', read: true },
    ],
  },
  {
    id: 'c3',
    name: 'Ahmed Khalil',
    email: 'ahmed.khalil@hotmail.com',
    phone: '+965 6634 7890',
    country: 'Kuwait',
    city: 'Hawalli',
    pinCode: '300040',
    avatar: 'AK',
    status: 'active',
    joinedAt: 'Jan 14, 2026',
    lastLogin: 'May 17, 2026, 8:15 AM',
    totalOrders: 12,
    totalSpent: 523.200,
    addresses: [
      { id: 'a3', label: 'Home', firstName: 'Ahmed', lastName: 'Khalil', email: 'ahmed.khalil@hotmail.com', phone: '+965 6634 7890', area: 'Hawalli', block: '7', street: '14', building: 'Villa 22', isDefault: true },
    ],
    orders: [
      { id: 'o4', orderNumber: '#MYR-2901', date: 'May 17, 2026', status: 'processing', total: 67.000, items: 5 },
      { id: 'o5', orderNumber: '#MYR-2856', date: 'May 2, 2026', status: 'shipped', total: 38.500, items: 2 },
      { id: 'o6', orderNumber: '#MYR-2800', date: 'Apr 19, 2026', status: 'delivered', total: 92.700, items: 6 },
    ],
    wishlist: [
      { id: 'w3', name: 'Polo Shirt', brand: 'Tommy Hilfiger', price: 22.000, image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop', inStock: true },
    ],
    recentlyViewed: [],
    notifications: [
      { id: 'n5', title: 'Order Shipped', message: 'Your order #MYR-2856 is on its way.', date: 'May 2, 02:10 PM', read: false },
    ],
  },
  {
    id: 'c4',
    name: 'Sara Mohammed',
    email: 'sara.m@outlook.com',
    phone: '+965 5521 6677',
    country: 'Kuwait',
    city: 'Jabriya',
    pinCode: '400060',
    avatar: 'SM',
    status: 'inactive',
    joinedAt: 'Nov 20, 2025',
    lastLogin: 'Feb 3, 2026, 11:00 AM',
    totalOrders: 2,
    totalSpent: 48.000,
    addresses: [],
    orders: [
      { id: 'o7', orderNumber: '#MYR-2101', date: 'Jan 5, 2026', status: 'delivered', total: 29.000, items: 2 },
      { id: 'o8', orderNumber: '#MYR-2033', date: 'Dec 18, 2025', status: 'cancelled', total: 19.000, items: 1 },
    ],
    wishlist: [],
    recentlyViewed: [],
    notifications: [
      { id: 'n6', title: 'Welcome to Mayar!', message: 'Your account has been created successfully. Start shopping now!', date: 'Nov 20, 10:00 AM', read: true },
    ],
  },
  {
    id: 'c5',
    name: 'Omar Hassan',
    email: 'omarhassan99@gmail.com',
    phone: '+965 9988 7766',
    country: 'Kuwait',
    city: 'Fintas',
    pinCode: '536000',
    avatar: 'OH',
    status: 'blocked',
    joinedAt: 'Sep 5, 2025',
    lastLogin: 'Oct 12, 2025, 5:44 PM',
    totalOrders: 1,
    totalSpent: 15.500,
    addresses: [],
    orders: [
      { id: 'o9', orderNumber: '#MYR-1622', date: 'Sep 10, 2025', status: 'delivered', total: 15.500, items: 1 },
    ],
    wishlist: [],
    recentlyViewed: [],
    notifications: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META = {
  active:   { label: 'Active',   cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactive', cls: 'bg-muted text-muted-foreground border-border' },
  blocked:  { label: 'Blocked',  cls: 'bg-red-100 text-red-700 border-red-200' },
};

const ORDER_STATUS_META = {
  delivered:  { label: 'Delivered',  cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  processing: { label: 'Processing', cls: 'bg-blue-100 text-blue-700',       icon: AlertCircle },
  shipped:    { label: 'Shipped',    cls: 'bg-indigo-100 text-indigo-700',    icon: Package     },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700',          icon: XCircle     },
};

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-rose-500', 'bg-amber-500',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn('h-3 w-3', i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
      ))}
    </div>
  );
}

// ─── Customer Detail View ─────────────────────────────────────────────────────

function CustomerDetail({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const totalAddresses = customer.addresses.length;
  const unreadNotifs = customer.notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Customers
        </Button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{customer.name}</span>
      </div>

      {/* Profile banner */}
      <div className="rounded-xl bg-secondary text-secondary-foreground p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn('flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white', AVATAR_COLORS[MOCK_CUSTOMERS.indexOf(customer) % AVATAR_COLORS.length])}>
            {customer.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-secondary-foreground/70">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', STATUS_META[customer.status].cls)}>
            {STATUS_META[customer.status].label}
          </span>
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">
            Orders {customer.orders.length > 0 && <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{customer.orders.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="addresses">
            Addresses {totalAddresses > 0 && <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{totalAddresses}</span>}
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            Wishlist {customer.wishlist.length > 0 && <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{customer.wishlist.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications {unreadNotifs > 0 && <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">{unreadNotifs}</span>}
          </TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShoppingBag, label: 'Total Orders',    value: customer.totalOrders,  color: 'bg-brand/10 text-primary' },
              { icon: Heart,        label: 'Wishlist Items',  value: customer.wishlist.length, color: 'bg-red-100 text-red-600' },
              { icon: MapPin,       label: 'Saved Addresses', value: totalAddresses,           color: 'bg-emerald-100 text-emerald-600' },
              { icon: Clock,        label: 'Recently Viewed', value: customer.recentlyViewed.length, color: 'bg-blue-100 text-blue-600' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg mb-3', s.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Profile Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Profile Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Full Name',        value: customer.name },
                { label: 'Email',            value: customer.email },
                { label: 'Phone Number',     value: customer.phone },
                { label: 'Country',          value: customer.country },
                { label: 'Default Address',  value: customer.city },
                { label: 'Pin Code',         value: customer.pinCode },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
                  <p className="text-sm font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5 mr-1" /> View Orders</Button>
              <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5 mr-1" /> Edit Profile</Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Block Customer
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── ORDERS ───────────────────────────────────────────────────── */}
        <TabsContent value="orders" className="mt-6">
          {customer.orders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-1">This customer hasn't placed any orders.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Order', 'Date', 'Items', 'Total', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map(order => {
                    const meta = ORDER_STATUS_META[order.status];
                    const Icon = meta.icon;
                    return (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 font-mono font-semibold text-primary">{order.orderNumber}</td>
                        <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                        <td className="px-5 py-3">{order.items} item{order.items !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-3 font-semibold">KWD {order.total.toFixed(3)}</td>
                        <td className="px-5 py-3">
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', meta.cls)}>
                            <Icon className="h-3 w-3" /> {meta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ── ADDRESSES ────────────────────────────────────────────────── */}
        <TabsContent value="addresses" className="mt-6">
          {customer.addresses.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No saved addresses</p>
              <p className="text-sm text-muted-foreground mt-1">This customer has no saved addresses.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {customer.addresses.map(addr => (
                <div key={addr.id} className={cn('rounded-xl border bg-card p-5', addr.isDefault ? 'border-primary/40' : 'border-border')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">{addr.label}</span>
                      {addr.isDefault && <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">Default</span>}
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-foreground">{addr.firstName} {addr.lastName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {addr.area}, Block {addr.block}, Street {addr.street}, {addr.building}
                    {addr.floor && `, Floor ${addr.floor}`}
                    {addr.flat && `, Flat ${addr.flat}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── WISHLIST ─────────────────────────────────────────────────── */}
        <TabsContent value="wishlist" className="mt-6">
          {customer.wishlist.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">Wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1">This customer hasn't saved any items.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customer.wishlist.map(item => (
                <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{item.brand}</p>
                    <p className="font-semibold text-sm text-foreground mt-0.5">{item.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-primary">KWD {item.price.toFixed(3)}</p>
                      <span className={cn('text-[11px] font-semibold rounded-full px-2 py-0.5', item.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── RECENTLY VIEWED ──────────────────────────────────────────── */}
        <TabsContent value="recently-viewed" className="mt-6">
          {customer.recentlyViewed.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No recently viewed items</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customer.recentlyViewed.map(item => (
                <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    {item.discount && (
                      <span className="absolute top-2 left-2 rounded bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">-{item.discount}%</span>
                    )}
                    {item.isNew && (
                      <span className="absolute top-2 left-2 mt-6 rounded bg-foreground px-1.5 py-0.5 text-[11px] font-bold text-background" style={{ top: item.discount ? '28px' : '8px' }}>NEW</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{item.brand}</p>
                    <p className="font-semibold text-sm text-foreground mt-0.5">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <StarRating rating={item.rating} />
                      <span className="text-xs text-muted-foreground">({item.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="font-bold text-primary">KWD {item.price.toFixed(3)}</p>
                      {item.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">KWD {item.originalPrice.toFixed(3)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── NOTIFICATIONS ────────────────────────────────────────────── */}
        <TabsContent value="notifications" className="mt-6">
          {customer.notifications.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No notifications</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {customer.notifications.map(notif => (
                <div key={notif.id} className={cn('flex items-start gap-4 px-5 py-4', !notif.read && 'bg-primary/5')}>
                  <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', !notif.read ? 'bg-primary/10' : 'bg-muted')}>
                    <Bell className={cn('h-4 w-4', !notif.read ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{notif.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── SECURITY ─────────────────────────────────────────────────── */}
        <TabsContent value="security" className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {[
              { icon: Phone,  label: 'Registered Phone',  value: customer.phone },
              { icon: Mail,   label: 'Registered Email',  value: customer.email },
              { icon: Clock,  label: 'Last Login',        value: customer.lastLogin },
              { icon: Shield, label: 'Account Status',    value: STATUS_META[customer.status].label },
            ].map(row => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="font-semibold text-sm text-foreground mt-0.5">{row.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            To update login details, the customer must go through OTP verification. Phone and email changes are handled on the storefront only.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = MOCK_CUSTOMERS.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    }
    return true;
  });

  const stats = {
    total: MOCK_CUSTOMERS.length,
    active: MOCK_CUSTOMERS.filter(c => c.status === 'active').length,
    inactive: MOCK_CUSTOMERS.filter(c => c.status === 'inactive').length,
    blocked: MOCK_CUSTOMERS.filter(c => c.status === 'blocked').length,
  };

  if (selected) {
    return (
      <AdminLayout>
        <CustomerDetail customer={selected} onBack={() => setSelected(null)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Contact className="h-6 w-6 text-primary" /> Customers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage all registered storefront customers.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: stats.total,    cls: '' },
            { label: 'Active',          value: stats.active,   cls: 'text-emerald-600' },
            { label: 'Inactive',        value: stats.inactive, cls: 'text-muted-foreground' },
            { label: 'Blocked',         value: stats.blocked,  cls: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <p className={cn('mt-1 text-2xl font-bold', s.cls || 'text-foreground')}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email or phone..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            {['all', 'active', 'inactive', 'blocked'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                  filterStatus === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                )}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Customer', 'Contact', 'Location', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">No customers found</td></tr>
              )}
              {filtered.map((customer, idx) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white', AVATAR_COLORS[idx % AVATAR_COLORS.length])}>
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{customer.phone}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      {customer.city}, {customer.country}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium">{customer.totalOrders}</td>
                  <td className="px-5 py-3 text-sm font-medium">
                    {customer.totalSpent > 0 ? `KWD ${customer.totalSpent.toFixed(3)}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{customer.joinedAt}</td>
                  <td className="px-5 py-3">
                    <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold', STATUS_META[customer.status].cls)}>
                      {STATUS_META[customer.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(customer)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
