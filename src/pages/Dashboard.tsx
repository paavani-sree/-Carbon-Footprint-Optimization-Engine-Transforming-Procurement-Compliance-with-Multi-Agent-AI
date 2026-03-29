import { useAuth } from '@/contexts/AuthContext';
import ProcurementDashboard from './dashboards/ProcurementDashboard';
import SustainabilityDashboard from './dashboards/SustainabilityDashboard';
import SupplierDashboard from './dashboards/SupplierDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'procurement':
      return <ProcurementDashboard />;
    case 'sustainability':
      return <SustainabilityDashboard />;
    case 'supplier':
      return <SupplierDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <ProcurementDashboard />;
  }
}
