import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { mockLeaveRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface LeavesPageProps {
  role: 'company_admin' | 'hr';
}

export default function LeavesPage({ role }: LeavesPageProps) {
  const [leaves, setLeaves] = useState(mockLeaveRequests);
  const { toast } = useToast();

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');

  const handleApprove = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'approved' as const } : l));
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved.",
    });
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'rejected' as const } : l));
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected.",
    });
  };

  const LeaveCard = ({ leave }: { leave: typeof mockLeaveRequests[0] }) => (
    <Card variant="bordered" className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div className={`w-1.5 ${
            leave.status === 'pending' ? 'bg-warning' :
            leave.status === 'approved' ? 'bg-success' : 'bg-destructive'
          }`} />
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
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
                      leave.type === 'wfh' ? 'secondary' : 
                      leave.type === 'personal' ? 'warning' : 'muted'
                    }>
                      {leave.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{leave.days} day(s)</span>
                  </div>
                </div>
              </div>
              <Badge variant={
                leave.status === 'pending' ? 'warning' :
                leave.status === 'approved' ? 'success' : 'destructive'
              }>
                {leave.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{leave.reason}</p>
              <p className="text-xs text-muted-foreground">
                Applied: {new Date(leave.appliedAt).toLocaleDateString()}
              </p>
            </div>

            {leave.status === 'pending' && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReject(leave.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => handleApprove(leave.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout 
      role={role} 
      title="Leave Management"
      subtitle="Manage employee leave requests"
      userName={role === 'company_admin' ? 'Michael Chen' : 'Jessica Brown'}
      companyName="TechCorp Solutions"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated" className="border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-foreground mt-1">{pendingLeaves.length}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-l-4 border-l-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-foreground mt-1">{approvedLeaves.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated" className="border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold text-foreground mt-1">{rejectedLeaves.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              {pendingLeaves.length > 0 && (
                <Badge variant="warning" className="ml-1">{pendingLeaves.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value="pending" className="space-y-4">
          {pendingLeaves.length > 0 ? (
            pendingLeaves.map(leave => <LeaveCard key={leave.id} leave={leave} />)
          ) : (
            <Card variant="bordered" className="py-12">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
                <p className="text-muted-foreground">No pending leave requests</p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedLeaves.map(leave => <LeaveCard key={leave.id} leave={leave} />)}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedLeaves.map(leave => <LeaveCard key={leave.id} leave={leave} />)}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {leaves.map(leave => <LeaveCard key={leave.id} leave={leave} />)}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
