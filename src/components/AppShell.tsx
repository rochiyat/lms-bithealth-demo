import { Button } from '@heroui/react';
import {
  Award, BadgeCheck, BarChart3, Bell, BookOpen, Building2, CalendarRange, ChevronDown,
  ClipboardCheck, FileBadge, Flag, Gauge, GraduationCap, LayoutDashboard, LogOut, Menu,
  Network, PanelLeftClose, PanelLeftOpen, Route, Puzzle, Settings, Sparkles, Target,
  Trophy, UserRoundCheck, Users, X, Sun, Moon, CheckCheck
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/domain/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppDataContext';
import { BrandMark } from './ui';
import { initials, labelize } from '@/utils/format';

interface NavItem { label: string; to: string; icon: React.ComponentType<{ size?: number }>; }
interface NavSection { label?: string; items: NavItem[]; }

const roleNav: Record<Role, NavSection[]> = {
  SUPER_ADMIN: [
    { items: [{ label: 'Platform Dashboard', to: '/', icon: LayoutDashboard }] },
    { label: 'Organization', items: [
      { label: 'Groups & Tenants', to: '/organization', icon: Building2 },
      { label: 'Employees', to: '/employees', icon: Users },
      { label: 'Departments', to: '/departments', icon: Network },
    ] },
    { label: 'Operations', items: [
      { label: 'Audit Log', to: '/audit', icon: ClipboardCheck },
      { label: 'Settings & Data', to: '/settings', icon: Settings },
    ] },
  ],
  HR_ADMIN: [
    { items: [{ label: 'HR Dashboard', to: '/', icon: LayoutDashboard }] },
    { label: 'Organization', items: [
      { label: 'Employees', to: '/employees', icon: Users },
      { label: 'Departments', to: '/departments', icon: Building2 },
      { label: 'Job Families', to: '/job-families', icon: Network },
      { label: 'Project Squads', to: '/squads', icon: UserRoundCheck },
    ] },
    { label: 'Learning Management', items: [
      { label: 'Courses', to: '/courses', icon: BookOpen },
      { label: 'Quizzes', to: '/quizzes', icon: ClipboardCheck },
      { label: 'Learning Paths', to: '/learning-paths', icon: Route },
      { label: 'Campaigns', to: '/campaigns', icon: Flag },
      { label: 'Assignments', to: '/assignments', icon: Target },
      { label: 'Certificates', to: '/certificates', icon: FileBadge },
    ] },
    { label: 'Gamification', items: [
      { label: 'Gamification Overview', to: '/gamification', icon: Sparkles },
      { label: 'Weekly Challenges', to: '/gamification/challenges', icon: Puzzle },
      { label: 'Badges & Levels', to: '/gamification/badges', icon: Award },
      { label: 'Missions', to: '/gamification/missions', icon: CalendarRange },
      { label: 'Leaderboards', to: '/leaderboard', icon: Trophy },
    ] },
    { label: 'Analytics', items: [
      { label: 'Employee Progress', to: '/analytics/progress', icon: Gauge },
      { label: 'Knowledge Gap', to: '/analytics/knowledge-gap', icon: BarChart3 },
      { label: 'Course Feedback', to: '/analytics/feedback', icon: BadgeCheck },
      { label: 'Reports', to: '/analytics/reports', icon: GraduationCap },
    ] },
    { label: 'System', items: [{ label: 'Settings & Data', to: '/settings', icon: Settings }] },
  ],
  MANAGER: [
    { items: [{ label: 'Team Dashboard', to: '/', icon: LayoutDashboard }] },
    { label: 'Team', items: [
      { label: 'Team Learning', to: '/team-learning', icon: BookOpen },
      { label: 'Knowledge Gap', to: '/analytics/knowledge-gap', icon: BarChart3 },
      { label: 'Team Achievements', to: '/achievements', icon: Award },
      { label: 'Certificates', to: '/certificates', icon: FileBadge },
      { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
      { label: 'Reports', to: '/analytics/reports', icon: GraduationCap },
    ] },
  ],
  EMPLOYEE: [
    { items: [{ label: 'Home', to: '/', icon: LayoutDashboard }] },
    { label: 'Learning', items: [
      { label: 'My Learning', to: '/my-learning', icon: BookOpen },
      { label: 'Learning Paths', to: '/learning-paths', icon: Route },
      { label: 'Campaigns', to: '/campaigns', icon: Flag },
      { label: 'Weekly Challenge', to: '/gamification/challenges', icon: Puzzle },
    ] },
    { label: 'Recognition', items: [
      { label: 'Achievements', to: '/achievements', icon: Award },
      { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
      { label: 'Certificates', to: '/certificates', icon: FileBadge },
      { label: 'Learning History', to: '/history', icon: GraduationCap },
    ] },
  ],
};

export function AppShell() {
  const { user, logout, switchRole, activeTenantId, switchTenant } = useAuth();
  const { db, updateItem } = useAppData();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const activeTenant = db?.tenants.find(t => t.id === activeTenantId);
  const tenantName = activeTenant ? activeTenant.name : 'Unknown Tenant';

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bithealth-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bithealth-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (!user) return null;
  const notifications = db?.notifications.filter((item) => item.userId === user.id) ?? [];
  const unread = notifications.filter((item) => !item.read).length;
  const navSections = roleNav[user.role];
  const pageTitle = useMemo(() => navSections.flatMap((section) => section.items).find((item) => item.to === location.pathname)?.label ?? 'Bithealth Learning Hub', [navSections, location.pathname]);

  const markAllRead = async () => {
    const unreadItems = notifications.filter((item) => !item.read);
    await Promise.all(unreadItems.map((item) => updateItem('notifications', item.id, { read: true })));
  };

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileOpen && <button className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" />}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand"><BrandMark compact={collapsed} /><Button isIconOnly size="sm" variant="ghost" aria-label="Tutup" className="mobile-close" onPress={() => setMobileOpen(false)}><X size={18} /></Button></div>
        <nav>
          {navSections.map((section, index) => <div className="nav-section" key={`${section.label}-${index}`}>
            {section.label && !collapsed && <span className="nav-section-label">{section.label}</span>}
            {section.items.map((item) => {
              const Icon = item.icon;
              return <NavLink title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to={item.to} key={item.to} end={item.to === '/'}><Icon size={19} />{!collapsed && <span>{item.label}</span>}</NavLink>;
            })}
          </div>)}
        </nav>
        <div className="sidebar-footer">
          <Button fullWidth variant="ghost" onPress={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Ringkas sidebar</span></>}</Button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left"><Button className="mobile-menu" isIconOnly variant="ghost" aria-label="Buka navigasi" onPress={() => setMobileOpen(true)}><Menu size={20} /></Button><div><span>Workspace</span><strong>{pageTitle}</strong></div></div>
          <div className="topbar-right">
            {(user.role === 'SUPER_ADMIN' || (user.allowedTenants && user.allowedTenants.length > 0)) && (
              <select 
                className="toolbar-select" 
                style={{ marginLeft: '12px', marginRight: '8px' }}
                value={activeTenantId || ''} 
                onChange={(e) => switchTenant(e.target.value)}
                title="Tenant Switcher"
              >
                {db?.tenants.filter(t => user.role === 'SUPER_ADMIN' || user.allowedTenants?.includes(t.id)).map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            )}
            <Button isIconOnly variant="ghost" aria-label="Ganti Tema" onPress={toggleTheme}>
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </Button>
            <div className="topbar-popover-wrap">
              <Button isIconOnly variant="ghost" aria-label="Notifikasi" onPress={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} />{unread > 0 && <i className="notification-dot">{unread}</i>}</Button>
              {notificationsOpen && (
                <div className="popover-panel notifications-panel">
                  <div className="popover-title">
                    <strong>Notifikasi</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{unread} belum dibaca</span>
                      {unread > 0 && (
                        <button onClick={markAllRead} style={{ background: 'transparent', border: 0, padding: 0, display: 'flex', alignItems: 'center', color: 'var(--brand)', cursor: 'pointer', fontWeight: 600, fontSize: '10px' }} title="Tandai semua dibaca">
                          <CheckCheck size={14} style={{ marginRight: '2px' }} /> Semua
                        </button>
                      )}
                    </div>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                      Tidak ada notifikasi baru
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <div className="notification-item" key={item.id}>
                        <span className={`notification-type ${item.type.toLowerCase()}`} />
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="topbar-popover-wrap">
              <button className="profile-button" onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">{initials(user.name)}</span><div><strong>{user.name}</strong><span>{labelize(user.role)} • {tenantName}</span></div><ChevronDown size={16} /></button>
              {profileOpen && <div className="popover-panel profile-panel"><div className="profile-summary"><span className="avatar large">{initials(user.name)}</span><div><strong>{user.name}</strong><span>{user.email}</span><span style={{ display: 'block', fontSize: '11px', marginTop: '2px', color: 'var(--brand)' }}>{tenantName}</span></div></div><label><span>Demo role switcher</span><select value={user.role} onChange={(event) => { switchRole(event.target.value as Role); setProfileOpen(false); }}><option value="SUPER_ADMIN">Super Admin</option><option value="HR_ADMIN">HR Admin</option><option value="MANAGER">Manager</option><option value="EMPLOYEE">Employee</option></select></label><Button fullWidth variant="danger-soft" onPress={logout}><LogOut size={16} />Keluar</Button></div>}
            </div>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
