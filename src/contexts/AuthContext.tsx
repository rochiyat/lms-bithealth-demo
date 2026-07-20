import { createContext, useContext, useMemo, useState } from 'react';
import type { Role, User } from '@/domain/types';
import { useAppData } from './AppDataContext';

const SESSION_KEY = 'bithealth-learning-hub-session';

interface AuthContextValue {
  user: User | null;
  activeTenantId: string | null;
  login: (email: string, password: string) => boolean;
  loginAsRole: (role: Role) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  switchTenant: (tenantId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { db } = useAppData();
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [activeTenantId, setActiveTenantId] = useState<string | null>(() => localStorage.getItem('bithealth-active-tenant'));
  const user = db?.users.find((candidate) => candidate.id === sessionUserId) ?? null;

  const switchTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
    localStorage.setItem('bithealth-active-tenant', tenantId);
  };

  const persist = (id: string | null, newActiveTenantId?: string | null) => {
    setSessionUserId(id);
    if (id) {
      localStorage.setItem(SESSION_KEY, id);
      if (newActiveTenantId) {
        setActiveTenantId(newActiveTenantId);
        localStorage.setItem('bithealth-active-tenant', newActiveTenantId);
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('bithealth-active-tenant');
      setActiveTenantId(null);
    }
  };

  const login = (email: string, password: string) => {
    const found = db?.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password && candidate.status === 'ACTIVE');
    if (!found) return false;
    persist(found.id, found.tenantId ?? (found.allowedTenants?.[0] ?? null));
    return true;
  };

  const loginAsRole = (role: Role) => {
    const found = db?.users.find((candidate) => candidate.role === role && candidate.status === 'ACTIVE');
    if (!found) return false;
    persist(found.id, found.tenantId ?? (found.allowedTenants?.[0] ?? null));
    return true;
  };

  const switchRole = (role: Role) => { void loginAsRole(role); };
  const logout = () => persist(null);

  const value = useMemo(() => ({ user, activeTenantId, login, loginAsRole, logout, switchRole, switchTenant }), [user, activeTenantId, db]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus dipakai di dalam AuthProvider.');
  return value;
};
