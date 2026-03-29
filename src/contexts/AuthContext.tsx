import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Company {
  id: string;
  company_name: string;
  industry_type: string;
  email: string;
  location: string | null;
}

export type AppRole = 'admin' | 'industry' | 'procurement' | 'sustainability' | 'supplier';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  company: Company | null;
  roles: AppRole[];
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: AppRole) => boolean;
  signUp: (email: string, password: string, metadata: { company_name: string; industry_type: string; location: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = roles.includes('admin');

  const fetchCompanyAndRoles = async (userId: string) => {
    const [companyRes, rolesRes] = await Promise.all([
      supabase.from('companies').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ]);
    if (companyRes.data) setCompany(companyRes.data as Company);
    if (rolesRes.data) setRoles(rolesRes.data.map(r => r.role as AppRole));
    else setRoles([]);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchCompanyAndRoles(session.user.id), 0);
        } else {
          setCompany(null);
          setRoles([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCompanyAndRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = (role: AppRole) => roles.includes(role) || roles.includes('admin');

  const signUp = async (email: string, password: string, metadata: { company_name: string; industry_type: string; location: string }) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: metadata, emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setSession(null); setCompany(null); setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, session, company, roles, isAdmin, loading, isAuthenticated: !!user, hasRole, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
