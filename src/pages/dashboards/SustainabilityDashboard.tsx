import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { sustainabilityKPIs } from '@/lib/mock-data';
import { Leaf, Shield, AlertTriangle, Users } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { SupplierComparisonChart } from '@/components/charts/SupplierComparisonChart';
import { ViolationsCard } from '@/components/cards/ViolationsCard';
import { AIRecommendationsCard } from '@/components/cards/AIRecommendationsCard';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export default function SustainabilityDashboard() {
  return (
    <DashboardLayout 
      title="Sustainability Dashboard" 
      subtitle="Emission analytics, compliance status, and ESG insights"
    >
      {/* Header Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div />
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid mb-6">
        <StatCard
          title="Total Emissions"
          value={`${sustainabilityKPIs.totalEmissions.toLocaleString()}t`}
          change={sustainabilityKPIs.monthlyChange.emissions}
          icon={Leaf}
          variant="success"
          suffix="CO2e"
        />
        <StatCard
          title="Compliance Score"
          value={`${sustainabilityKPIs.complianceScore}%`}
          change={sustainabilityKPIs.monthlyChange.compliance}
          icon={Shield}
          variant="success"
        />
        <StatCard
          title="Active Violations"
          value={sustainabilityKPIs.violations}
          change={sustainabilityKPIs.monthlyChange.violations}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Suppliers Compliant"
          value={`${sustainabilityKPIs.suppliersCompliant}%`}
          change={sustainabilityKPIs.monthlyChange.suppliers}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <EmissionsTrendChart />
        <SupplierComparisonChart />
      </div>

      {/* Violations and AI */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViolationsCard />
        <AIRecommendationsCard />
      </div>
    </DashboardLayout>
  );
}
