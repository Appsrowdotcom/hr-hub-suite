import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  title: string;
  subtitle?: string;
  userName?: string;
  companyName?: string;
}

export function DashboardLayout({ 
  children, 
  role, 
  title, 
  subtitle,
  userName,
  companyName 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role={role} userName={userName} companyName={companyName} />
      <div className="pl-64">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
