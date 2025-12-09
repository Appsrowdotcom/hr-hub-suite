import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  BarChart3, 
  Shield,
  Building2,
  Briefcase,
  MessageSquare,
  Wallet
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Centralized employee database with complete profiles, documents, and role assignments.',
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with check-in/out, late marks, and WFH tracking.',
  },
  {
    icon: Calendar,
    title: 'Leave Management',
    description: 'Streamlined leave requests, approvals, and balance tracking with policy customization.',
  },
  {
    icon: Wallet,
    title: 'Payroll Processing',
    description: 'Automated salary calculations, tax deductions, and payslip generation.',
  },
  {
    icon: Briefcase,
    title: 'Recruitment',
    description: 'End-to-end hiring workflow from job posting to onboarding new employees.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Comprehensive insights with customizable reports and visual dashboards.',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant',
    description: 'Isolated workspaces for each company with complete data security.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Granular permissions for Super Admin, Company Admin, HR, and Employees.',
  },
  {
    icon: FileText,
    title: 'Document Management',
    description: 'Secure storage and management of employee documents and contracts.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-sm font-medium uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to Manage HR
          </h2>
          <p className="text-muted-foreground text-lg">
            From employee onboarding to payroll processing, we've got you covered with 
            powerful tools designed for modern HR teams.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="elevated"
              className="group hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
