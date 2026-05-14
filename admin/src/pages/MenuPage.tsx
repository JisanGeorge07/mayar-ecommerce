import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from 'sonner';
import {
  MenuSquare, Plus, Search, X, Pencil, Trash2, ChevronRight,
  Globe, Lock, UserCheck, ShieldCheck, ToggleLeft, ToggleRight,
  ExternalLink, Link2, GripVertical, Eye, EyeOff,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'all' | 'logged_in' | 'guest' | 'admin';
type ItemStatus = 'active' | 'inactive';
type LinkTarget = '_self' | '_blank';
type MenuLocation = 'header' | 'footer' | 'mobile' | 'sidebar';

interface MenuItem {
  id: string;
  menuId: string;
  label: string;
  labelAr: string;
  url: string;
  linkTarget: LinkTarget;
  role: Role;
  status: ItemStatus;
  order: number;
  parentId: string | null;
  openInNewTab: boolean;
}

interface Menu {
  id: string;
  name: string;
  location: MenuLocation;
  status: ItemStatus;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_MENUS: Menu[] = [
  { id: 'm1', name: 'Main Navigation', location: 'header', status: 'active' },
  { id: 'm2', name: 'Footer Links', location: 'footer', status: 'active' },
  { id: 'm3', name: 'Mobile Menu', location: 'mobile', status: 'active' },
  { id: 'm4', name: 'Sale Season Menu', location: 'sidebar', status: 'inactive' },
];

const SAMPLE_ITEMS: MenuItem[] = [
  // Main Navigation (m1)
  { id: 'i1',  menuId: 'm1', label: 'Home',        labelAr: 'الرئيسية',       url: '/',                         linkTarget: '_self',  role: 'all',       status: 'active',   order: 1, parentId: null,  openInNewTab: false },
  { id: 'i2',  menuId: 'm1', label: 'Shop',        labelAr: 'المتجر',         url: '/shop',                     linkTarget: '_self',  role: 'all',       status: 'active',   order: 2, parentId: null,  openInNewTab: false },
  { id: 'i3',  menuId: 'm1', label: 'Women',       labelAr: 'نساء',           url: '/shop/category/women',      linkTarget: '_self',  role: 'all',       status: 'active',   order: 1, parentId: 'i2',  openInNewTab: false },
  { id: 'i4',  menuId: 'm1', label: 'Men',         labelAr: 'رجال',           url: '/shop/category/men',        linkTarget: '_self',  role: 'all',       status: 'active',   order: 2, parentId: 'i2',  openInNewTab: false },
  { id: 'i5',  menuId: 'm1', label: 'Kids',        labelAr: 'أطفال',          url: '/shop/category/kids',       linkTarget: '_self',  role: 'all',       status: 'inactive', order: 3, parentId: 'i2',  openInNewTab: false },
  { id: 'i6',  menuId: 'm1', label: 'Sale',        labelAr: 'تخفيضات',        url: '/sale',                     linkTarget: '_self',  role: 'all',       status: 'active',   order: 3, parentId: null,  openInNewTab: false },
  { id: 'i7',  menuId: 'm1', label: 'About',       labelAr: 'عن الشركة',      url: '/about',                    linkTarget: '_self',  role: 'all',       status: 'active',   order: 4, parentId: null,  openInNewTab: false },
  { id: 'i8',  menuId: 'm1', label: 'My Account',  labelAr: 'حسابي',          url: '/account',                  linkTarget: '_self',  role: 'logged_in', status: 'active',   order: 5, parentId: null,  openInNewTab: false },
  { id: 'i9',  menuId: 'm1', label: 'Login',       labelAr: 'تسجيل الدخول',   url: '/login',                    linkTarget: '_self',  role: 'guest',     status: 'active',   order: 6, parentId: null,  openInNewTab: false },
  { id: 'i10', menuId: 'm1', label: 'Admin Panel', labelAr: 'لوحة الإدارة',   url: 'https://admin.mayar.com',   linkTarget: '_blank', role: 'admin',     status: 'active',   order: 7, parentId: null,  openInNewTab: true  },
  { id: 'i11', menuId: 'm1', label: 'Track Order', labelAr: 'تتبع الطلب',     url: '/track-order',              linkTarget: '_self',  role: 'all',       status: 'active',   order: 8, parentId: null,  openInNewTab: false },
  // Footer Links (m2)
  { id: 'i12', menuId: 'm2', label: 'About Us',           labelAr: 'من نحن',            url: '/about',              linkTarget: '_self',  role: 'all',       status: 'active',   order: 1, parentId: null,  openInNewTab: false },
  { id: 'i13', menuId: 'm2', label: 'Contact Us',         labelAr: 'اتصل بنا',          url: '/contact',            linkTarget: '_self',  role: 'all',       status: 'active',   order: 2, parentId: null,  openInNewTab: false },
  { id: 'i14', menuId: 'm2', label: 'Privacy Policy',     labelAr: 'سياسة الخصوصية',    url: '/privacy-policy',     linkTarget: '_self',  role: 'all',       status: 'active',   order: 3, parentId: null,  openInNewTab: false },
  { id: 'i15', menuId: 'm2', label: 'Terms & Conditions', labelAr: 'الشروط والأحكام',   url: '/terms-conditions',   linkTarget: '_self',  role: 'all',       status: 'active',   order: 4, parentId: null,  openInNewTab: false },
  { id: 'i16', menuId: 'm2', label: 'Returns & Exchange', labelAr: 'الإرجاع والاستبدال', url: '/returns-exchange',   linkTarget: '_self',  role: 'all',       status: 'active',   order: 5, parentId: null,  openInNewTab: false },
  { id: 'i17', menuId: 'm2', label: 'Shipping Info',      labelAr: 'معلومات الشحن',     url: '/shipping-info',      linkTarget: '_self',  role: 'all',       status: 'active',   order: 6, parentId: null,  openInNewTab: false },
  { id: 'i18', menuId: 'm2', label: 'Careers',            labelAr: 'وظائف',             url: '/careers',            linkTarget: '_self',  role: 'all',       status: 'active',   order: 7, parentId: null,  openInNewTab: false },
  { id: 'i19', menuId: 'm2', label: 'Instagram',          labelAr: 'إنستغرام',          url: 'https://instagram.com/mayarshop', linkTarget: '_blank', role: 'all', status: 'active', order: 8, parentId: null, openInNewTab: true },
  { id: 'i20', menuId: 'm2', label: 'My Orders',          labelAr: 'طلباتي',            url: '/account',            linkTarget: '_self',  role: 'logged_in', status: 'active',   order: 9, parentId: null,  openInNewTab: false },
  { id: 'i21', menuId: 'm2', label: 'Sign Up',            labelAr: 'إنشاء حساب',        url: '/signup',             linkTarget: '_self',  role: 'guest',     status: 'active',   order: 10, parentId: null, openInNewTab: false },
  { id: 'i22', menuId: 'm2', label: 'Partner Portal',     labelAr: 'بوابة الشركاء',     url: 'https://partners.mayar.com', linkTarget: '_blank', role: 'admin', status: 'inactive', order: 11, parentId: null, openInNewTab: true },
  { id: 'i23', menuId: 'm2', label: 'Newsletter',         labelAr: 'النشرة الإخبارية',  url: '/newsletter',         linkTarget: '_self',  role: 'all',       status: 'inactive', order: 12, parentId: null, openInNewTab: false },
  // Mobile Menu (m3)
  { id: 'i24', menuId: 'm3', label: 'Home',        labelAr: 'الرئيسية',     url: '/',           linkTarget: '_self', role: 'all',       status: 'active', order: 1, parentId: null, openInNewTab: false },
  { id: 'i25', menuId: 'm3', label: 'Shop',        labelAr: 'المتجر',       url: '/shop',       linkTarget: '_self', role: 'all',       status: 'active', order: 2, parentId: null, openInNewTab: false },
  { id: 'i26', menuId: 'm3', label: 'Sale',        labelAr: 'تخفيضات',      url: '/sale',       linkTarget: '_self', role: 'all',       status: 'active', order: 3, parentId: null, openInNewTab: false },
  { id: 'i27', menuId: 'm3', label: 'My Account',  labelAr: 'حسابي',        url: '/account',    linkTarget: '_self', role: 'logged_in', status: 'active', order: 4, parentId: null, openInNewTab: false },
  { id: 'i28', menuId: 'm3', label: 'Login',       labelAr: 'تسجيل الدخول', url: '/login',      linkTarget: '_self', role: 'guest',     status: 'active', order: 4, parentId: null, openInNewTab: false },
  { id: 'i29', menuId: 'm3', label: 'Track Order', labelAr: 'تتبع الطلب',   url: '/track-order', linkTarget: '_self', role: 'all',      status: 'active', order: 5, parentId: null, openInNewTab: false },
  // Sale Season (m4 - inactive menu)
  { id: 'i30', menuId: 'm4', label: 'Flash Sale',  labelAr: 'بيع سريع',     url: '/sale',       linkTarget: '_self', role: 'all',       status: 'inactive', order: 1, parentId: null, openInNewTab: false },
  { id: 'i31', menuId: 'm4', label: 'VIP Deals',   labelAr: 'عروض VIP',     url: '/vip',        linkTarget: '_self', role: 'logged_in', status: 'inactive', order: 2, parentId: null, openInNewTab: false },
  { id: 'i32', menuId: 'm4', label: 'Admin Offers', labelAr: 'عروض الإدارة', url: '/admin-offers', linkTarget: '_self', role: 'admin',  status: 'inactive', order: 3, parentId: null, openInNewTab: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_META: Record<Role, { label: string; cls: string; icon: React.ElementType }> = {
  all:       { label: 'All Users',    cls: 'bg-slate-100 text-slate-700 border-slate-200',    icon: Globe       },
  logged_in: { label: 'Logged In',    cls: 'bg-blue-100 text-blue-700 border-blue-200',       icon: UserCheck   },
  guest:     { label: 'Guest Only',   cls: 'bg-amber-100 text-amber-700 border-amber-200',    icon: Lock        },
  admin:     { label: 'Admin Only',   cls: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShieldCheck },
};

const LOCATION_META: Record<MenuLocation, { label: string; cls: string }> = {
  header:  { label: 'Header',  cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  footer:  { label: 'Footer',  cls: 'bg-teal-100 text-teal-700 border-teal-200' },
  mobile:  { label: 'Mobile',  cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  sidebar: { label: 'Sidebar', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
};

function RoleBadge({ role }: { role: Role }) {
  const m = ROLE_META[role];
  const Icon = m.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', m.cls)}>
      <Icon className="h-3 w-3" />{m.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  return status === 'active'
    ? <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200">Active</span>
    : <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-muted text-muted-foreground border-border">Inactive</span>;
}

const emptyItem = (menuId: string): Omit<MenuItem, 'id'> => ({
  menuId,
  label: '',
  labelAr: '',
  url: '/',
  linkTarget: '_self',
  role: 'all',
  status: 'active',
  order: 1,
  parentId: null,
  openInNewTab: false,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>(SAMPLE_MENUS);
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [activeMenuId, setActiveMenuId] = useState('m1');

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>(emptyItem('m1'));

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [menuForm, setMenuForm] = useState<Omit<Menu, 'id'>>({ name: '', location: 'header', status: 'active' });
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  const activeMenu = menus.find(m => m.id === activeMenuId)!;

  const menuItems = useMemo(() => {
    return items
      .filter(i => i.menuId === activeMenuId)
      .filter(i => {
        if (search) {
          const q = search.toLowerCase();
          if (!i.label.toLowerCase().includes(q) && !i.url.toLowerCase().includes(q)) return false;
        }
        if (filterRole !== 'all' && i.role !== filterRole) return false;
        if (filterStatus !== 'all' && i.status !== filterStatus) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [items, activeMenuId, search, filterRole, filterStatus]);

  const stats = useMemo(() => {
    const allItems = items.filter(i => i.menuId === activeMenuId);
    return {
      total: allItems.length,
      active: allItems.filter(i => i.status === 'active').length,
      topLevel: allItems.filter(i => i.parentId === null).length,
      children: allItems.filter(i => i.parentId !== null).length,
    };
  }, [items, activeMenuId]);

  const topLevelItems = useMemo(
    () => items.filter(i => i.menuId === activeMenuId && i.parentId === null),
    [items, activeMenuId]
  );

  // ── Item CRUD (local state only) ──────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyItem(activeMenuId));
    setSheetOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    setSheetOpen(true);
  };

  const saveItem = () => {
    if (!form.label.trim()) { toast.error('Label (EN) is required'); return; }
    if (!form.url.trim()) { toast.error('URL is required'); return; }
    if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? { ...form, id: editingId } : i));
      toast.success('Menu item updated');
    } else {
      const newId = `i${Date.now()}`;
      setItems(prev => [...prev, { ...form, id: newId }]);
      toast.success('Menu item added');
    }
    setSheetOpen(false);
  };

  const toggleItemStatus = (id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
    ));
    toast.success('Status updated');
  };

  const deleteItem = () => {
    if (!deleteId) return;
    setItems(prev => prev.filter(i => i.id !== deleteId && i.parentId !== deleteId));
    toast.success('Menu item deleted');
    setDeleteId(null);
  };

  // ── Menu CRUD ─────────────────────────────────────────────────────────────

  const openCreateMenu = () => {
    setEditingMenuId(null);
    setMenuForm({ name: '', location: 'header', status: 'active' });
    setMenuSheetOpen(true);
  };

  const openEditMenu = (menu: Menu) => {
    setEditingMenuId(menu.id);
    setMenuForm({ name: menu.name, location: menu.location, status: menu.status });
    setMenuSheetOpen(true);
  };

  const saveMenu = () => {
    if (!menuForm.name.trim()) { toast.error('Menu name is required'); return; }
    if (editingMenuId) {
      setMenus(prev => prev.map(m => m.id === editingMenuId ? { ...menuForm, id: editingMenuId } : m));
      toast.success('Menu updated');
    } else {
      const newId = `m${Date.now()}`;
      setMenus(prev => [...prev, { ...menuForm, id: newId }]);
      toast.success('Menu created');
    }
    setMenuSheetOpen(false);
  };

  const updateForm = (patch: Partial<typeof form>) => setForm(prev => ({ ...prev, ...patch }));

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <MenuSquare className="h-6 w-6 text-primary" /> Menu Manager
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage storefront navigation menus and control visibility by user role
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openCreateMenu}>
              <Plus className="mr-1.5 h-4 w-4" /> New Menu
            </Button>
            <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-1.5 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>

        {/* ── Menu Tabs ──────────────────────────────────────────────────────── */}
        <Tabs value={activeMenuId} onValueChange={id => { setActiveMenuId(id); setSearch(''); setFilterRole('all'); setFilterStatus('all'); }}>
          <TabsList className="h-auto flex-wrap gap-1 bg-muted/60 p-1">
            {menus.map(m => {
              const loc = LOCATION_META[m.location];
              return (
                <TabsTrigger
                  key={m.id}
                  value={m.id}
                  className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <span>{m.name}</span>
                  <span className={cn('rounded-full border px-1.5 py-0 text-[10px] font-semibold', loc.cls)}>{loc.label}</span>
                  {m.status === 'inactive' && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {menus.map(m => (
            <TabsContent key={m.id} value={m.id} className="mt-4 space-y-4">

              {/* ── Menu Header Row ─────────────────────────────────────────── */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold', LOCATION_META[m.location].cls)}>
                    {LOCATION_META[m.location].label}
                  </span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <StatusBadge status={m.status} />
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{items.filter(i => i.menuId === m.id).length} items</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openEditMenu(m)}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Menu
                </Button>
              </div>

              {/* ── Stats ──────────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Items',  value: stats.total },
                  { label: 'Active',       value: stats.active },
                  { label: 'Top Level',    value: stats.topLevel },
                  { label: 'Sub Items',    value: stats.children },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* ── Role Legend ─────────────────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">Role Visibility:</span>
                {(Object.entries(ROLE_META) as [Role, typeof ROLE_META[Role]][]).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <span key={key} className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium', meta.cls)}>
                      <Icon className="h-3 w-3" /> {meta.label}
                    </span>
                  );
                })}
              </div>

              {/* ── Filters ─────────────────────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search label or URL..." className="pl-9" />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="all_users">All Users</SelectItem>
                    <SelectItem value="logged_in">Logged In</SelectItem>
                    <SelectItem value="guest">Guest Only</SelectItem>
                    <SelectItem value="admin">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {(search || filterRole !== 'all' || filterStatus !== 'all') && (
                  <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterRole('all'); setFilterStatus('all'); }}>
                    <X className="mr-1 h-3 w-3" /> Clear
                  </Button>
                )}
              </div>

              {/* ── Table ───────────────────────────────────────────────────── */}
              <div className="rounded-xl border border-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['', 'Label', 'URL', 'Parent', 'Role', 'Status', 'Order', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                          No menu items found
                        </td>
                      </tr>
                    )}
                    {menuItems.map(item => {
                      const parent = item.parentId ? items.find(i => i.id === item.parentId) : null;
                      return (
                        <tr key={item.id} className={cn(
                          'border-b border-border last:border-0 hover:bg-muted/20 transition-colors',
                          item.parentId && 'bg-muted/10'
                        )}>
                          {/* drag handle */}
                          <td className="pl-4 pr-1 py-3 w-6">
                            <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                          </td>
                          {/* label */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {item.parentId && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                              <div>
                                <p className="font-medium text-foreground">{item.label}</p>
                                <p className="text-xs text-muted-foreground font-mono">{item.labelAr}</p>
                              </div>
                            </div>
                          </td>
                          {/* url */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                              {item.openInNewTab
                                ? <ExternalLink className="h-3 w-3 shrink-0" />
                                : <Link2 className="h-3 w-3 shrink-0" />}
                              <span className="max-w-[160px] truncate">{item.url}</span>
                            </div>
                          </td>
                          {/* parent */}
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {parent ? (
                              <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">{parent.label}</span>
                            ) : (
                              <span className="text-muted-foreground/50">—</span>
                            )}
                          </td>
                          {/* role */}
                          <td className="px-4 py-3"><RoleBadge role={item.role} /></td>
                          {/* status */}
                          <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                          {/* order */}
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">#{item.order}</td>
                          {/* actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(item)}
                                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title="Edit">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => toggleItemStatus(item.id)}
                                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title={item.status === 'active' ? 'Deactivate' : 'Activate'}>
                                {item.status === 'active'
                                  ? <ToggleRight className="h-3.5 w-3.5 text-emerald-600" />
                                  : <ToggleLeft className="h-3.5 w-3.5" />}
                              </button>
                              <button onClick={() => setDeleteId(item.id)}
                                className="p-1.5 rounded-md hover:bg-muted transition-colors text-destructive/70 hover:text-destructive"
                                title="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* ── Delete Dialog ─────────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the item and any child items beneath it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Add / Edit Item Sheet ─────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</SheetTitle>
            <SheetDescription>
              Configure the link, role visibility, and display settings.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Labels */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Label</h3>
              <div>
                <Label className="text-xs">Label (EN) *</Label>
                <Input value={form.label} onChange={e => updateForm({ label: e.target.value })} className="mt-1" placeholder="e.g. Shop" />
              </div>
              <div>
                <Label className="text-xs">Label (AR)</Label>
                <Input value={form.labelAr} onChange={e => updateForm({ labelAr: e.target.value })} dir="rtl" className="mt-1 text-right" placeholder="المتجر" />
              </div>
            </div>

            {/* Link */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Link</h3>
              <div>
                <Label className="text-xs">URL *</Label>
                <Input value={form.url} onChange={e => updateForm({ url: e.target.value })} className="mt-1 font-mono text-sm" placeholder="/shop" />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.openInNewTab}
                  onCheckedChange={v => updateForm({ openInNewTab: v, linkTarget: v ? '_blank' : '_self' })}
                />
                <Label className="text-sm">Open in new tab</Label>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Role Visibility</h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(ROLE_META) as [Role, typeof ROLE_META[Role]][]).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateForm({ role: key })}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                        form.role === key
                          ? cn(meta.cls, 'ring-2 ring-offset-1 ring-current')
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-xs">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {form.role === 'all' && 'Visible to everyone — no login required.'}
                {form.role === 'logged_in' && 'Only shown to users who are signed in.'}
                {form.role === 'guest' && 'Only shown to visitors who are not logged in.'}
                {form.role === 'admin' && 'Only visible to users with the Admin role.'}
              </p>
            </div>

            {/* Parent */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Parent Item</h3>
              <Select value={form.parentId ?? 'none'} onValueChange={v => updateForm({ parentId: v === 'none' ? null : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="No parent (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (top level)</SelectItem>
                  {topLevelItems
                    .filter(i => i.id !== editingId)
                    .map(i => (
                      <SelectItem key={i.id} value={i.id}>{i.label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Display Order</Label>
                <Input type="number" min={1} value={form.order}
                  onChange={e => updateForm({ order: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Switch
                    checked={form.status === 'active'}
                    onCheckedChange={v => updateForm({ status: v ? 'active' : 'inactive' })}
                  />
                  <span className="text-sm">{form.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button onClick={saveItem} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingId ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Add / Edit Menu Sheet ─────────────────────────────────────────────── */}
      <Sheet open={menuSheetOpen} onOpenChange={setMenuSheetOpen}>
        <SheetContent className="w-full sm:max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingMenuId ? 'Edit Menu' : 'Create Menu'}</SheetTitle>
            <SheetDescription>Define the menu name and where it appears on the storefront.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs">Menu Name *</Label>
              <Input value={menuForm.name} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))}
                className="mt-1" placeholder="e.g. Main Navigation" />
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Select value={menuForm.location} onValueChange={v => setMenuForm(f => ({ ...f, location: v as MenuLocation }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={menuForm.status === 'active'}
                onCheckedChange={v => setMenuForm(f => ({ ...f, status: v ? 'active' : 'inactive' }))}
              />
              <Label className="text-sm">{menuForm.status === 'active' ? 'Active' : 'Inactive'}</Label>
            </div>
          </div>
          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMenuSheetOpen(false)}>Cancel</Button>
            <Button onClick={saveMenu} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingMenuId ? 'Update Menu' : 'Create Menu'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
