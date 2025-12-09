import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Users,
  Briefcase,
  Home
} from 'lucide-react';
import { hrStats, mockLeaveRequests, mockAttendance, mockEmployees } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function HRDashboard() {
  const pendingLeaves = mockLeaveRequests.filter(l => l.status === 'pending');
  const todayAttendance = mockAttendance;

  return (
    <DashboardLayout 
      role="hr" 
      title="HR Dashboard"
      subtitle="Daily operations at a glance"
      userName="Jessica Brown"
      companyName="TechCorp Solutions"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Leave Requests"
          value={hrStats.pendingLeaveRequests}
          icon={Calendar}
          iconColor="text-warning"
        />
        <StatsCard
          title="Today's Attendance"
          value={hrStats.todayAttendance}
          change={`${hrStats.lateArrivals} late arrivals`}
          changeType="neutral"
          icon={Clock}
          iconColor="text-success"
        />
        <StatsCard
          title="WFH Today"
          value={hrStats.wfhToday}
          icon={Home}
          iconColor="text-accent"
        />
        <StatsCard
          title="Pending Documents"
          value={hrStats.pendingDocuments}
          icon={FileText}
          iconColor="text-destructive"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Requests to Process */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Leave Requests to Process
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/hr/leaves">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div 
                    key={leave.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-accent/10 text-accent">
                          {leave.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{leave.employeeName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            leave.type === 'annual' ? 'accent' : 
                            leave.type === 'sick' ? 'destructive' : 
                            leave.type === 'wfh' ? 'secondary' : 'muted'
                          }>
                            {leave.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </Button>
                      <Button variant="accent" size="icon">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Attendance</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/hr/attendance">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check In</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check Out</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.map((record) => {
                      const employee = mockEmployees.find(e => e.id === record.employeeId);
                      return (
                        <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {employee?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">{employee?.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{record.checkIn || '-'}</td>
                          <td className="py-3 px-4 text-muted-foreground">{record.checkOut || '-'}</td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              record.status === 'present' ? 'success' :
                              record.status === 'late' ? 'warning' :
                              record.status === 'wfh' ? 'accent' : 'destructive'
                            }>
                              {record.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{record.workHours?.toFixed(1) || '-'}h</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                <Link to="/hr/employees">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Employees
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/hr/recruitment">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Recruitment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/hr/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-foreground">{hrStats.upcomingReviews}</p>
                <p className="text-sm text-muted-foreground mt-1">Performance reviews this week</p>
              </div>
              <div className="space-y-3 mt-4">
                {mockEmployees.slice(0, 3).map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-accent/10 text-accent">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-muted-foreground">Present</span>
                  </div>
                  <span className="font-semibold text-foreground">{hrStats.todayAttendance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Late</span>
                  </div>
                  <span className="font-semibold text-foreground">{hrStats.lateArrivals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-muted-foreground">WFH</span>
                  </div>
                  <span className="font-semibold text-foreground">{hrStats.wfhToday}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
