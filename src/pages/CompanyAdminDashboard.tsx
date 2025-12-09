import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Clock, Calendar, Building2, UserPlus, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { companyStats, mockEmployees, mockLeaveRequests, mockDepartments } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function CompanyAdminDashboard() {
  const pendingLeaves = mockLeaveRequests.filter(l => l.status === 'pending');

  return (
    <DashboardLayout 
      role="company_admin" 
      title="Company Dashboard"
      subtitle="TechCorp Solutions"
      userName="Michael Chen"
      companyName="TechCorp Solutions"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Employees"
          value={companyStats.totalEmployees}
          change="+3 this month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Present Today"
          value={companyStats.presentToday}
          change={`${Math.round((companyStats.presentToday / companyStats.totalEmployees) * 100)}% attendance`}
          changeType="neutral"
          icon={Clock}
          iconColor="text-success"
        />
        <StatsCard
          title="On Leave"
          value={companyStats.onLeave}
          icon={Calendar}
          iconColor="text-warning"
        />
        <StatsCard
          title="Departments"
          value={companyStats.departments}
          icon={Building2}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Leave Requests
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/company-admin/leaves">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingLeaves.length > 0 ? (
                <div className="space-y-4">
                  {pendingLeaves.map((leave) => (
                    <div 
                      key={leave.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-accent/10 text-accent">
                            {leave.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{leave.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} • {leave.days} day(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Reject</Button>
                        <Button variant="success" size="sm">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
                  <p>No pending leave requests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Employees */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Employees</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/company-admin/employees">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEmployees.slice(0, 5).map((employee) => (
                  <div 
                    key={employee.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{employee.department}</span>
                      <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'on_leave' ? 'warning' : 'muted'}>
                        {employee.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="accent" className="w-full justify-start" asChild>
                <Link to="/company-admin/employees/new">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Employee
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/company-admin/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Reports
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/company-admin/departments">
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Departments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Departments Overview */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDepartments.slice(0, 5).map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{dept.name}</span>
                    <span className="font-medium text-foreground">{dept.employeeCount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Open Positions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{companyStats.openPositions}</p>
                <p className="text-sm text-muted-foreground mt-1">Active job postings</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/company-admin/recruitment">View Recruitment</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
