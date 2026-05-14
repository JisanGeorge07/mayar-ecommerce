import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users, Shield, ShieldCheck, Pencil, Trash2, Plus,
  LayoutDashboard, FolderTree, Layers, Package, ShoppingCart,
  Sparkles, CircleDot, LayoutGrid, Ticket,
  Building2, MessageCircle, Truck, RefreshCcw, ScrollText,
  BellRing, Settings, Grid3X3, UserPlus, ShieldPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Menu tree (mirrors AdminLayout NAV_SECTIONS exactly) ─────────────────────

const MENU_SECTIONS = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard',     title: 'Dashboard',     icon: LayoutDashboard },
      { path: '/categories',    title: 'Categories',    icon: FolderTree      },
      { path: '/subcategories', title: 'Subcategories', icon: Layers          },
      { path: '/product-types', title: 'Product Types', icon: Grid3X3         },
      { path: '/products',      title: 'Products',      icon: Package         },
      { path: '/orders',        title: 'Orders',        icon: ShoppingCart    },
    ],
  },
  {
    section: 'Content',
    items: [
      { path: '/hero-banners',     title: 'Hero Banners',     icon: Sparkles   },
      { path: '/shop-by-category', title: 'Shop by Category', icon: CircleDot  },
      { path: '/promo-banners',    title: 'Promo Banners',    icon: LayoutGrid },
      { path: '/coupons',          title: 'Coupons',          icon: Ticket     },
    ],
  },
  {
    section: 'Pages',
    items: [
      { path: '/pages/about-us',             title: 'About Us',             icon: Building2     },
      { path: '/pages/privacy-policy',       title: 'Privacy Policy',       icon: Shield        },
      { path: '/pages/contact-us',           title: 'Contact Us',           icon: MessageCircle },
      { path: '/pages/shipping-information', title: 'Shipping Information',  icon: Truck         },
      { path: '/pages/returns-exchange',     title: 'Returns & Exchange',   icon: RefreshCcw    },
      { path: '/pages/terms-conditions',     title: 'Terms & Conditions',   icon: ScrollText    },
    ],
  },
  {
    section: 'System',
    items: [
      { path: '/notifications', title: 'Notifications', icon: BellRing },
      { path: '/settings',      title: 'Settings',      icon: Settings },
    ],
  },
];

const ALL_PATHS = MENU_SECTIONS.flatMap(s => s.items.map(i => i.path));

// ─── Types ────────────────────────────────────────────────────────────────────

interface Role {
  id: string;
  name: string;
  description: string;
  allowedPaths: string[];
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleId: string;
  customPaths: string[];
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
  { id: 'u1', name: 'Anessh', email: 'anessh@mayarshop.com', avatar: 'AN', roleId: 'admin', customPaths: [] },
  { id: 'u2', name: 'Jisan',  email: 'jisan@mayarshop.com',  avatar: 'JI', roleId: 'sales', customPaths: [] },
  { id: 'u3', name: 'Shahul', email: 'shahul@mayarshop.com', avatar: 'SH', roleId: 'sales', customPaths: ['/orders', '/products'] },
];

// ─── Style helpers ────────────────────────────────────────────────────────────

const ROLE_PALETTES = [
  { cls: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', icon: ShieldCheck },
  { cls: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   icon: Shield      },
  { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: ShieldCheck },
  { cls: 'bg-rose-100 text-rose-700 border-rose-200',       dot: 'bg-rose-500',   icon: Shield      },
  { cls: 'bg-amber-100 text-amber-700 border-amber-200',    dot: 'bg-amber-500',  icon: ShieldCheck },
  { cls: 'bg-teal-100 text-teal-700 border-teal-200',       dot: 'bg-teal-500',   icon: Shield      },
];

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-rose-500', 'bg-amber-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
];

function getRolePalette(roles: Role[], roleId: string) {
  const idx = roles.findIndex(r => r.id === roleId);
  return ROLE_PALETTES[idx % ROLE_PALETTES.length] ?? ROLE_PALETTES[0];
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
}

function getEffectivePaths(user: AppUser, roles: Role[]): string[] {
  const role = roles.find(r => r.id === user.roleId);
  const base = role?.allowedPaths ?? [];
  return Array.from(new Set([...base, ...user.customPaths]));
}

// ─── MenuCheckGrid ────────────────────────────────────────────────────────────

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
    onChange(allowedPaths.includes(path)
      ? allowedPaths.filter(p => p !== path)
      : [...allowedPaths, path]);
  };

  const toggleSection = (paths: string[]) => {
    if (disabled || !onChange) return;
    const allOn = paths.every(p => allowedPaths.includes(p));
    onChange(allOn
      ? allowedPaths.filter(p => !paths.includes(p))
      : Array.from(new Set([...allowedPaths, ...paths])));
  };

  return (
    <div className="space-y-5">
      {MENU_SECTIONS.map(sec => {
        const secPaths = sec.items.map(i => i.path);
        const allChecked = secPaths.every(p => allowedPaths.includes(p));
        const someChecked = secPaths.some(p => allowedPaths.includes(p));
        return (
          <div key={sec.section}>
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
                      'flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors',
                      disabled ? 'cursor-default' : 'cursor-pointer',
                      checked
                        ? isCustom
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-border bg-muted/40'
                        : 'border-transparent bg-transparent opacity-50',
                      !disabled && 'hover:bg-muted/60',
                    )}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggle(item.path)} disabled={disabled} />
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

  // ── Role sheet (create + edit) ────────────────────────────────────────────
  const [roleSheet, setRoleSheet] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleDraft, setRoleDraft] = useState<string[]>([]);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  // ── User sheet (create + edit) ────────────────────────────────────────────
  const [userSheet, setUserSheet] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRoleDraft, setUserRoleDraft] = useState('');
  const [customDraft, setCustomDraft] = useState<string[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // ── Role actions ──────────────────────────────────────────────────────────

  const openCreateRole = () => {
    setEditingRoleId(null);
    setRoleName('');
    setRoleDesc('');
    setRoleDraft([]);
    setRoleSheet(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setRoleDraft([...role.allowedPaths]);
    setRoleSheet(true);
  };

  const saveRole = () => {
    if (!roleName.trim()) { toast.error('Role name is required'); return; }
    if (editingRoleId) {
      setRoles(prev => prev.map(r =>
        r.id === editingRoleId ? { ...r, name: roleName.trim(), description: roleDesc.trim(), allowedPaths: roleDraft } : r
      ));
      toast.success(`"${roleName}" role updated`);
    } else {
      const newId = roleName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
      setRoles(prev => [...prev, { id: newId, name: roleName.trim(), description: roleDesc.trim(), allowedPaths: roleDraft }]);
      toast.success(`"${roleName}" role created`);
    }
    setRoleSheet(false);
  };

  const confirmDeleteRole = () => {
    if (!deleteRoleId) return;
    const role = roles.find(r => r.id === deleteRoleId);
    const affected = users.filter(u => u.roleId === deleteRoleId).length;
    if (affected > 0) {
      toast.error(`Cannot delete — ${affected} user${affected > 1 ? 's are' : ' is'} assigned to "${role?.name}"`);
      setDeleteRoleId(null);
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== deleteRoleId));
    toast.success(`"${role?.name}" role deleted`);
    setDeleteRoleId(null);
  };

  // ── User actions ──────────────────────────────────────────────────────────

  const openCreateUser = () => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserRoleDraft(roles[0]?.id ?? '');
    setCustomDraft([]);
    setUserSheet(true);
  };

  const openEditUser = (user: AppUser) => {
    setEditingUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRoleDraft(user.roleId);
    setCustomDraft([...user.customPaths]);
    setUserSheet(true);
  };

  const saveUser = () => {
    if (!userName.trim()) { toast.error('Name is required'); return; }
    if (!userEmail.trim()) { toast.error('Email is required'); return; }
    if (!userRoleDraft) { toast.error('Select a role'); return; }

    const rolePathsNow = roles.find(r => r.id === userRoleDraft)?.allowedPaths ?? [];
    const cleanCustom = customDraft.filter(p => !rolePathsNow.includes(p));

    if (editingUserId) {
      setUsers(prev => prev.map(u =>
        u.id === editingUserId
          ? { ...u, name: userName.trim(), email: userEmail.trim(), roleId: userRoleDraft, customPaths: cleanCustom, avatar: initials(userName) }
          : u
      ));
      toast.success(`${userName} updated`);
    } else {
      const newId = 'u_' + Date.now();
      setUsers(prev => [...prev, {
        id: newId,
        name: userName.trim(),
        email: userEmail.trim(),
        avatar: initials(userName),
        roleId: userRoleDraft,
        customPaths: cleanCustom,
      }]);
      toast.success(`${userName} added`);
    }
    setUserSheet(false);
  };

  const confirmDeleteUser = () => {
    if (!deleteUserId) return;
    const user = users.find(u => u.id === deleteUserId);
    setUsers(prev => prev.filter(u => u.id !== deleteUserId));
    toast.success(`${user?.name} removed`);
    setDeleteUserId(null);
  };

  // ── Derived for user sheet ────────────────────────────────────────────────

  const rolePathsForDraft = roles.find(r => r.id === userRoleDraft)?.allowedPaths ?? [];
  const extraPaths = customDraft.filter(p => !rolePathsForDraft.includes(p));
  const effectiveForDraft = Array.from(new Set([...rolePathsForDraft, ...customDraft]));

  const toggleCustomPath = (path: string) => {
    if (rolePathsForDraft.includes(path)) return;
    setCustomDraft(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  };

  const handleRoleChangeInUserSheet = (newRoleId: string) => {
    setUserRoleDraft(newRoleId);
    const newRolePaths = roles.find(r => r.id === newRoleId)?.allowedPaths ?? [];
    setCustomDraft(prev => prev.filter(p => !newRolePaths.includes(p)));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Users className="h-6 w-6 text-primary" /> Roles &amp; Permissions
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Define role-based access and grant custom menu permissions per user.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={openCreateRole}>
              <ShieldPlus className="mr-1.5 h-4 w-4" /> Add Role
            </Button>
            <Button onClick={openCreateUser} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="mr-1.5 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">
              Users <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{users.length}</span>
            </TabsTrigger>
            <TabsTrigger value="roles">
              Roles <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{roles.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* ══════════════════════════════════════════════════════════════════
              USERS TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="users" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Each user inherits their role's access. Grant extra menus individually.
            </p>

            {users.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-sm text-muted-foreground">
                No users yet. Click "Add User" to get started.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              {users.map((user, idx) => {
                const role = roles.find(r => r.id === user.roleId);
                const effective = getEffectivePaths(user, roles);
                const palette = getRolePalette(roles, user.roleId);
                const RoleIcon = palette.icon;

                return (
                  <div key={user.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                    {/* User header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shrink-0', AVATAR_COLORS[idx % AVATAR_COLORS.length])}>
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditUser(user)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => setDeleteUserId(user.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Role + custom badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', palette.cls)}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {role?.name ?? 'Unknown Role'}
                      </span>
                      {user.customPaths.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          +{user.customPaths.length} custom
                        </span>
                      )}
                    </div>

                    {/* Accessible menus */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Can access ({effective.length}/{ALL_PATHS.length} menus)
                      </p>
                      <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                        {MENU_SECTIONS.flatMap(sec => sec.items).map(item => {
                          const Icon = item.icon;
                          const hasAccess = effective.includes(item.path);
                          const isCustom = user.customPaths.includes(item.path) && !role?.allowedPaths.includes(item.path);
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

                    {effective.length < ALL_PATHS.length && (
                      <p className="text-[11px] text-muted-foreground border-t border-border pt-2">
                        {ALL_PATHS.length - effective.length} section{ALL_PATHS.length - effective.length !== 1 ? 's' : ''} restricted
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ROLES TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="roles" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Roles define the default menu access inherited by every assigned user.
            </p>

            {roles.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center text-sm text-muted-foreground">
                No roles yet. Click "Add Role" to create one.
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {roles.map(role => {
                const palette = getRolePalette(roles, role.id);
                const RoleIcon = palette.icon;
                const usersInRole = users.filter(u => u.roleId === role.id);
                return (
                  <div key={role.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Role card header */}
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', palette.cls)}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => openEditRole(role)}>
                          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive/60 hover:text-destructive"
                          onClick={() => setDeleteRoleId(role.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Assigned users */}
                    <div className="flex items-center gap-2 flex-wrap border-b border-border px-5 py-3 bg-muted/20">
                      <span className="text-xs text-muted-foreground">Assigned to:</span>
                      {usersInRole.map(u => (
                        <div
                          key={u.id}
                          title={u.name}
                          className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white', AVATAR_COLORS[users.indexOf(u) % AVATAR_COLORS.length])}
                        >
                          {u.avatar}
                        </div>
                      ))}
                      {usersInRole.length === 0 && <span className="text-xs text-muted-foreground italic">No users assigned</span>}
                      <span className="ml-auto text-xs text-muted-foreground">{role.allowedPaths.length}/{ALL_PATHS.length} menus</span>
                    </div>

                    {/* Menu checklist (read-only view) */}
                    <div className="px-5 py-4">
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
          CREATE / EDIT ROLE SHEET
      ════════════════════════════════════════════════════════════════════════ */}
      <Sheet open={roleSheet} onOpenChange={setRoleSheet}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRoleId ? 'Edit Role' : 'Create Role'}</SheetTitle>
            <SheetDescription>
              {editingRoleId ? 'Update this role's name, description, and menu access.' : 'Define a new role and select which menus it can access.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide">Role Name *</Label>
              <Input
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder="e.g. Marketing, Support, Finance"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide">Description</Label>
              <Textarea
                value={roleDesc}
                onChange={e => setRoleDesc(e.target.value)}
                placeholder="Brief description of what this role can do..."
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Menu access */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wide">Menu Access</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{roleDraft.length}/{ALL_PATHS.length}</span>
                  <button
                    type="button"
                    onClick={() => setRoleDraft(roleDraft.length === ALL_PATHS.length ? [] : ALL_PATHS)}
                    className="text-xs text-primary hover:underline"
                  >
                    {roleDraft.length === ALL_PATHS.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/10 px-4 py-3">
                <MenuCheckGrid allowedPaths={roleDraft} onChange={setRoleDraft} />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setRoleSheet(false)}>Cancel</Button>
            <Button onClick={saveRole} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingRoleId ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ════════════════════════════════════════════════════════════════════════
          CREATE / EDIT USER SHEET
      ════════════════════════════════════════════════════════════════════════ */}
      <Sheet open={userSheet} onOpenChange={setUserSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingUserId ? `Edit — ${userName}` : 'Add User'}</SheetTitle>
            <SheetDescription>
              {editingUserId ? 'Update user details, role, and custom permissions.' : 'Add a new user and assign their role and permissions.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide">Name *</Label>
                <Input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide">Email *</Label>
                <Input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="user@mayarshop.com" />
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">Role *</Label>
              <Select value={userRoleDraft} onValueChange={handleRoleChangeInUserSheet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r, i) => {
                    const p = ROLE_PALETTES[i % ROLE_PALETTES.length];
                    const Icon = p.icon;
                    return (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{r.name}</span>
                          <span className="text-xs text-muted-foreground">· {r.allowedPaths.length} menus</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {userRoleDraft && (
                <p className="text-[11px] text-muted-foreground">
                  {roles.find(r => r.id === userRoleDraft)?.description}
                </p>
              )}
            </div>

            {/* Base role access — read-only */}
            {userRoleDraft && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Base Access from Role</Label>
                  <span className="text-xs text-muted-foreground">{rolePathsForDraft.length} menus</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <MenuCheckGrid allowedPaths={rolePathsForDraft} disabled />
                </div>
              </div>
            )}

            {/* Custom extra access */}
            {userRoleDraft && rolePathsForDraft.length < ALL_PATHS.length && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Custom Additional Access</Label>
                  {extraPaths.length > 0 && (
                    <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      +{extraPaths.length} extra
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Grant individual menus beyond this user's role. Highlighted in amber.
                </p>
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-4 space-y-5">
                  {MENU_SECTIONS.map(sec => {
                    const extraInSec = sec.items.filter(i => !rolePathsForDraft.includes(i.path));
                    if (extraInSec.length === 0) return null;
                    return (
                      <div key={sec.section}>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{sec.section}</p>
                        <div className="ml-2 grid gap-1.5">
                          {extraInSec.map(item => {
                            const Icon = item.icon;
                            const granted = customDraft.includes(item.path);
                            return (
                              <label key={item.path} className={cn(
                                'flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors',
                                granted ? 'border-amber-300 bg-amber-50' : 'border-border bg-background hover:bg-muted/40'
                              )}>
                                <Checkbox checked={granted} onCheckedChange={() => toggleCustomPath(item.path)} />
                                <Icon className={cn('h-4 w-4 shrink-0', granted ? 'text-amber-600' : 'text-muted-foreground')} />
                                <span className={cn('text-sm font-medium', granted ? 'text-foreground' : 'text-muted-foreground')}>
                                  {item.title}
                                </span>
                                {granted && <span className="ml-auto text-[10px] font-semibold text-amber-600">Custom</span>}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Effective access summary */}
            {userRoleDraft && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-primary">
                  Effective Access — {effectiveForDraft.length}/{ALL_PATHS.length} menus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MENU_SECTIONS.flatMap(s => s.items).map(item => {
                    const has = effectiveForDraft.includes(item.path);
                    if (!has) return null;
                    const isCustom = customDraft.includes(item.path) && !rolePathsForDraft.includes(item.path);
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
            )}
          </div>

          <div className="sticky bottom-0 mt-6 -mx-6 border-t border-border bg-card px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setUserSheet(false)}>Cancel</Button>
            <Button onClick={saveUser} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingUserId ? 'Save Changes' : 'Add User'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Delete Role Dialog ────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const affected = users.filter(u => u.roleId === deleteRoleId).length;
                return affected > 0
                  ? `Cannot delete — ${affected} user${affected > 1 ? 's are' : ' is'} currently assigned to this role. Reassign them first.`
                  : 'This role will be permanently deleted. This cannot be undone.';
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete User Dialog ────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              {users.find(u => u.id === deleteUserId)?.name} will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
