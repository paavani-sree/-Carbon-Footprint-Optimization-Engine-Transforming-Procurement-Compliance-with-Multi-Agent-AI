import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import IndustryDashboard from "./pages/IndustryDashboard";
import ReportsPage from "./pages/ReportsPage";
import AdminPanel from "./pages/AdminPanel";
import IndustryDetailPage from "./pages/IndustryDetailPage";
import SupplierDashboard from "./pages/dashboards/SupplierDashboard";
import SustainabilityDashboard from "./pages/dashboards/SustainabilityDashboard";
import ProcurementDashboard from "./pages/dashboards/ProcurementDashboard";
import CertificationsPage from "./pages/CertificationsPage";
import AIAgentsPage from "./pages/AIAgentsPage";
import MyEmissionsPage from "./pages/MyEmissionsPage";
import ImprovementsPage from "./pages/ImprovementsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/auth" element={<PublicOnly><AuthPage /></PublicOnly>} />
    <Route path="/industry/:slug" element={<IndustryDetailPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><IndustryDashboard /></ProtectedRoute>} />
    <Route path="/supplier" element={<ProtectedRoute><RoleGuard allowedRoles={['supplier', 'admin']}><SupplierDashboard /></RoleGuard></ProtectedRoute>} />
    <Route path="/sustainability" element={<ProtectedRoute><RoleGuard allowedRoles={['sustainability', 'admin']}><SustainabilityDashboard /></RoleGuard></ProtectedRoute>} />
    <Route path="/procurement" element={<ProtectedRoute><RoleGuard allowedRoles={['procurement', 'admin']}><ProcurementDashboard /></RoleGuard></ProtectedRoute>} />
    <Route path="/my-emissions" element={<ProtectedRoute><MyEmissionsPage /></ProtectedRoute>} />
    <Route path="/certifications" element={<ProtectedRoute><CertificationsPage /></ProtectedRoute>} />
    <Route path="/improvements" element={<ProtectedRoute><ImprovementsPage /></ProtectedRoute>} />
    <Route path="/ai-agents" element={<ProtectedRoute><AIAgentsPage /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute><RoleGuard allowedRoles={['admin']}><UsersPage /></RoleGuard></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRoles={['admin']}><AdminPanel /></RoleGuard></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
