import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
  fallback?: string;
}

export function RoleGuard({ children, allowedRoles, fallback = '/dashboard' }: RoleGuardProps) {
  const { hasRole, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const allowed = allowedRoles.some(role => hasRole(role));
  if (!allowed) return <Navigate to={fallback} replace />;

  return <>{children}</>;
}
