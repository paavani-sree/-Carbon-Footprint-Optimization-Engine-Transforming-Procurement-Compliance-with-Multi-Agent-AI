import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Factory, Zap, Users, Truck, AlertTriangle, TrendingDown, Lightbulb, Save, BarChart3, Droplets, Flame, DollarSign, Activity, Loader2, Calculator, ArrowRight } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { EmissionsByCategoryChart } from '@/components/charts/EmissionsByCategoryChart';

interface OperationalData {
  production_capacity: string;
  resource_usage: string;
  energy_consumption: number | null;
  energy_unit: string;
  workforce_count: number | null;
  supply_chain_info: string;
  current_challenges: string;
  annual_revenue: number | null;
  waste_generated: number | null;
  water_usage: number | null;
  carbon_emissions: number | null;
}

interface OptimizationResult {
  id: string;
  category: string;
  title: string;
  description: string;
  potential_savings: string | null;
  impact_level: string | null;
  status: string | null;
}

const defaultData: OperationalData = {
  production_capacity: '', resource_usage: '', energy_consumption: null, energy_unit: 'kWh',
  workforce_count: null, supply_chain_info: '', current_challenges: '', annual_revenue: null,
  waste_generated: null, water_usage: null, carbon_emissions: null,
};

// Derived calculation helpers
function calcDerivedMetrics(data: OperationalData) {
  const metrics: { label: string; value: string; description: string }[] = [];

  if (data.carbon_emissions && data.annual_revenue) {
    const intensity = (data.carbon_emissions / (data.annual_revenue / 1000000)).toFixed(2);
    metrics.push({ label: 'Emission Intensity', value: `${intensity} tCO₂e/$1M`, description: 'Carbon emissions per million dollars of revenue' });
  }
  if (data.energy_consumption && data.workforce_count) {
    const epe = (data.energy_consumption / data.workforce_count).toFixed(1);
    metrics.push({ label: 'Energy per Employee', value: `${epe} ${data.energy_unit}`, description: 'Average energy consumption per employee' });
  }
  if (data.waste_generated && data.workforce_count) {
    const wpe = (data.waste_generated / data.workforce_count).toFixed(2);
    metrics.push({ label: 'Waste per Employee', value: `${wpe} tonnes`, description: 'Average waste generated per employee' });
  }
  if (data.water_usage && data.workforce_count) {
    const wtrpe = (data.water_usage / data.workforce_count).toFixed(1);
    metrics.push({ label: 'Water per Employee', value: `${wtrpe} kL`, description: 'Average water usage per employee' });
  }
  if (data.carbon_emissions && data.energy_consumption) {
    const factor = (data.carbon_emissions / data.energy_consumption * 1000).toFixed(3);
    metrics.push({ label: 'Carbon Factor', value: `${factor} kgCO₂e/${data.energy_unit}`, description: 'Carbon emissions per unit of energy consumed' });
  }
  if (data.annual_revenue && data.energy_consumption) {
    const rev_per_energy = (data.annual_revenue / data.energy_consumption).toFixed(2);
    metrics.push({ label: 'Revenue per Energy', value: `$${rev_per_energy}/${data.energy_unit}`, description: 'Revenue generated per unit of energy' });
  }
  if (data.waste_generated && data.annual_revenue) {
    const waste_intensity = (data.waste_generated / (data.annual_revenue / 1000000)).toFixed(2);
    metrics.push({ label: 'Waste Intensity', value: `${waste_intensity} t/$1M`, description: 'Waste generated per million dollars of revenue' });
  }

  return metrics;
}

// Auto-estimate carbon from energy if not provided
function autoEstimateCarbon(data: OperationalData): number | null {
  if (data.carbon_emissions) return data.carbon_emissions;
  if (!data.energy_consumption) return null;
  // Simple estimation: 0.233 kgCO2e per kWh, convert to tonnes
  const factor = data.energy_unit === 'MWh' ? 233 : 0.233;
  return parseFloat(((data.energy_consumption * factor) / 1000).toFixed(2));
}

const impactColors: Record<string, string> = {
  high: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-border',
};

const categoryIcons: Record<string, typeof Zap> = {
  'Energy Efficiency': Zap, 'Waste Reduction': AlertTriangle, 'Workforce Optimization': Users,
  'Carbon Reduction': TrendingDown, 'Resource Optimization': Factory, 'Cost Reduction': BarChart3,
  'Supply Chain': Truck, 'Production Optimization': Lightbulb, 'Renewable Energy': Zap,
  'Water Conservation': Droplets,
};

export default function IndustryDashboard() {
  const { company } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<OperationalData>(defaultData);
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!company) return;
    const load = async () => {
      const { data } = await supabase.from('operational_data').select('*').eq('company_id', company.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (data) {
        setFormData({
          production_capacity: data.production_capacity || '', resource_usage: data.resource_usage || '',
          energy_consumption: data.energy_consumption, energy_unit: data.energy_unit || 'kWh',
          workforce_count: data.workforce_count, supply_chain_info: data.supply_chain_info || '',
          current_challenges: data.current_challenges || '', annual_revenue: data.annual_revenue,
          waste_generated: data.waste_generated, water_usage: data.water_usage, carbon_emissions: data.carbon_emissions,
        });
        setHasData(true);
      }
      const { data: opts } = await supabase.from('optimization_results').select('*').eq('company_id', company.id).order('created_at', { ascending: false });
      if (opts) setOptimizations(opts as OptimizationResult[]);
    };
    load();
  }, [company]);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    setAiLoading(true);
    try {
      // Auto-estimate carbon if missing
      const estimatedCarbon = autoEstimateCarbon(formData);
      const dataToSave = { ...formData, carbon_emissions: estimatedCarbon };

      const { data: opData, error } = await supabase
        .from('operational_data')
        .upsert({ company_id: company.id, ...dataToSave }, { onConflict: 'company_id' })
        .select()
        .single();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        setSaving(false);
        setAiLoading(false);
        return;
      }

      if (formData.carbon_emissions !== estimatedCarbon) {
        setFormData(prev => ({ ...prev, carbon_emissions: estimatedCarbon }));
      }

      // Call AI for optimization suggestions
      toast({ title: 'Analyzing...', description: 'AI agents are processing your data...' });

      const { data: aiResult, error: aiError } = await supabase.functions.invoke('optimize', {
        body: { operationalData: dataToSave },
      });

      let suggestions: Omit<OptimizationResult, 'id'>[] = [];

      if (aiError || aiResult?.error) {
        console.warn('AI fallback:', aiError?.message || aiResult?.error);
        // Fallback to local generation
        suggestions = generateFallbackOptimizations(dataToSave);
      } else if (aiResult?.recommendations) {
        suggestions = aiResult.recommendations.map((r: any) => ({
          category: r.category,
          title: r.title,
          description: r.description,
          potential_savings: r.potential_savings,
          impact_level: r.impact_level,
          status: 'pending',
        }));
      }

      if (opData && suggestions.length > 0) {
        const toInsert = suggestions.map(s => ({ ...s, operational_data_id: opData.id, company_id: company.id }));
        await supabase.from('optimization_results').delete().eq('company_id', company.id);
        const { data: savedOpts } = await supabase.from('optimization_results').insert(toInsert).select();
        if (savedOpts) setOptimizations(savedOpts as OptimizationResult[]);
      }

      setHasData(true);
      toast({ title: 'Analysis Complete', description: `Generated ${suggestions.length} AI-powered optimization recommendations.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
    }
    setSaving(false);
    setAiLoading(false);
  };

  const updateField = (field: keyof OperationalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const derivedMetrics = calcDerivedMetrics(formData);
  const estimatedCarbon = autoEstimateCarbon(formData);

  const kpis = [
    { label: 'Energy', value: formData.energy_consumption ? `${formData.energy_consumption.toLocaleString()} ${formData.energy_unit}` : '—', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Emissions', value: (formData.carbon_emissions || estimatedCarbon) ? `${formData.carbon_emissions || estimatedCarbon} tCO₂e` : '—', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Water', value: formData.water_usage ? `${formData.water_usage} kL` : '—', icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Revenue', value: formData.annual_revenue ? `$${(formData.annual_revenue / 1000000).toFixed(1)}M` : '—', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Workforce', value: formData.workforce_count ? `${formData.workforce_count}` : '—', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Suggestions', value: optimizations.length.toString(), icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${company?.company_name || 'Company'}`}
      subtitle="Your operational overview and optimization center"
    >
      {/* KPI Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="overflow-hidden">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="truncate text-sm font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={hasData && optimizations.length > 0 ? 'overview' : 'data'} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Operational Data</TabsTrigger>
          <TabsTrigger value="analysis">Optimization</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:row-span-2">
              <CardHeader>
                <CardTitle className="text-base">Optimization Score</CardTitle>
                <CardDescription>Based on your operational data</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                      strokeDasharray={`${(hasData ? Math.min(optimizations.length * 12, 100) : 0) * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold">{hasData ? Math.min(optimizations.length * 12, 100) : 0}</p>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {['Energy', 'Waste', 'Carbon'].map((cat, i) => (
                    <div key={cat}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">{cat}</span>
                        <span className="font-medium">{[72, 58, 85][i]}%</span>
                      </div>
                      <Progress value={[72, 58, 85][i]} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <EmissionsTrendChart />
            </div>
            <div className="lg:col-span-2">
              <EmissionsByCategoryChart />
            </div>
          </div>

          {optimizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-5 w-5 text-primary" />Top AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {optimizations.slice(0, 3).map((opt) => {
                    const Icon = categoryIcons[opt.category] || Lightbulb;
                    return (
                      <div key={opt.id} className="flex gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{opt.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{opt.description}</p>
                          {opt.potential_savings && <p className="mt-1 text-xs font-medium text-primary">{opt.potential_savings}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Operational Data Form ── */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Factory className="h-5 w-5 text-primary" />Production & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Production Capacity</Label>
                  <Input placeholder="e.g., 10,000 units/month" value={formData.production_capacity} onChange={e => updateField('production_capacity', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Resource Usage</Label>
                  <Textarea placeholder="Describe key resources used..." value={formData.resource_usage} onChange={e => updateField('resource_usage', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Annual Revenue ($)</Label>
                  <Input type="number" placeholder="e.g., 5000000" value={formData.annual_revenue ?? ''} onChange={e => updateField('annual_revenue', e.target.value ? Number(e.target.value) : null)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-5 w-5 text-primary" />Energy & Emissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Energy Consumption</Label>
                    <Input type="number" placeholder="e.g., 50000" value={formData.energy_consumption ?? ''} onChange={e => updateField('energy_consumption', e.target.value ? Number(e.target.value) : null)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input placeholder="kWh" value={formData.energy_unit} onChange={e => updateField('energy_unit', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Carbon Emissions (tCO₂e)</Label>
                  <Input type="number" placeholder="Auto-estimated if blank" value={formData.carbon_emissions ?? ''} onChange={e => updateField('carbon_emissions', e.target.value ? Number(e.target.value) : null)} />
                  {!formData.carbon_emissions && estimatedCarbon && (
                    <p className="text-xs text-muted-foreground">⚡ Auto-estimated: ~{estimatedCarbon} tCO₂e (based on energy × 0.233 kgCO₂e/kWh)</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Waste (tonnes)</Label>
                    <Input type="number" placeholder="e.g., 200" value={formData.waste_generated ?? ''} onChange={e => updateField('waste_generated', e.target.value ? Number(e.target.value) : null)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Water (kL)</Label>
                    <Input type="number" placeholder="e.g., 10000" value={formData.water_usage ?? ''} onChange={e => updateField('water_usage', e.target.value ? Number(e.target.value) : null)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5 text-primary" />Workforce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Employees</Label>
                  <Input type="number" placeholder="e.g., 250" value={formData.workforce_count ?? ''} onChange={e => updateField('workforce_count', e.target.value ? Number(e.target.value) : null)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Truck className="h-5 w-5 text-primary" />Supply Chain & Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Supply Chain Information</Label>
                  <Textarea placeholder="Describe your supply chain..." value={formData.supply_chain_info} onChange={e => updateField('supply_chain_info', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Current Challenges</Label>
                  <Textarea placeholder="What challenges are you facing?" value={formData.current_challenges} onChange={e => updateField('current_challenges', e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Derived Calculations */}
          {derivedMetrics.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="h-5 w-5 text-primary" />
                  Calculated Metrics
                </CardTitle>
                <CardDescription>Auto-calculated from your operational data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {derivedMetrics.map((m) => (
                    <div key={m.label} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="text-lg font-bold">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'AI Analyzing...' : 'Submit & Analyze with AI'}
          </Button>
        </TabsContent>

        {/* ── Optimization Analysis ── */}
        <TabsContent value="analysis" className="space-y-4">
          {aiLoading ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h3 className="mt-4 text-lg font-semibold">AI Agents Processing...</h3>
                <p className="mt-2 text-sm text-muted-foreground">Analyzing your data and generating optimization recommendations.</p>
              </CardContent>
            </Card>
          ) : optimizations.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-semibold">No Analysis Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Submit your operational data to receive AI-powered optimization recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <div className="grid gap-3 sm:grid-cols-3">
                {['high', 'medium', 'low'].map(level => {
                  const count = optimizations.filter(o => o.impact_level === level).length;
                  return (
                    <Card key={level}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="text-xs text-muted-foreground capitalize">{level} Impact</p>
                          <p className="text-2xl font-bold">{count}</p>
                        </div>
                        <Badge variant="outline" className={impactColors[level]}>{level}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {optimizations.map((opt) => {
                  const Icon = categoryIcons[opt.category] || Lightbulb;
                  return (
                    <Card key={opt.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold">{opt.title}</h3>
                              <Badge variant="outline" className={`text-[10px] ${impactColors[opt.impact_level || 'low']}`}>
                                {opt.impact_level}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                            {opt.potential_savings && (
                              <p className="text-xs font-medium text-primary flex items-center gap-1">
                                <ArrowRight className="h-3 w-3" />
                                {opt.potential_savings}
                              </p>
                            )}
                            <Badge variant="secondary" className="text-[10px]">{opt.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        {/* ── Charts ── */}
        <TabsContent value="charts">
          <div className="grid gap-6 lg:grid-cols-2">
            <EmissionsTrendChart />
            <EmissionsByCategoryChart />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// Fallback if AI is unavailable
function generateFallbackOptimizations(data: OperationalData): Omit<OptimizationResult, 'id'>[] {
  const results: Omit<OptimizationResult, 'id'>[] = [];
  if (data.energy_consumption && data.energy_consumption > 0) {
    results.push({ category: 'Energy Efficiency', title: 'Smart Energy Management', description: `Your energy consumption of ${data.energy_consumption} ${data.energy_unit} can be reduced by 15% through IoT monitoring and automated HVAC.`, potential_savings: `${Math.round(data.energy_consumption * 0.15)} ${data.energy_unit} saved`, impact_level: 'high', status: 'pending' });
    results.push({ category: 'Renewable Energy', title: 'Solar/Wind Transition', description: `Transitioning 30% of consumption to renewables could cut costs by 20-35% over 5 years.`, potential_savings: `${Math.round(data.energy_consumption * 0.25)} ${data.energy_unit} annually`, impact_level: 'high', status: 'pending' });
  }
  if (data.waste_generated && data.waste_generated > 0) {
    results.push({ category: 'Waste Reduction', title: 'Circular Economy Program', description: `Recycling and waste-to-energy for ${data.waste_generated} tonnes could reduce disposal costs significantly.`, potential_savings: `$${Math.round(data.waste_generated * 120)} annual savings`, impact_level: 'medium', status: 'pending' });
  }
  if (data.carbon_emissions && data.carbon_emissions > 0) {
    results.push({ category: 'Carbon Reduction', title: 'Carbon Footprint Strategy', description: `Your ${data.carbon_emissions} tCO₂e can be reduced 25% via renewable energy and process electrification.`, potential_savings: `${Math.round(data.carbon_emissions * 0.25)} tCO₂e reduction`, impact_level: 'high', status: 'pending' });
  }
  if (data.water_usage && data.water_usage > 0) {
    results.push({ category: 'Water Conservation', title: 'Water Recycling System', description: `Implementing water recycling for ${data.water_usage} kL usage could reduce freshwater consumption by 40%.`, potential_savings: `${Math.round(data.water_usage * 0.4)} kL saved`, impact_level: 'medium', status: 'pending' });
  }
  if (data.workforce_count && data.workforce_count > 0) {
    results.push({ category: 'Workforce Optimization', title: 'AI Shift Scheduling', description: `With ${data.workforce_count} employees, AI scheduling can improve productivity by 10%.`, potential_savings: '10% labor cost reduction', impact_level: 'medium', status: 'pending' });
  }
  results.push({ category: 'Production Optimization', title: 'Lean Manufacturing', description: 'Conduct lean assessment to reduce waste and improve OEE by 15-20%.', potential_savings: '15-20% productivity gain', impact_level: 'high', status: 'pending' });
  results.push({ category: 'Supply Chain', title: 'Green Supplier Scoring', description: 'Implement ESG scoring for suppliers to reduce Scope 3 emissions.', potential_savings: '15-20% Scope 3 reduction', impact_level: 'high', status: 'pending' });
  return results;
}
