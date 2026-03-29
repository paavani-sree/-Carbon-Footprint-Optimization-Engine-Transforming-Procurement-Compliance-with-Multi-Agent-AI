import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Factory, Fuel, Zap, Building2, Plane, Wheat, FlaskConical, HardHat, TrendingDown, Leaf, BarChart3 } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { EmissionsByCategoryChart } from '@/components/charts/EmissionsByCategoryChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const industriesData: Record<string, {
  name: string;
  icon: typeof Factory;
  color: string;
  emissions: number;
  target: number;
  change: number;
  projects: { name: string; location: string; emissions: number; status: string; reduction: number }[];
  initiatives: { title: string; impact: string; progress: number }[];
  description: string;
}> = {
  'energy-power': {
    name: 'Energy & Power',
    icon: Zap,
    color: 'text-amber-500',
    emissions: 14200,
    target: 12000,
    change: -6.3,
    description: 'The energy sector remains one of the largest contributors to global carbon emissions, with ongoing transitions to renewable sources driving significant reductions.',
    projects: [
      { name: 'Solar Farm Delta', location: 'Nevada, USA', emissions: 120, status: 'active', reduction: 34 },
      { name: 'Wind Corridor Alpha', location: 'Denmark', emissions: 85, status: 'active', reduction: 45 },
      { name: 'Grid Modernization', location: 'Texas, USA', emissions: 2400, status: 'active', reduction: 12 },
      { name: 'Coal Phase-out Plan', location: 'Germany', emissions: 5600, status: 'in_progress', reduction: 28 },
      { name: 'Hydrogen Fuel Pilot', location: 'Japan', emissions: 340, status: 'planned', reduction: 50 },
    ],
    initiatives: [
      { title: 'Transition to 50% renewables by 2026', impact: '-4,200 tCO2e', progress: 62 },
      { title: 'Smart grid efficiency upgrades', impact: '-1,800 tCO2e', progress: 45 },
      { title: 'Carbon capture integration', impact: '-2,500 tCO2e', progress: 20 },
    ],
  },
  'manufacturing': {
    name: 'Manufacturing',
    icon: Factory,
    color: 'text-orange-500',
    emissions: 9800,
    target: 8500,
    change: -8.1,
    description: 'Manufacturing operations contribute significantly through energy-intensive processes, material sourcing, and supply chain logistics.',
    projects: [
      { name: 'Green Steel Initiative', location: 'Sweden', emissions: 1800, status: 'active', reduction: 40 },
      { name: 'EV Battery Plant', location: 'Michigan, USA', emissions: 950, status: 'active', reduction: 22 },
      { name: 'Recycled Materials Hub', location: 'Netherlands', emissions: 420, status: 'active', reduction: 55 },
      { name: 'Zero-Waste Factory', location: 'South Korea', emissions: 680, status: 'in_progress', reduction: 35 },
    ],
    initiatives: [
      { title: 'Electrify heating processes', impact: '-2,100 tCO2e', progress: 38 },
      { title: 'Circular material sourcing', impact: '-1,400 tCO2e', progress: 55 },
      { title: 'Lean manufacturing optimization', impact: '-800 tCO2e', progress: 72 },
    ],
  },
  'oil-gas': {
    name: 'Oil & Gas',
    icon: Fuel,
    color: 'text-red-500',
    emissions: 12500,
    target: 10000,
    change: -4.7,
    description: 'Oil and gas operations face intense scrutiny for methane leaks, flaring, and downstream combustion emissions.',
    projects: [
      { name: 'Methane Leak Detection', location: 'Alberta, Canada', emissions: 3200, status: 'active', reduction: 18 },
      { name: 'Flare Gas Recovery', location: 'Nigeria', emissions: 2100, status: 'active', reduction: 25 },
      { name: 'CCS Pipeline Network', location: 'Norway', emissions: 4500, status: 'in_progress', reduction: 30 },
      { name: 'Green Hydrogen Blend', location: 'UAE', emissions: 800, status: 'planned', reduction: 60 },
    ],
    initiatives: [
      { title: 'Zero routine flaring by 2025', impact: '-3,000 tCO2e', progress: 48 },
      { title: 'Methane intensity reduction', impact: '-1,500 tCO2e', progress: 62 },
      { title: 'Renewable energy self-supply', impact: '-900 tCO2e', progress: 30 },
    ],
  },
  'construction': {
    name: 'Construction',
    icon: HardHat,
    color: 'text-yellow-600',
    emissions: 5600,
    target: 5000,
    change: -9.2,
    description: 'Construction emissions stem from cement production, steel use, heavy machinery, and embodied carbon in building materials.',
    projects: [
      { name: 'Low-Carbon Cement Trial', location: 'UK', emissions: 1200, status: 'active', reduction: 30 },
      { name: 'Timber High-Rise', location: 'Vancouver, Canada', emissions: 350, status: 'active', reduction: 65 },
      { name: 'Electric Equipment Fleet', location: 'California, USA', emissions: 780, status: 'in_progress', reduction: 40 },
    ],
    initiatives: [
      { title: 'Replace 30% cement with alternatives', impact: '-1,200 tCO2e', progress: 42 },
      { title: 'Electric heavy machinery adoption', impact: '-600 tCO2e', progress: 25 },
      { title: 'Modular prefab construction', impact: '-450 tCO2e', progress: 58 },
    ],
  },
  'aviation': {
    name: 'Aviation',
    icon: Plane,
    color: 'text-sky-500',
    emissions: 7300,
    target: 6000,
    change: -3.5,
    description: 'Aviation contributes to emissions through jet fuel combustion, airport operations, and supply chain activities.',
    projects: [
      { name: 'SAF Blending Program', location: 'Singapore', emissions: 2800, status: 'active', reduction: 20 },
      { name: 'Fleet Modernization', location: 'France', emissions: 1900, status: 'active', reduction: 15 },
      { name: 'Electric Ground Ops', location: 'Heathrow, UK', emissions: 450, status: 'active', reduction: 70 },
    ],
    initiatives: [
      { title: 'Sustainable aviation fuel to 10%', impact: '-1,800 tCO2e', progress: 35 },
      { title: 'Route optimization AI', impact: '-500 tCO2e', progress: 60 },
      { title: 'Airport carbon neutral program', impact: '-400 tCO2e', progress: 78 },
    ],
  },
  'agriculture': {
    name: 'Agriculture',
    icon: Wheat,
    color: 'text-green-600',
    emissions: 4100,
    target: 3500,
    change: -11.4,
    description: 'Agricultural emissions include methane from livestock, nitrous oxide from fertilizers, and land-use changes.',
    projects: [
      { name: 'Precision Farming Pilot', location: 'Iowa, USA', emissions: 650, status: 'active', reduction: 28 },
      { name: 'Methane Capture (Dairy)', location: 'New Zealand', emissions: 1100, status: 'active', reduction: 35 },
      { name: 'Regenerative Soil Program', location: 'Brazil', emissions: 800, status: 'active', reduction: 42 },
      { name: 'Vertical Farming Scale-up', location: 'Netherlands', emissions: 200, status: 'planned', reduction: 75 },
    ],
    initiatives: [
      { title: 'Reduce fertilizer use by 20%', impact: '-600 tCO2e', progress: 50 },
      { title: 'Livestock methane digesters', impact: '-900 tCO2e', progress: 40 },
      { title: 'Carbon sequestration in soil', impact: '-500 tCO2e', progress: 30 },
    ],
  },
  'chemicals': {
    name: 'Chemicals',
    icon: FlaskConical,
    color: 'text-purple-500',
    emissions: 6700,
    target: 5500,
    change: -5.9,
    description: 'Chemical manufacturing involves energy-intensive processes and feedstock emissions from petrochemical production.',
    projects: [
      { name: 'Green Ammonia Plant', location: 'Saudi Arabia', emissions: 2200, status: 'active', reduction: 32 },
      { name: 'Bio-based Plastics', location: 'Finland', emissions: 900, status: 'active', reduction: 48 },
      { name: 'Process Heat Electrification', location: 'Germany', emissions: 1500, status: 'in_progress', reduction: 25 },
    ],
    initiatives: [
      { title: 'Electrify steam crackers', impact: '-2,000 tCO2e', progress: 18 },
      { title: 'Switch to bio-based feedstocks', impact: '-1,200 tCO2e', progress: 42 },
      { title: 'Waste heat recovery systems', impact: '-700 tCO2e', progress: 65 },
    ],
  },
  'real-estate': {
    name: 'Real Estate',
    icon: Building2,
    color: 'text-teal-500',
    emissions: 3200,
    target: 2800,
    change: -7.8,
    description: 'Real estate emissions come from building operations, HVAC systems, lighting, and embodied carbon in construction materials.',
    projects: [
      { name: 'Net-Zero Office Tower', location: 'London, UK', emissions: 450, status: 'active', reduction: 55 },
      { name: 'Smart Building Retrofit', location: 'New York, USA', emissions: 680, status: 'active', reduction: 30 },
      { name: 'Green Campus Development', location: 'Singapore', emissions: 520, status: 'in_progress', reduction: 40 },
    ],
    initiatives: [
      { title: 'HVAC efficiency upgrades', impact: '-800 tCO2e', progress: 55 },
      { title: 'On-site solar installation', impact: '-500 tCO2e', progress: 70 },
      { title: 'Smart energy management systems', impact: '-350 tCO2e', progress: 48 },
    ],
  },
};

const statusBadge: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  planned: 'bg-muted text-muted-foreground border-border',
};

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? industriesData[slug] : null;

  if (!industry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium">Industry not found</p>
            <Link to="/">
              <Button className="mt-4" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = industry.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-dark">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Icon className={`h-7 w-7 ${industry.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{industry.name}</h1>
              <p className="mt-1 text-sidebar-foreground/70">{industry.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Total Emissions</p>
              <p className="text-3xl font-bold">{(industry.emissions / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground">tCO2e / year</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-3xl font-bold text-primary">{(industry.target / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground">tCO2e / year</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">YoY Change</p>
              <p className="text-3xl font-bold text-success">{industry.change}%</p>
              <p className="text-xs text-muted-foreground">reduction</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-3xl font-bold">{industry.projects.length}</p>
              <p className="text-xs text-muted-foreground">across regions</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <EmissionsTrendChart />
          <EmissionsByCategoryChart />
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Carbon Emission Projects
            </CardTitle>
            <CardDescription>Active and planned projects tracking emission reductions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Emissions (tCO2e)</TableHead>
                  <TableHead className="text-right">Reduction Target</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {industry.projects.map((project) => (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{project.location}</TableCell>
                    <TableCell className="text-right">{project.emissions.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-success font-medium">-{project.reduction}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[project.status]}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Improvement Initiatives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Reduction Initiatives
            </CardTitle>
            <CardDescription>Ongoing efforts to meet emission reduction targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {industry.initiatives.map((initiative) => (
              <div key={initiative.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{initiative.title}</p>
                  <span className="text-sm font-medium text-primary">{initiative.impact}</span>
                </div>
                <Progress value={initiative.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{initiative.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="pb-8 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Industries
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
