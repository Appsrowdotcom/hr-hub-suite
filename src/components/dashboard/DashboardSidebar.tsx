import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import {
  Users,
  LayoutDashboard,
  Building2,
  Calendar,
  Clock,
  FileText,
  Settings,
  BarChart3,
  Briefcase,
  Wallet,
  MessageSquare,
  CreditCard,
  LogOut,
  ChevronLeft,
  Menu,
  UserCog,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Super Admin
  { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard, roles: ['super_admin'] },
  { label: 'Companies', href: '/super-admin/companies', icon: Building2, roles: ['super_admin'] },
  { label: 'Subscriptions', href: '/super-admin/subscriptions', icon: CreditCard, roles: ['super_admin'] },
  { label: 'Analytics', href: '/super-admin/analytics', icon: BarChart3, roles: ['super_admin'] },
  { label: 'Support Tickets', href: '/super-admin/tickets', icon: MessageSquare, roles: ['super_admin'] },
  { label: 'Settings', href: '/super-admin/settings', icon: Settings, roles: ['super_admin'] },

  // Company Admin
  { label: 'Dashboard', href: '/company-admin', icon: LayoutDashboard, roles: ['company_admin'] },
  { label: 'Employees', href: '/company-admin/employees', icon: Users, roles: ['company_admin'] },
  { label: 'Departments', href: '/company-admin/departments', icon: Building2, roles: ['company_admin'] },
  { label: 'Attendance', href: '/company-admin/attendance', icon: Clock, roles: ['company_admin'] },
  { label: 'Leaves', href: '/company-admin/leaves', icon: Calendar, roles: ['company_admin'] },
  { label: 'Reports', href: '/company-admin/reports', icon: BarChart3, roles: ['company_admin'] },
  { label: 'Settings', href: '/company-admin/settings', icon: Settings, roles: ['company_admin'] },

  // HR
  { label: 'Dashboard', href: '/hr', icon: LayoutDashboard, roles: ['hr'] },
  { label: 'Employees', href: '/hr/employees', icon: Users, roles: ['hr'] },
  { label: 'Attendance', href: '/hr/attendance', icon: Clock, roles: ['hr'] },
  { label: 'Leaves', href: '/hr/leaves', icon: Calendar, roles: ['hr'] },
  { label: 'Recruitment', href: '/hr/recruitment', icon: Briefcase, roles: ['hr'] },
  { label: 'Documents', href: '/hr/documents', icon: FileText, roles: ['hr'] },
  { label: 'Reports', href: '/hr/reports', icon: BarChart3, roles: ['hr'] },
];

interface DashboardSidebarProps {
  role: UserRole;
  userName?: string;
  companyName?: string;
}

export function DashboardSidebar({ role, userName = 'John Doe', companyName }: DashboardSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const roleLabel = {
    super_admin: 'Super Admin',
    company_admin: 'Company Admin',
    hr: 'HR Manager',
    employee: 'Employee',
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg">HRFlow</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium">{userName.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{roleLabel[role]}</p>
            </div>
          </div>
          {companyName && (
            <div className="mt-3 px-3 py-2 bg-sidebar-accent rounded-lg">
              <p className="text-xs text-sidebar-foreground/60">Company</p>
              <p className="text-sm font-medium truncate">{companyName}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
