export type UserRole = 'super_admin' | 'company_admin' | 'hr' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone?: string;
  address?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  employeeCount: number;
  createdAt: Date;
}

export interface Employee {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  designation: string;
  department: string;
  employeeId: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'on_leave';
  manager?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'personal' | 'unpaid' | 'wfh';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'wfh';
  workHours?: number;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  headId?: string;
  employeeCount: number;
}

export interface Designation {
  id: string;
  title: string;
  departmentId: string;
  companyId: string;
}
