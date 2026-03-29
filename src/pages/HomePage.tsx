import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, ArrowRight, BarChart3, Zap, Shield, TrendingDown, Factory, Fuel, Building2, Plane, Wheat, FlaskConical, HardHat } from 'lucide-react';

const industries = [
  { name: 'Energy & Power', slug: 'energy-power', icon: Zap, emissions: 14200, target: 12000, change: -6.3, projects: 24, color: 'text-amber-500' },
  { name: 'Manufacturing', slug: 'manufacturing', icon: Factory, emissions: 9800, target: 8500, change: -8.1, projects: 18, color: 'text-orange-500' },
  { name: 'Oil & Gas', slug: 'oil-gas', icon: Fuel, emissions: 12500, target: 10000, change: -4.7, projects: 15, color: 'text-red-500' },
  { name: 'Construction', slug: 'construction', icon: HardHat, emissions: 5600, target: 5000, change: -9.2, projects: 12, color: 'text-yellow-600' },
  { name: 'Aviation', slug: 'aviation', icon: Plane, emissions: 7300, target: 6000, change: -3.5, projects: 9, color: 'text-sky-500' },
  { name: 'Agriculture', slug: 'agriculture', icon: Wheat, emissions: 4100, target: 3500, change: -11.4, projects: 21, color: 'text-green-600' },
  { name: 'Chemicals', slug: 'chemicals', icon: FlaskConical, emissions: 6700, target: 5500, change: -5.9, projects: 14, color: 'text-purple-500' },
  { name: 'Real Estate', slug: 'real-estate', icon: Building2, emissions: 3200, target: 2800, change: -7.8, projects: 16, color: 'text-teal-500' },
];

const features = [
  { icon: BarChart3, title: 'Operational Analysis', description: 'Submit your production, energy, and resource data for comprehensive analysis.' },
  { icon: Zap, title: 'AI Optimization', description: 'Get AI-powered recommendations for cost reduction and efficiency improvements.' },
  { icon: Shield, title: 'Compliance Tracking', description: 'Monitor environmental compliance and carbon emission targets.' },
  { icon: TrendingDown, title: 'Reports & Insights', description: 'Visual dashboards with downloadable PDF optimization reports.' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="gradient-dark absolute inset-0 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Industrial Operations
              <span className="block text-primary">Optimization Engine</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-sidebar-foreground/80 max-w-2xl mx-auto">
              Helping industries optimize operations, resources, and efficiency through AI-driven analysis.
              Submit your operational data and receive actionable recommendations for cost reduction, 
              energy efficiency, and production optimization.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to={user ? '/dashboard' : '/auth'}>
                <Button size="lg" className="gap-2 text-base px-8">
                  {user ? 'Go to Dashboard' : 'Industry Login / Register'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8 border-sidebar-foreground/20 text-sidebar-foreground/80 hover:text-white hover:border-white">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            A simple process to transform your operational data into actionable optimization strategies
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card key={f.title} className="group transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-2 text-xs font-bold text-primary">STEP {i + 1}</div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Carbon Emissions <span className="text-primary">by Industry</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real-time tracking of carbon footprint across major industrial sectors
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <Link key={industry.name} to={`/industry/${industry.slug}`}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                        <industry.icon className={`h-5 w-5 ${industry.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{industry.name}</h3>
                        <p className="text-xs text-muted-foreground">{industry.projects} active projects</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">{(industry.emissions / 1000).toFixed(1)}K</span>
                        <span className="text-xs font-medium text-success">{industry.change}% YoY</span>
                      </div>
                      <p className="text-xs text-muted-foreground">tonnes CO2e emitted this year</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Target progress</span>
                          <span className="font-medium">{Math.round((industry.target / industry.emissions) * 100)}%</span>
                        </div>
                        <Progress value={Math.round((industry.target / industry.emissions) * 100)} className="h-1.5" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                        <span>Target: {(industry.target / 1000).toFixed(1)}K tCO2e</span>
                        <span className="text-primary font-medium">View →</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to Optimize Your Operations?</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Join industries already using our platform to reduce costs, improve efficiency, and meet sustainability targets.
        </p>
        <Link to={user ? '/dashboard' : '/auth'}>
          <Button size="lg" className="mt-8 gap-2 text-base px-8">
            {user ? 'Go to Dashboard' : 'Get Started Now'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
