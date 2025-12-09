import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Trusted by 800+ companies worldwide
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up text-balance">
            Simplify Your HR Operations with{' '}
            <span className="text-accent">Modern Tools</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-100 text-balance">
            All-in-one HR management platform for managing employees, attendance, 
            leaves, payroll, and more. Built for growing teams.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up animation-delay-200">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="#demo">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-slide-up animation-delay-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 md:mt-20 animate-slide-up animation-delay-400">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="text-xs text-muted-foreground ml-2">HRFlow Dashboard</span>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Employees', value: '1,234' },
                    { label: 'Present Today', value: '1,156' },
                    { label: 'On Leave', value: '45' },
                    { label: 'Open Positions', value: '12' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-xl p-4 shadow-card">
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-card rounded-xl p-4 shadow-card h-48">
                    <p className="text-sm font-medium text-foreground mb-4">Attendance Overview</p>
                    <div className="flex items-end gap-2 h-32">
                      {[65, 80, 75, 90, 85, 95, 88].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-accent/20 rounded-t-md relative overflow-hidden"
                          style={{ height: `${h}%` }}
                        >
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-md transition-all duration-500"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-card">
                    <p className="text-sm font-medium text-foreground mb-4">Quick Actions</p>
                    <div className="space-y-2">
                      {['Add Employee', 'Approve Leave', 'Run Payroll'].map((action, i) => (
                        <div key={i} className="p-2 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer">
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
