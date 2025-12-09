import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CompanyAdminDashboard from "./pages/CompanyAdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeesPage from "./pages/EmployeesPage";
import LeavesPage from "./pages/LeavesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={<SuperAdminDashboard />} />

          {/* Company Admin Routes */}
          <Route path="/company-admin" element={<CompanyAdminDashboard />} />
          <Route path="/company-admin/employees" element={<EmployeesPage role="company_admin" />} />
          <Route path="/company-admin/leaves" element={<LeavesPage role="company_admin" />} />

          {/* HR Routes */}
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/hr/employees" element={<EmployeesPage role="hr" />} />
          <Route path="/hr/leaves" element={<LeavesPage role="hr" />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
