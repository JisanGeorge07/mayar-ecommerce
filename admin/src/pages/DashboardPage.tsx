import React, { useState, useEffect } from 'react';
import {
  Package, FolderTree, Layers, TrendingUp, AlertTriangle, Eye, Sparkles, CircleDot,
  LayoutGrid, Bell, Database, HardDrive, Search, Shield, CreditCard, RefreshCw,
  Plus, Settings, Globe, CheckCircle2, XCircle, Clock, AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { dashboardService, type StatusItem, type DashboardStats, type CatalogHealth } from '@/services/dashboardService';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';

const statusIcon = (s: StatusItem['status']) => {
  switch (s) {
    case 'connected': case 'ready': return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'disconnected': case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
    case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function DashboardPage() {
  const { notifications } = useNotifications();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [catalog, setCatalog] = useState<CatalogHealth | null>(null);
  const [techStatus, setTechStatus] = useState<StatusItem[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingNotifs = notifications.filter(n => n.status === 'published' && !n.read).length;

  const loadData = async () => {
    setLoading(true);
    const [s, c, t, w] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getCatalogHealth(),
      dashboardService.getTechnicalStatus(),
      dashboardService.getWarnings(),
    ]);
    setStats(s); setCatalog(c); setTechStatus(t); setWarnings(w);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const summaryCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-primary' },
    { label: 'Active Products', value: stats.activeProducts, icon: CheckCircle2, color: 'text-success' },
    { label: 'Draft Products', value: stats.draftProducts, icon: Clock, color: 'text-warning' },
    { label: 'Categories', value: stats.categories, icon: FolderTree, color: 'text-primary' },
    { label: 'Subcategories', value: stats.subcategories, icon: Layers, color: 'text-primary' },
    { label: 'Product Types', value: stats.productTypes, icon: TrendingUp, color: 'text-primary' },
    { label: 'Hero Banners', value: stats.heroBanners, icon: Sparkles, color: 'text-primary' },
    { label: 'Shop by Category', value: stats.shopByCategoryItems, icon: CircleDot, color: 'text-primary' },
    { label: 'Promo Banners', value: stats.promoBanners, icon: LayoutGrid, color: 'text-primary' },
    { label: 'Notifications', value: pendingNotifs, icon: Bell, color: pendingNotifs > 0 ? 'text-warning' : 'text-muted-foreground', sub: 'Pending' },
    { label: 'Low Stock', value: stats.lowStockItems, icon: AlertTriangle, color: stats.lowStockItems > 0 ? 'text-destructive' : 'text-success' },
    { label: 'Missing Images', value: stats.productsMissingImages, icon: Eye, color: stats.productsMissingImages > 0 ? 'text-warning' : 'text-success' },
  ] : [];

  const quickActions = [
    { label: 'Create New Product', href: '/products/new', icon: Plus },
    { label: 'Manage Categories', href: '/categories', icon: FolderTree },
    { label: 'Hero Banners', href: '/hero-banners', icon: Sparkles },
    { label: 'Shop by Category', href: '/shop-by-category', icon: CircleDot },
    { label: 'Promo Banners', href: '/promo-banners', icon: LayoutGrid },
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Mayar CMS — Ecommerce Operations Overview</p>
          </div>
          <button onClick={loadData} className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted transition-colors">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {summaryCards.map(card => (
            <div key={card.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
              <p className="text-xl font-bold font-display text-foreground">{card.value}</p>
              {card.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="font-display text-sm font-semibold text-foreground">Attention Needed</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catalog Health */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Catalog Health
            </h3>
            {catalog && (
              <div className="space-y-2.5">
                {[
                  { label: 'Total Products', value: catalog.total },
                  { label: 'Active / Published', value: catalog.active, color: 'text-success' },
                  { label: 'Draft', value: catalog.draft, color: 'text-warning' },
                  { label: 'Missing Images', value: catalog.missingImages, color: catalog.missingImages > 0 ? 'text-destructive' : undefined },
                  { label: 'Missing Pricing', value: catalog.missingPricing, color: catalog.missingPricing > 0 ? 'text-destructive' : undefined },
                  { label: 'Zero Stock', value: catalog.zeroStock, color: catalog.zeroStock > 0 ? 'text-warning' : undefined },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={cn("font-semibold", row.color || 'text-foreground')}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Health */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Content Health
            </h3>
            {stats && (
              <div className="space-y-2.5">
                {[
                  { label: 'Hero Banners', value: stats.heroBanners },
                  { label: 'Shop by Category Items', value: stats.shopByCategoryItems },
                  { label: 'Promo Banners', value: stats.promoBanners },
                  { label: 'Banners Missing Arabic', value: stats.bannersMissingArabic, color: stats.bannersMissingArabic > 0 ? 'text-warning' : undefined },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={cn("font-semibold", row.color || 'text-foreground')}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-1.5">
              {quickActions.map(a => (
                <Link key={a.label} to={a.href}
                  className="flex items-center gap-3 rounded-md border border-border p-2.5 text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-colors">
                  <a.icon className="h-4 w-4 text-primary" />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Status */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Technical & System Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {techStatus.map(item => (
              <div key={item.label} className="flex items-center gap-3 rounded-md border border-border p-3">
                {statusIcon(item.status)}
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
