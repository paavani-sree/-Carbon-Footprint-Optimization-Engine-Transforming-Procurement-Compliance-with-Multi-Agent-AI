import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Leaf, Zap, Truck, Recycle, Droplets, Wind, ArrowRight, TrendingDown, CheckCircle2, Clock, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Improvement {
  id: string;
  title: string;
  description: string;
  icon: typeof Zap;
  impact: string;
  potential: string;
  savings: string;
  progress: number;
  status: string;
  steps: { label: string; done: boolean }[];
  details: string;
  timeline: string;
  kpis: { label: string; value: string }[];
}

const improvements: Improvement[] = [
  {
    id: 'IMP-001', title: 'Switch to Renewable Energy',
    description: 'Transition manufacturing plant to 100% renewable energy sources including solar and wind.',
    icon: Zap, impact: 'High', potential: '-25% emissions', savings: '$45,000/yr', progress: 45, status: 'in_progress',
    steps: [
      { label: 'Energy audit completed', done: true },
      { label: 'Solar panel vendor selected', done: true },
      { label: 'Installation scheduled Q2', done: false },
      { label: 'Grid connection setup', done: false },
    ],
    details: 'This initiative targets a complete transition to renewable energy for Plant A. Phase 1 covers rooftop solar (200kW), Phase 2 adds wind power purchase agreements.',
    timeline: 'Q1 2024 – Q4 2024',
    kpis: [{ label: 'CO2 Saved', value: '125 tCO2e' }, { label: 'Energy Cost Reduction', value: '30%' }, { label: 'ROI Period', value: '3.2 years' }],
  },
  {
    id: 'IMP-002', title: 'Optimize Logistics Routes',
    description: 'Use AI-powered route optimization to reduce transport distances and fuel consumption.',
    icon: Truck, impact: 'Medium', potential: '-12% transport CO2', savings: '$22,000/yr', progress: 70, status: 'in_progress',
    steps: [
      { label: 'Route analysis done', done: true },
      { label: 'New routes implemented', done: true },
      { label: 'Driver training completed', done: true },
      { label: 'Monitoring ongoing', done: false },
    ],
    details: 'AI-based logistics optimization covering 45 delivery routes. Consolidated 12 underperforming routes and reduced average trip distance by 18%.',
    timeline: 'Q4 2023 – Q2 2024',
    kpis: [{ label: 'Fuel Saved', value: '8,500 L/yr' }, { label: 'Routes Optimized', value: '45' }, { label: 'Delivery Time', value: '-15%' }],
  },
  {
    id: 'IMP-003', title: 'Implement Waste Reduction Program',
    description: 'Reduce material waste through circular economy principles and recycling programs.',
    icon: Recycle, impact: 'Medium', potential: '-8% material waste', savings: '$18,500/yr', progress: 30, status: 'in_progress',
    steps: [
      { label: 'Waste audit completed', done: true },
      { label: 'Recycling partnerships pending', done: false },
      { label: 'Staff training', done: false },
    ],
    details: 'Comprehensive waste audit identified 3 key waste streams. Partnering with local recycling firms and implementing on-site sorting stations.',
    timeline: 'Q1 2024 – Q3 2024',
    kpis: [{ label: 'Waste Diverted', value: '40 tonnes' }, { label: 'Landfill Reduction', value: '35%' }, { label: 'Revenue from Recycling', value: '$4,200' }],
  },
  {
    id: 'IMP-004', title: 'Water Conservation Initiative',
    description: 'Install water recycling systems and reduce freshwater consumption in manufacturing.',
    icon: Droplets, impact: 'Low', potential: '-15% water usage', savings: '$8,000/yr', progress: 0, status: 'planned',
    steps: [{ label: 'Assessment needed', done: false }],
    details: 'Proposed installation of closed-loop water recycling for cooling and rinsing processes. Expected to reduce municipal water intake by 15%.',
    timeline: 'Q3 2024 – Q1 2025',
    kpis: [{ label: 'Water Saved', value: '1,500 kL/yr' }, { label: 'Cost Saving', value: '$8,000/yr' }, { label: 'Payback', value: '2.5 years' }],
  },
  {
    id: 'IMP-005', title: 'Carbon Offset Program',
    description: 'Invest in verified carbon offset projects to compensate for unavoidable emissions.',
    icon: Wind, impact: 'High', potential: '-50t CO2e offset', savings: 'Net neutral', progress: 10, status: 'planned',
    steps: [
      { label: 'Research offset providers', done: true },
      { label: 'Budget approval pending', done: false },
    ],
    details: 'Evaluating Gold Standard and Verra-verified offset projects. Focus on reforestation and clean cookstove projects in developing regions.',
    timeline: 'Q2 2024 – Ongoing',
    kpis: [{ label: 'Offsets Purchased', value: '10 tCO2e' }, { label: 'Target', value: '50 tCO2e' }, { label: 'Budget Allocated', value: '$12,500' }],
  },
];

const impactColors: Record<string, string> = {
  High: 'bg-success/10 text-success border-success/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Low: 'bg-muted text-muted-foreground border-border',
};

export default function ImprovementsPage() {
  const [selected, setSelected] = useState<Improvement | null>(null);
  const totalActive = improvements.filter(i => i.status === 'in_progress');
  const avgProgress = Math.round(totalActive.reduce((sum, i) => sum + i.progress, 0) / (totalActive.length || 1));

  return (
    <DashboardLayout
      title="Improvement Suggestions"
      subtitle="AI-powered recommendations to reduce your carbon footprint and improve sustainability"
    >
      {/* Overview Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Initiatives</p>
              <p className="text-2xl font-bold">{totalActive.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <TrendingDown className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
              <p className="text-2xl font-bold">{avgProgress}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Annual Savings</p>
              <p className="text-2xl font-bold">$93.5K</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvements List */}
      <div className="space-y-4">
        {improvements.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex flex-1 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="outline" className={impactColors[item.impact]}>
                          {item.impact} Impact
                        </Badge>
                        {item.status === 'planned' && <Badge variant="outline">Planned</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex flex-wrap gap-4 pt-1 text-sm">
                        <span className="font-medium text-primary">{item.potential}</span>
                        <span className="text-muted-foreground">Est. savings: {item.savings}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 lg:w-48">
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelected(item)}>
                      {item.status === 'planned' ? 'Start' : 'View Details'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (() => {
            const Icon = selected.icon;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle>{selected.title}</DialogTitle>
                      <DialogDescription>{selected.potential} · {selected.savings}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={impactColors[selected.impact]}>{selected.impact} Impact</Badge>
                    <Badge variant="secondary">{selected.status === 'planned' ? 'Planned' : 'In Progress'}</Badge>
                    <Badge variant="secondary">Timeline: {selected.timeline}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{selected.details}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">{selected.progress}%</span>
                    </div>
                    <Progress value={selected.progress} className="h-2" />
                  </div>

                  <Separator />

                  {/* KPIs */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Key Metrics</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selected.kpis.map((kpi, i) => (
                        <div key={i} className="rounded-lg bg-muted/50 p-3 text-center">
                          <p className="text-xs text-muted-foreground">{kpi.label}</p>
                          <p className="text-sm font-semibold">{kpi.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Steps Checklist */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Action Steps</h4>
                    <ul className="space-y-2">
                      {selected.steps.map((step, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          {step.done ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>{step.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
