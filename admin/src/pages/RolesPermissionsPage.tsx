import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users, Shield, ShieldCheck, Pencil, Check, X,
  LayoutDashboard, FolderTree, Layers, Package, ShoppingCart,
  Sparkles, CircleDot, LayoutGrid, Ticket,
  Building2, Shield as ShieldIcon, MessageCircle, Truck, RefreshCcw, ScrollText,
  BellRing, Settings, Grid3X3, ChevronDown, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Menu tree (mirrors AdminLayout NAV_SECTIONS exactly) ─────────────────────

const MENU_SECTIONS = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard',    title: 'Dashboard',     icon: LayoutDashboard },
      { path: '/categories',   title: 'Categories',    icon: FolderTree      },
      { path: '/subcategories',title: 'Subcategories', icon: Layers          },
      { path: '/product-types',title: 'Product Types', icon: Grid3X3         },
      { path: '/products',     title: 'Products',      icon: Package         },
      { path: '/orders',       title: 'Orders',        icon: ShoppingCart    },
    ],
  },
  {
    section: 'Content',
    items: [
      { path: '/hero-banners',      title: 'Hero Banners',      icon: Sparkles   },
      { path: '/shop-by-category',  title: 'Shop by Category',  icon: CircleDot  },
      { path: '/promo-banners',     title: 'Promo Banners',     icon: LayoutGrid },
      { path: '/coupons',           title: 'Coupons',           icon: Ticket     },
    ],
  },
  {
    section: 'Pages',
    items: [
      { path: '/pages/about-us',            title: 'About Us',            icon: Building2   },
      { path: '/pages/privacy-policy',      title: 'Privacy Policy',      icon: ShieldIcon  },
      { path: '/pages/contact-us',          title: 'Contact Us',          icon: MessageCircle },
      { path: '/pages/shipping-information',title: 'Shipping Information', icon: Truck       },
      { path: '/pages/returns-exchange',    title: 'Returns & Exchange',  icon: RefreshCcw  },
      { path: '/pages/terms-conditions',    title: 'Terms & Conditions',  icon: ScrollText  },
    ],
  },
  {
    section: 'System',
    items: [
      { path: '/notifications', title: 'Notifications', icon: BellRing  },
      { path: '/settings',      title: 'Settings',      icon: Settings  },
    ],
  },
];

const ALL_PATHS = MENU_SECTIONS.flatMap(s => s.items.map(i => i.path));

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleId = 'admin' | 'sales';

interface Role {
  id: RoleId;
  name: string;
  description: string;
  allowedPaths: string[]; // '*' means all
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleId: RoleId;
  customPaths: string[]; // extra paths beyond role defaults
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const INITIAL_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all sections of the admin panel.',
    allowedPaths: ALL_PATHS,
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Access limited to the Dashboard only by default.',
    allowedPaths: ['/dashboard'],
  },
];

const INITIAL_USERS: AppUser[] = [
  {
    id: 'u1',
    name: 'Anessh',
    email: 'anessh@mayarshop.com',
    avatar: 'AN',
    roleId: 'admin',
    customPaths: [],
  },
  {
    id: 'u2',
    name: 'Jisan',
    email: 'jisan@mayarshop.com',
    avatar: 'JI',
    roleId: 'sales',
    customPaths: [],
  },
  {
    id: 'u3',
    name: 'Shahul',
    email: 'shahul@mayarshop.com',
    avatar: 'SH',
    roleId: 'sales',
    customPaths: ['/orders', '/products'], // extra access on top of Sales role
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<RoleId, { cls: string; icon: React.ElementType }> = {
  admin: { cls: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShieldCheck },
  sales: { cls: 'bg-blue-100 text-blue-700 border-blue-200',       icon: Shield      },
};

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-rose-500', 'bg-amber-500',
];

function getEffectivePaths(user: AppUser, roles: Role[]): string[] {
  const role = roles.find(r => r.id === user.roleId)!;
  const base = role.allowedPaths;
  const merged = Array.from(new Set([...base, ...user.customPaths]));
  return merged;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenuCheckGrid({
  allowedPaths,
  onChange,
  disabled = false,
  highlightPaths = [],
}: {
  allowedPaths: string[];
  onChange?: (paths: string[]) => void;
  disabled?: boolean;
  highlightPaths?: string[];
}) {
  const toggle = (path: string) => {
    if (disabled || !onChange) return;
    const next = allowedPaths.includes(path)
      ? allowedPaths.filter(p => p !== path)
      : [...allowedPaths, path];
    onChange(next);
  };

  const toggleSection = (paths: string[]) => {
    if (disabled || !onChange) return;
    const allOn = paths.every(p => allowedPaths.includes(p));
    const next = allOn
      ? allowedPaths.filter(p => !paths.includes(p))
      : Array.from(new Set([...allowedPaths, ...paths]));
    onChange(next);
  };

  return (
    <div className="space-y-5">
      {MENU_SECTIONS.map(sec => {
        const secPaths = sec.items.map(i => i.path);
        const allChecked = secPaths.every(p => allowedPaths.includes(p));
        const someChecked = secPaths.some(p => allowedPaths.includes(p));

        return (
          <div key={sec.section}>
            {/* section header with select-all */}
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={allChecked}
                className={cn(someChecked && !allChecked && 'opacity-60')}
                onCheckedChange={() => toggleSection(secPaths)}
                disabled={disabled}
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {sec.section}
              </span>
            </div>
            <div className="ml-6 grid grid-cols-1 gap-1.5">
              {sec.items.map(item => {
                const Icon = item.icon;
                const checked = allowedPaths.includes(item.path);
                const isCustom = highlightPaths.includes(item.path);
                return (
                  <label
                    key={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors',
                      checked
                        ? isCustom
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-border bg-muted/40'
                        : 'border-transparent bg-transparent opacity-50',
                      !disabled && 'hover:bg-muted/60',
                      disabled && 'cursor-default',
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(item.path)}
                      disabled={disabled}
                    />
                    <Icon className={cn('h-4 w-4 shrink-0', checked ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-sm font-medium', checked ? 'text-foreground' : 'text-muted-foreground')}>
                      {item.title}
                    </span>
                    {isCustom && (
                      <span className="ml-auto rounded-full bg-amber-100 border border-amber-300 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        Custom
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);

  // Role edit sheet
  const [roleSheet, setRoleSheet] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleDraft, setRoleDraft] = useState<string[]>([]);

  // User permission sheet
  const [userSheet, setUserSheet] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [userRoleDraft, setUserRoleDraft] = useState<RoleId>('sales');
  const [customDraft, setCustomDraft] = useState<string[]>([]);

  // ── Role actions ─────────────────────────────────────────────────────────

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleDraft([...role.allowedPaths]);
    setRoleSheet(true);
  };

  const saveRole = () => {
    if (!editingRole) return;
    setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, allowedPaths: roleDraft } : r));
    toast.success(`${editingRole.name} role permissions updated`);
    setRoleSheet(false);
  };

  // ── User actions ─────────────────────────────────────────────────────────

  const openEditUser = (user: AppUser) => {
    setEditingUser(user);
    setUserRoleDraft(user.roleId);
    setCustomDraft([...user.customPaths]);
    setUserSheet(true);
  };

  const saveUser = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u =>
      u.id === editingUser.id
        ? { ...u, roleId: userRoleDraft, customPaths: customDraft }
        : u
    ));
    toast.success(`${editingUser.name}'s permissions updated`);
    setUserSheet(false);
  };

  // Custom paths: only paths NOT already in the selected role
  const rolePathsForDraft = roles.find(r => r.id === userRoleDraft)?.allowedPaths ?? [];
  const extraPaths = customDraft.filter(p => !rolePathsForDraft.includes(p));

  // Toggle a custom extra path
  const toggleCustomPath = (path: string) => {
    if (rolePathsForDraft.includes(path)) return; // can't uncheck role-granted paths here
    setCustomDraft(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  // Combined effective paths for preview in user sheet
  const effectiveForDraft = Array.from(new Set([...rolePathsForDraft, ...customDraft]));

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Users className="h-6 w-6 text-primary" /> Roles &amp; Permissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define which admin panel sections each role can access, and grant custom access per user.
          </p>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════════════
              USERS TAB
          ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="users" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Each user inherits their role's default access. You can grant additional menus on top of the role.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {users.map((user, idx) => {
                const role = roles.find(r => r.id === user.roleId)!;
                const effective = getEffectivePaths(user, roles);
                const RoleIcon = ROLE_STYLE[user.roleId].icon;

                return (
                  <div key={user.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                    {/* User header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white', AVATAR_COLORS[idx % AVATAR_COLORS.length])}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditUser(user)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Role badge */}
                    <div className="flex items-center gap-2">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', ROLE_STYLE[user.roleId].cls)}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {role.name}
                      </span>
                      {user.customPaths.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          +{user.customPaths.length} custom
                        </span>
                      )}
                    </div>

                    {/* Access summary */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Can access ({effective.length}/{ALL_PATHS.length} menus)
                      </p>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {MENU_SECTIONS.flatMap(sec => sec.items).map(item => {
                          const Icon = item.icon;
                          const hasAccess = effective.includes(item.path);
                          const isCustom = user.customPaths.includes(item.path);
                          if (!hasAccess) return null;
                          return (
                            <div key={item.path} className={cn(
                              'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs',
                              isCustom ? 'bg-amber-50 border border-amber-200' : 'bg-muted/40'
                            )}>
                              <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="font-medium text-foreground">{item.title}</span>
                              {isCustom && <span className="ml-auto text-amber-600 font-semibold">Custom</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Blocked menus count */}
                    {effective.length < ALL_PATHS.length && (
                      <p className="text-[11px] text-muted-foreground">
                        {ALL_PATHS.length - effective.length} section{ALL_PATHS.length - effective.length !== 1 ? 's' : ''} restricted
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              ROLES TAB
          ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="roles" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {roles.map(role => {
                const RoleIcon = ROLE_STYLE[role.id].icon;
                const usersInRole = users.filter(u => u.roleId === role.id);
                return (
                  <div key={role.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Role card header */}
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', ROLE_STYLE[role.id].cls)}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openEditRole(role)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* Users using this role */}
                    <div className="flex items-center gap-2 border-b border-border px-5 py-3 bg-muted/20">
                      <span className="text-xs text-muted-foreground">Assigned to:</span>
                      {usersInRole.map((u, i) => (
                        <div key={u.id} className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white', AVATAR_COLORS[users.indexOf(u) % AVATAR_COLORS.length])}
                          title={u.name}>
                          {u.avatar}
                        </div>
                      ))}
                      {usersInRole.length === 0 && <span className="text-xs text-muted-foreground italic">No users</span>}
                    </div>

                    {/* Menu access checklist (read-only) */}
                    <div className="px-5 py-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Menu Access
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {role.allowedPaths.length} / {ALL_PATHS.length}
                        </span>
                      </div>
                      <MenuCheckGrid allowedPaths={role.allowedPaths} disabled />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          EDIT ROLE SHEET
      ════════════════════════════════════════════════════════════════════════ */}
      <Sheet open={roleSheet} onOpenChange={setRoleSheet}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Role — {editingRole?.name}</SheetTitle>
            <SheetDescription>
              Toggle which admin panel menus this role can access.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <MenuCheckGrid
              allowedPaths={roleDraft}
              onChange={setRoleDraft}
            />
          </div>

          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{roleDraft.length} / {ALL_PATHS.length} menus enabled</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRoleSheet(false)}>Cancel</Button>
              <Button onClick={saveRole} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Role
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ════════════════════════════════════════════════════════════════════════
          EDIT USER PERMISSIONS SHEET
      ════════════════════════════════════════════════════════════════════════ */}
      <Sheet open={userSheet} onOpenChange={setUserSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Permissions — {editingUser?.name}</SheetTitle>
            <SheetDescription>
              Assign a role and optionally grant extra menus beyond the role's defaults.
            </SheetDescription>
          </SheetHeader>

          {editingUser && (
            <div className="mt-6 space-y-6">

              {/* Role selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">Role</Label>
                <Select value={userRoleDraft} onValueChange={v => {
                  setUserRoleDraft(v as RoleId);
                  // clear custom paths that are now covered by new role
                  const newRolePaths = roles.find(r => r.id === v)?.allowedPaths ?? [];
                  setCustomDraft(prev => prev.filter(p => !newRolePaths.includes(p)));
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => {
                      const Icon = ROLE_STYLE[r.id].icon;
                      return (
                        <SelectItem key={r.id} value={r.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {r.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  {roles.find(r => r.id === userRoleDraft)?.description}
                </p>
              </div>

              {/* Base role access — read-only */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide">
                    Base Access from Role
                  </Label>
                  <span className="text-xs text-muted-foreground">{rolePathsForDraft.length} menus</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <MenuCheckGrid allowedPaths={rolePathsForDraft} disabled />
                </div>
              </div>

              {/* Custom extra access */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide">
                    Custom Additional Access
                  </Label>
                  {extraPaths.length > 0 && (
                    <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      +{extraPaths.length} extra
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Grant individual menus on top of this user's role. These are highlighted in amber.
                </p>
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <div className="space-y-5">
                    {MENU_SECTIONS.map(sec => {
                      const extraInSec = sec.items.filter(i => !rolePathsForDraft.includes(i.path));
                      if (extraInSec.length === 0) return null;
                      return (
                        <div key={sec.section}>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {sec.section}
                          </p>
                          <div className="ml-2 grid gap-1.5">
                            {extraInSec.map(item => {
                              const Icon = item.icon;
                              const granted = customDraft.includes(item.path);
                              return (
                                <label key={item.path}
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors',
                                    granted ? 'border-amber-300 bg-amber-50' : 'border-border bg-background hover:bg-muted/40'
                                  )}>
                                  <Checkbox
                                    checked={granted}
                                    onCheckedChange={() => toggleCustomPath(item.path)}
                                  />
                                  <Icon className={cn('h-4 w-4 shrink-0', granted ? 'text-amber-600' : 'text-muted-foreground')} />
                                  <span className={cn('text-sm font-medium', granted ? 'text-foreground' : 'text-muted-foreground')}>
                                    {item.title}
                                  </span>
                                  {granted && (
                                    <span className="ml-auto text-[10px] font-semibold text-amber-600">Custom</span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Effective access summary */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-primary">
                  Effective Access — {effectiveForDraft.length} / {ALL_PATHS.length} menus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MENU_SECTIONS.flatMap(s => s.items).map(item => {
                    const has = effectiveForDraft.includes(item.path);
                    const isCustom = customDraft.includes(item.path) && !rolePathsForDraft.includes(item.path);
                    if (!has) return null;
                    return (
                      <span key={item.path} className={cn(
                        'rounded-full border px-2 py-0.5 text-[11px] font-medium',
                        isCustom ? 'border-amber-300 bg-amber-100 text-amber-700' : 'border-border bg-muted text-foreground'
                      )}>
                        {item.title}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setUserSheet(false)}>Cancel</Button>
            <Button onClick={saveUser} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Permissions
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
