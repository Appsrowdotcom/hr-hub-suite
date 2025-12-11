import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AppRole = 'super_admin' | 'company_admin' | 'hr' | 'employee';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

interface CompanyUser {
  id: string;
  company_id: string;
  role: AppRole;
  is_active: boolean;
  companies: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: AppRole[];
  companyUsers: CompanyUser[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, companyName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // Fetch global roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (rolesData) {
        setRoles(rolesData.map(r => r.role as AppRole));
      }

      // Fetch company memberships
      const { data: companyData } = await supabase
        .from('company_users')
        .select(`
          id,
          company_id,
          role,
          is_active,
          companies (
            id,
            name,
            slug
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (companyData) {
        setCompanyUsers(companyData as CompanyUser[]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
          setCompanyUsers([]);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string, companyName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error as Error };
    }

    // If company name provided, create company and assign user as company_admin
    if (data.user && companyName) {
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          slug: `${slug}-${Date.now()}`,
          email: email,
        })
        .select()
        .single();

      if (companyError) {
        console.error('Error creating company:', companyError);
        return { error: companyError as unknown as Error };
      }

      if (company) {
        // Create employee record
        const { data: employee } = await supabase
          .from('employees')
          .insert({
            user_id: data.user.id,
            company_id: company.id,
            full_name: fullName,
            email: email,
            position: 'Company Admin',
            status: 'active',
          })
          .select()
          .single();

        // Add user to company as admin
        await supabase
          .from('company_users')
          .insert({
            user_id: data.user.id,
            company_id: company.id,
            employee_id: employee?.id,
            role: 'company_admin',
            is_active: true,
          });
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setCompanyUsers([]);
  };

  const isSuperAdmin = roles.includes('super_admin');

  const getRedirectPath = () => {
    if (isSuperAdmin) return '/super-admin';
    
    const primaryCompanyRole = companyUsers[0]?.role;
    if (primaryCompanyRole === 'company_admin') return '/company-admin';
    if (primaryCompanyRole === 'hr') return '/hr';
    if (primaryCompanyRole === 'employee') return '/employee';
    
    return '/';
  };

  const value = {
    user,
    session,
    profile,
    roles,
    companyUsers,
    loading,
    signIn,
    signUp,
    signOut,
    isSuperAdmin,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
