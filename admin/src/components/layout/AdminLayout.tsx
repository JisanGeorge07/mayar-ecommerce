import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderTree, Layers, Package,
  Search as SearchIcon, Settings, Tag, Bell, User, ChevronLeft,
  ChevronRight, Grid3X3, LogOut, BellRing, Sparkles, CircleDot, LayoutGrid,
  Building2, Shield, MessageCircle, Truck, RefreshCcw, ScrollText, Ticket,
  ShoppingCart, Users, Contact,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { globalSearch, type SearchResult } from '@/services/searchService';
import logoWhite from '@/assets/logo-white.png';
import logoSmallWhite from '@/assets/logo-small-white.png';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { title: 'Categories', path: '/categories', icon: FolderTree },
      { title: 'Subcategories', path: '/subcategories', icon: Layers },
      { title: 'Product Types', path: '/product-types', icon: Grid3X3 },
      { title: 'Products', path: '/products', icon: Package },
      { title: 'Orders', path: '/orders', icon: ShoppingCart },
      { title: 'Customers', path: '/customers', icon: Contact },
    ],
  },
  {
    label: 'Content',
    items: [
      { title: 'Hero Banners', path: '/hero-banners', icon: Sparkles },
      { title: 'Shop by Category', path: '/shop-by-category', icon: CircleDot },
      { title: 'Promo Banners', path: '/promo-banners', icon: LayoutGrid },
      { title: 'Coupons', path: '/coupons', icon: Ticket },
    ],
  },
  {
    label: 'Pages',
    items: [
      { title: 'About Us', path: '/pages/about-us', icon: Building2 },
      { title: 'Privacy Policy', path: '/pages/privacy-policy', icon: Shield },
      { title: 'Contact Us', path: '/pages/contact-us', icon: MessageCircle },
      { title: 'Shipping Information', path: '/pages/shipping-information', icon: Truck },
      { title: 'Returns & Exchange', path: '/pages/returns-exchange', icon: RefreshCcw },
      { title: 'Terms & Conditions', path: '/pages/terms-conditions', icon: ScrollText },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Roles & Permissions', path: '/roles-permissions', icon: Users },
      { title: 'Notifications', path: '/notifications', icon: BellRing },
      { title: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      const results = await globalSearch(searchQuery);
      setSearchResults(results);
      setShowSearch(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearchNav = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const grouped = searchResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  const publishedNotifs = notifications.filter(n => n.status === 'published');
  const recentNotifs = publishedNotifs.slice(0, 8);

  const timeAgo = (iso: string) => {
    // Append +03:00 if the timestamp doesn't have a timezone to ensure it's treated as Kuwait time
    const dateStr = (iso.includes('Z') || iso.includes('+')) ? iso : `${iso}+03:00`;
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 0) return 'Just now'; // Handle slight clock drifts
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={cn(
        'flex flex-col border-r border-sidebar-border bg-secondary transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-3">
          {collapsed ? (
            <img src={logoSmallWhite} alt="Mayar" className="h-9 w-9 object-contain" />
          ) : (
            <img src={logoWhite} alt="Mayar Shop" className="h-9 object-contain" />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {NAV_SECTIONS.map(section => {
            const visibleItems = section.items.filter(item => 
              user?.allowedPaths?.includes(item.path)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label} className="mb-4">
                {!collapsed && (
                  <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
                    {section.label}
                  </p>
                )}
                {visibleItems.map(item => {
                  const active = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        'mx-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-secondary-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex h-10 items-center justify-center border-t border-sidebar-border text-secondary-foreground/50 hover:text-secondary-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-lg font-semibold text-foreground">
              {NAV_SECTIONS.flatMap(s => s.items).find(i => location.pathname.startsWith(i.path))?.title || 'Mayar CMS'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div ref={searchRef} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearch(true)}
                placeholder="Search everything..."
                className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {showSearch && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-1 z-50 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat}>
                      <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cat}</p>
                      {items.map(r => (
                        <button key={r.id} onClick={() => handleSearchNav(r.path)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted transition-colors">
                          <span className="font-medium text-foreground">{r.title}</span>
                          {r.subtitle && <span className="text-xs text-muted-foreground">· {r.subtitle}</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {showSearch && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-lg border border-border bg-card p-4 shadow-xl text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>

            {user?.allowedPaths?.includes('/notifications') && (
              <div ref={notifRef} className="relative">
                <button onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </button>
              {showNotifs && (
                <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-lg border border-border bg-card shadow-xl">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary/80">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {recentNotifs.length === 0 && (
                      <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
                    )}
                    {recentNotifs.map(n => (
                      <button key={n.id} onClick={() => { markAsRead(n.id); navigate('/notifications'); setShowNotifs(false); }}
                        className={cn('flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0',
                          !n.isRead && 'bg-primary/5'
                        )}>
                        <span className="text-sm font-medium text-foreground">{n.titleEnglish}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{n.messageEnglish}</span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                      </button>
                    ))}
                  </div>
                  <Link to="/notifications" onClick={() => setShowNotifs(false)}
                    className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted transition-colors">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}

            <div ref={profileRef} className="relative">
              <button onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                <User className="h-4 w-4" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'admin@mayarshop.com'}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
