-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'company_admin', 'hr', 'employee');

-- Create enum for leave status
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'wfh', 'on_duty');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  subscription_plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  employee_code TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  joining_date DATE,
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  address TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (company_id, email)
);

-- Create company_users table (maps users to companies with roles)
CREATE TABLE public.company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  role app_role NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, company_id)
);

-- Create leave_policies table
CREATE TABLE public.leave_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  days_allowed INTEGER NOT NULL DEFAULT 0,
  carry_forward BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  leave_policy_id UUID REFERENCES public.leave_policies(id) ON DELETE SET NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status leave_status DEFAULT 'pending' NOT NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status attendance_status DEFAULT 'present' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (employee_id, date)
);

-- Create holidays table
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_company_role(_user_id UUID, _company_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.company_users
  WHERE user_id = _user_id AND company_id = _company_id AND is_active = true
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_companies(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.company_users
  WHERE user_id = _user_id AND is_active = true
$$;

-- Profile policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User roles policies (only super admins can manage)
CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_super_admin(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Super admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_super_admin(auth.uid()));

-- Companies policies
CREATE POLICY "Super admins can view all companies"
  ON public.companies FOR SELECT
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their companies"
  ON public.companies FOR SELECT
  USING (id IN (SELECT public.get_user_companies(auth.uid())));

CREATE POLICY "Super admins can manage companies"
  ON public.companies FOR ALL
  USING (public.is_super_admin(auth.uid()));

-- Departments policies
CREATE POLICY "Users can view departments in their companies"
  ON public.departments FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Company admins can manage departments"
  ON public.departments FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) IN ('company_admin', 'hr')
  );

-- Employees policies
CREATE POLICY "Users can view employees in their companies"
  ON public.employees FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Company admins and HR can manage employees"
  ON public.employees FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) IN ('company_admin', 'hr')
  );

-- Company users policies
CREATE POLICY "Users can view company_users in their companies"
  ON public.company_users FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    user_id = auth.uid() OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Admins can manage company_users"
  ON public.company_users FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) = 'company_admin'
  );

-- Leave policies (company settings)
CREATE POLICY "Users can view leave policies in their companies"
  ON public.leave_policies FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Admins can manage leave policies"
  ON public.leave_policies FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) = 'company_admin'
  );

-- Leave requests policies
CREATE POLICY "Users can view leave requests in their companies"
  ON public.leave_requests FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Employees can create their own leave requests"
  ON public.leave_requests FOR INSERT
  WITH CHECK (
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "HR and admins can manage leave requests"
  ON public.leave_requests FOR UPDATE
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) IN ('company_admin', 'hr')
  );

-- Attendance policies
CREATE POLICY "Users can view attendance in their companies"
  ON public.attendance FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "HR and admins can manage attendance"
  ON public.attendance FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) IN ('company_admin', 'hr')
  );

-- Holidays policies
CREATE POLICY "Users can view holidays in their companies"
  ON public.holidays FOR SELECT
  USING (
    public.is_super_admin(auth.uid()) OR
    company_id IN (SELECT public.get_user_companies(auth.uid()))
  );

CREATE POLICY "Admins can manage holidays"
  ON public.holidays FOR ALL
  USING (
    public.is_super_admin(auth.uid()) OR
    public.get_user_company_role(auth.uid(), company_id) = 'company_admin'
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_policies_updated_at BEFORE UPDATE ON public.leave_policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();