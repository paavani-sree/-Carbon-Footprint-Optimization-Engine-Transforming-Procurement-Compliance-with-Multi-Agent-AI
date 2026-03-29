import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { procurementKPIs } from '@/lib/mock-data';
import { ShoppingCart, Leaf, TrendingUp, DollarSign } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { EmissionsByCategoryChart } from '@/components/charts/EmissionsByCategoryChart';
import { ProcurementsTable } from '@/components/tables/ProcurementsTable';
import { AIRecommendationsCard } from '@/components/cards/AIRecommendationsCard';

export default function ProcurementDashboard() {
  return (
    <DashboardLayout 
      title="Procurement Dashboard" 
      subtitle="Monitor procurement carbon impact and AI recommendations"
    >
      {/* KPI Cards */}
      <div className="dashboard-grid mb-6">
        <StatCard
          title="Total Procurements"
          value={procurementKPIs.totalProcurements.toLocaleString()}
          change={procurementKPIs.monthlyChange.procurements}
          icon={ShoppingCart}
          variant="default"
        />
        <StatCard
          title="Carbon Footprint"
          value={`${(procurementKPIs.carbonFootprint / 1000).toFixed(1)}t`}
          change={procurementKPIs.monthlyChange.carbonFootprint}
          icon={Leaf}
          variant="warning"
          suffix="CO2e"
        />
        <StatCard
          title="Low-Carbon Ratio"
          value={`${procurementKPIs.lowCarbonRatio}%`}
          change={procurementKPIs.monthlyChange.lowCarbonRatio}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Cost Savings"
          value={`$${(procurementKPIs.costSavings / 1000).toFixed(0)}K`}
          change={procurementKPIs.monthlyChange.costSavings}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <EmissionsTrendChart />
        <EmissionsByCategoryChart />
      </div>

      {/* Table and Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProcurementsTable />
        </div>
        <div>
          <AIRecommendationsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
