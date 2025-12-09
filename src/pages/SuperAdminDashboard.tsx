import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, CreditCard, TrendingUp, DollarSign, MessageSquare, Plus } from 'lucide-react';
import { platformStats, mockCompanies } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout 
      role="super_admin" 
      title="Platform Overview"
      subtitle="Welcome back, Super Admin"
      userName="Admin User"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Companies"
          value={platformStats.totalCompanies.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={Building2}
        />
        <StatsCard
          title="Total Employees"
          value={platformStats.totalEmployees.toLocaleString()}
          change="+8% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Active Subscriptions"
          value={platformStats.activeSubscriptions.toLocaleString()}
          change="+5% from last month"
          changeType="positive"
          icon={CreditCard}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${platformStats.monthlyRevenue.toLocaleString()}`}
          change="+15% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Companies */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Companies</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/super-admin/companies">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCompanies.slice(0, 4).map((company) => (
                <div 
                  key={company.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{company.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{company.employeeCount} employees</p>
                      <Badge variant={company.status === 'active' ? 'success' : 'muted'} className="mt-1">
                        {company.status}
                      </Badge>
                    </div>
                    <Badge variant={company.plan === 'enterprise' ? 'accent' : company.plan === 'professional' ? 'secondary' : 'outline'}>
                      {company.plan}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="accent" className="w-full justify-start" asChild>
                <Link to="/super-admin/companies/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Company
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/super-admin/tickets">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Support Tickets
                  <Badge variant="destructive" className="ml-auto">{platformStats.supportTickets}</Badge>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/super-admin/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">New Companies</span>
                  <span className="font-semibold text-foreground">{platformStats.newCompaniesThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Support Tickets</span>
                  <span className="font-semibold text-foreground">{platformStats.supportTickets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Churn Rate</span>
                  <span className="font-semibold text-success">2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg. Revenue/Company</span>
                  <span className="font-semibold text-foreground">$149</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
