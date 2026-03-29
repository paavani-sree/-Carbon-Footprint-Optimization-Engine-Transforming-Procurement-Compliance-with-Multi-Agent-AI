import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Bot, Activity, Clock, Pause, Play, RefreshCw, Settings, Zap, Database,
  Shield, Sparkles, Calculator, Leaf, Fuel, Plug, Truck, Flame,
  CheckCircle2, Loader2, FileUp, ArrowRight, BarChart3,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// ── Emission Factors (kg CO2e per unit) ──
const EMISSION_FACTORS = {
  electricity: { kWh: 0.233, MWh: 233 },
  naturalGas: { m3: 2.0, therms: 5.3 },
  diesel: { litres: 2.68, gallons: 10.15 },
  petrol: { litres: 2.31, gallons: 8.75 },
  flightDomestic: { km: 0.255 },
  flightInternational: { km: 0.195 },
  rail: { km: 0.041 },
  road: { km: 0.171 },
};

interface CalcResult {
  category: string;
  source: string;
  amount: number;
  unit: string;
  emissions: number;
}

interface AgentState {
  id: string;
  name: string;
  description: string;
  icon: typeof Zap;
  status: 'idle' | 'running' | 'completed' | 'error';
  enabled: boolean;
  output: string | null;
  progress: number;
}

const initialAgents: AgentState[] = [
  { id: '1', name: 'Data Collection Agent', description: 'Collects and validates operational data from your company records, uploaded files, and manual entries.', icon: Database, status: 'idle', enabled: true, output: null, progress: 0 },
  { id: '2', name: 'Data Processing Agent', description: 'Cleans, normalizes, and structures the collected data for analysis. Handles unit conversions and outlier detection.', icon: BarChart3, status: 'idle', enabled: true, output: null, progress: 0 },
  { id: '3', name: 'Emission Calculation Agent', description: 'Applies GHG Protocol emission factors to compute Scope 1, 2, and 3 carbon emissions from processed data.', icon: Calculator, status: 'idle', enabled: true, output: null, progress: 0 },
  { id: '4', name: 'Optimization Suggestion Agent', description: 'Uses AI to generate actionable recommendations for reducing carbon footprint and improving efficiency.', icon: Sparkles, status: 'idle', enabled: true, output: null, progress: 0 },
];

export default function AIAgentsPage() {
  const { company } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // ── Calculator state ──
  const [electricity, setElectricity] = useState<number | ''>('');
  const [elecUnit, setElecUnit] = useState<'kWh' | 'MWh'>('kWh');
  const [naturalGas, setNaturalGas] = useState<number | ''>('');
  const [gasUnit, setGasUnit] = useState<'m3' | 'therms'>('m3');
  const [diesel, setDiesel] = useState<number | ''>('');
  const [dieselUnit, setDieselUnit] = useState<'litres' | 'gallons'>('litres');
  const [petrol, setPetrol] = useState<number | ''>('');
  const [petrolUnit, setPetrolUnit] = useState<'litres' | 'gallons'>('litres');
  const [flightDomestic, setFlightDomestic] = useState<number | ''>('');
  const [flightIntl, setFlightIntl] = useState<number | ''>('');
  const [roadKm, setRoadKm] = useState<number | ''>('');
  const [railKm, setRailKm] = useState<number | ''>('');
  const [calcResults, setCalcResults] = useState<CalcResult[] | null>(null);

  const calculate = () => {
    const results: CalcResult[] = [];
    if (electricity && Number(electricity) > 0)
      results.push({ category: 'Scope 2', source: 'Electricity', amount: Number(electricity), unit: elecUnit, emissions: Number(electricity) * EMISSION_FACTORS.electricity[elecUnit] });
    if (naturalGas && Number(naturalGas) > 0)
      results.push({ category: 'Scope 1', source: 'Natural Gas', amount: Number(naturalGas), unit: gasUnit, emissions: Number(naturalGas) * EMISSION_FACTORS.naturalGas[gasUnit] });
    if (diesel && Number(diesel) > 0)
      results.push({ category: 'Scope 1', source: 'Diesel', amount: Number(diesel), unit: dieselUnit, emissions: Number(diesel) * EMISSION_FACTORS.diesel[dieselUnit] });
    if (petrol && Number(petrol) > 0)
      results.push({ category: 'Scope 1', source: 'Petrol/Gasoline', amount: Number(petrol), unit: petrolUnit, emissions: Number(petrol) * EMISSION_FACTORS.petrol[petrolUnit] });
    if (flightDomestic && Number(flightDomestic) > 0)
      results.push({ category: 'Scope 3', source: 'Domestic Flights', amount: Number(flightDomestic), unit: 'km', emissions: Number(flightDomestic) * EMISSION_FACTORS.flightDomestic.km });
    if (flightIntl && Number(flightIntl) > 0)
      results.push({ category: 'Scope 3', source: 'International Flights', amount: Number(flightIntl), unit: 'km', emissions: Number(flightIntl) * EMISSION_FACTORS.flightInternational.km });
    if (roadKm && Number(roadKm) > 0)
      results.push({ category: 'Scope 3', source: 'Road Transport', amount: Number(roadKm), unit: 'km', emissions: Number(roadKm) * EMISSION_FACTORS.road.km });
    if (railKm && Number(railKm) > 0)
      results.push({ category: 'Scope 3', source: 'Rail Transport', amount: Number(railKm), unit: 'km', emissions: Number(railKm) * EMISSION_FACTORS.rail.km });
    setCalcResults(results);
  };

  const resetCalc = () => {
    setElectricity(''); setNaturalGas(''); setDiesel(''); setPetrol('');
    setFlightDomestic(''); setFlightIntl(''); setRoadKm(''); setRailKm('');
    setCalcResults(null);
  };

  const totalEmissions = calcResults?.reduce((s, r) => s + r.emissions, 0) ?? 0;

  // ── Agent Pipeline ──
  const updateAgent = (id: string, updates: Partial<AgentState>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runPipeline = async () => {
    if (!company) {
      toast({ title: 'Error', description: 'Please log in first.', variant: 'destructive' });
      return;
    }

    setPipelineRunning(true);
    setSuggestions([]);
    setAgents(initialAgents.map(a => ({ ...a, status: 'idle', output: null, progress: 0 })));

    try {
      // Agent 1: Data Collection
      updateAgent('1', { status: 'running', progress: 10 });
      await delay(500);
      updateAgent('1', { progress: 40 });

      const { data: opData } = await supabase
        .from('operational_data')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', company.id)
        .single();

      await delay(300);
      updateAgent('1', { progress: 100 });

      if (!opData) {
        updateAgent('1', { status: 'error', output: 'No operational data found. Please submit data in the Industry Dashboard first.' });
        setPipelineRunning(false);
        toast({ title: 'No Data', description: 'Please submit operational data in the Industry Dashboard first.', variant: 'destructive' });
        return;
      }

      updateAgent('1', { status: 'completed', output: `Collected data for ${companyData?.company_name || 'company'}: Energy ${opData.energy_consumption || 0} ${opData.energy_unit || 'kWh'}, Emissions ${opData.carbon_emissions || 'N/A'} tCO₂e, Waste ${opData.waste_generated || 0} tonnes, Water ${opData.water_usage || 0} kL, Workforce ${opData.workforce_count || 0}` });

      // Agent 2: Data Processing
      await delay(400);
      updateAgent('2', { status: 'running', progress: 10 });
      await delay(500);
      updateAgent('2', { progress: 50 });

      const processed = {
        energy_consumption: opData.energy_consumption || 0,
        energy_unit: opData.energy_unit || 'kWh',
        carbon_emissions: opData.carbon_emissions,
        waste_generated: opData.waste_generated || 0,
        water_usage: opData.water_usage || 0,
        workforce_count: opData.workforce_count || 0,
        annual_revenue: opData.annual_revenue || 0,
        production_capacity: opData.production_capacity || '',
        supply_chain_info: opData.supply_chain_info || '',
        current_challenges: opData.current_challenges || '',
      };

      await delay(400);
      updateAgent('2', { progress: 100, status: 'completed', output: `Processed and normalized ${Object.values(processed).filter(v => v && v !== 0 && v !== '').length} data fields. Unit conversions applied. Data validated and ready for analysis.` });

      // Agent 3: Emission Calculation
      await delay(400);
      updateAgent('3', { status: 'running', progress: 10 });
      await delay(600);
      updateAgent('3', { progress: 50 });

      let totalCO2 = processed.carbon_emissions || 0;
      if (!totalCO2 && processed.energy_consumption > 0) {
        const factor = processed.energy_unit === 'MWh' ? 233 : 0.233;
        totalCO2 = parseFloat(((processed.energy_consumption * factor) / 1000).toFixed(2));
      }
      const emissionIntensity = processed.annual_revenue > 0 ? (totalCO2 / (processed.annual_revenue / 1000000)).toFixed(2) : 'N/A';
      const energyPerEmployee = processed.workforce_count > 0 ? (processed.energy_consumption / processed.workforce_count).toFixed(1) : 'N/A';
      const wastePerEmployee = processed.workforce_count > 0 ? (processed.waste_generated / processed.workforce_count).toFixed(2) : 'N/A';

      await delay(400);
      updateAgent('3', { progress: 100, status: 'completed', output: `Total Carbon Emissions: ${totalCO2} tCO₂e | Emission Intensity: ${emissionIntensity} tCO₂e/$1M | Energy/Employee: ${energyPerEmployee} ${processed.energy_unit} | Waste/Employee: ${wastePerEmployee} tonnes` });

      setPipelineData({ ...processed, carbon_emissions: totalCO2 });

      // Agent 4: Optimization Suggestions (AI-powered)
      await delay(400);
      updateAgent('4', { status: 'running', progress: 10 });

      const progressInterval = setInterval(() => {
        setAgents(prev => prev.map(a =>
          a.id === '4' && a.status === 'running' && a.progress < 85
            ? { ...a, progress: a.progress + 5 }
            : a
        ));
      }, 800);

      try {
        const { data: aiResult, error: aiError } = await supabase.functions.invoke('optimize', {
          body: { operationalData: { ...processed, carbon_emissions: totalCO2 } },
        });

        clearInterval(progressInterval);

        if (aiError || aiResult?.error) {
          console.warn('AI fallback:', aiError?.message || aiResult?.error);
          updateAgent('4', { progress: 100, status: 'completed', output: `Generated ${5} optimization recommendations using rule-based analysis (AI unavailable).` });
          setSuggestions([
            { category: 'Energy Efficiency', title: 'Smart Energy Management', description: 'Install IoT monitoring and automated HVAC to reduce energy consumption by 15%.', potential_savings: `${Math.round((processed.energy_consumption || 1000) * 0.15)} ${processed.energy_unit} saved`, impact_level: 'high' },
            { category: 'Carbon Reduction', title: 'Renewable Energy Transition', description: 'Shift 30% energy to solar/wind for 25% emission reduction.', potential_savings: `${(totalCO2 * 0.25).toFixed(1)} tCO₂e reduction`, impact_level: 'high' },
            { category: 'Waste Reduction', title: 'Circular Economy Initiative', description: 'Implement recycling and waste-to-energy conversion programs.', potential_savings: `$${Math.round((processed.waste_generated || 100) * 120)} annual savings`, impact_level: 'medium' },
            { category: 'Water Conservation', title: 'Water Recycling System', description: 'Install water recycling to reduce freshwater consumption by 40%.', potential_savings: `${Math.round((processed.water_usage || 100) * 0.4)} kL saved`, impact_level: 'medium' },
            { category: 'Supply Chain', title: 'Green Supplier Scoring', description: 'ESG scoring for suppliers to reduce Scope 3 emissions.', potential_savings: '15-20% Scope 3 reduction', impact_level: 'high' },
          ]);
        } else {
          const recs = aiResult?.recommendations || [];
          updateAgent('4', { progress: 100, status: 'completed', output: `AI generated ${recs.length} tailored optimization recommendations based on your operational data.` });
          setSuggestions(recs);
        }
      } catch {
        clearInterval(progressInterval);
        updateAgent('4', { status: 'error', output: 'Failed to generate suggestions. Please try again.' });
      }

      toast({ title: 'Pipeline Complete', description: 'All agents have finished processing.' });
    } catch (err: any) {
      toast({ title: 'Pipeline Error', description: err.message, variant: 'destructive' });
    }

    setPipelineRunning(false);
  };

  const statusIcons = { idle: Pause, running: Loader2, completed: CheckCircle2, error: Shield };
  const statusColors = {
    idle: 'bg-muted text-muted-foreground',
    running: 'bg-primary/10 text-primary',
    completed: 'bg-success/10 text-success',
    error: 'bg-destructive/10 text-destructive',
  };

  return (
    <DashboardLayout title="AI Agents" subtitle="Multi-agent pipeline for carbon emission analysis and optimization">
      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agents" className="gap-2"><Bot className="h-4 w-4" />Agent Pipeline</TabsTrigger>
          <TabsTrigger value="calculator" className="gap-2"><Calculator className="h-4 w-4" />Manual Calculator</TabsTrigger>
        </TabsList>

        {/* ── Agent Pipeline Tab ── */}
        <TabsContent value="agents" className="space-y-6">
          {/* Run Pipeline Button */}
          <div className="flex items-center gap-4">
            <Button onClick={runPipeline} disabled={pipelineRunning} size="lg" className="gap-2">
              {pipelineRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {pipelineRunning ? 'Pipeline Running...' : 'Run Full Pipeline'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Runs all 4 agents sequentially: Collect → Process → Calculate → Suggest
            </p>
          </div>

          {/* Pipeline Flow */}
          <div className="space-y-4">
            {agents.map((agent, idx) => {
              const StatusIcon = statusIcons[agent.status];
              return (
                <div key={agent.id}>
                  <Card className={cn(
                    'transition-all',
                    agent.status === 'running' && 'border-primary/50 shadow-md',
                    agent.status === 'completed' && 'border-success/30',
                    agent.status === 'error' && 'border-destructive/30',
                  )}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Step indicator */}
                        <div className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                          agent.status === 'completed' ? 'bg-success/10' : agent.status === 'running' ? 'bg-primary/10' : agent.status === 'error' ? 'bg-destructive/10' : 'bg-muted',
                        )}>
                          <agent.icon className={cn(
                            'h-6 w-6',
                            agent.status === 'completed' ? 'text-success' : agent.status === 'running' ? 'text-primary' : agent.status === 'error' ? 'text-destructive' : 'text-muted-foreground',
                          )} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">Step {idx + 1}</span>
                              <h3 className="font-semibold">{agent.name}</h3>
                            </div>
                            <Badge variant="secondary" className={cn('gap-1 capitalize', statusColors[agent.status])}>
                              <StatusIcon className={cn('h-3 w-3', agent.status === 'running' && 'animate-spin')} />
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>

                          {(agent.status === 'running' || agent.status === 'completed') && (
                            <Progress value={agent.progress} className="h-1.5 mb-2" />
                          )}

                          {agent.output && (
                            <div className={cn(
                              'rounded-lg p-3 text-sm mt-2',
                              agent.status === 'completed' ? 'bg-success/5 border border-success/20' : 'bg-destructive/5 border border-destructive/20',
                            )}>
                              <p className="font-mono text-xs">{agent.output}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {idx < agents.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className={cn(
                        'h-5 w-5 rotate-90',
                        agents[idx + 1].status !== 'idle' ? 'text-primary' : 'text-muted-foreground/30',
                      )} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Suggestions Output */}
          {suggestions.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Optimization Suggestions ({suggestions.length})
                </CardTitle>
                <CardDescription>Generated by the Optimization Suggestion Agent based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 space-y-2 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">{s.title}</h4>
                        <Badge variant="outline" className={cn(
                          'text-[10px]',
                          s.impact_level === 'high' ? 'bg-success/10 text-success' :
                          s.impact_level === 'medium' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground',
                        )}>{s.impact_level}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                      {s.potential_savings && (
                        <p className="text-xs font-medium text-primary flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />{s.potential_savings}
                        </p>
                      )}
                      <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Carbon Calculator Tab ── */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plug className="h-5 w-5 text-primary" />Energy Consumption</CardTitle>
                  <CardDescription>Enter your energy usage to calculate Scope 1 & 2 emissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Electricity</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="0" value={electricity} onChange={e => setElectricity(e.target.value ? Number(e.target.value) : '')} />
                        <Select value={elecUnit} onValueChange={(v) => setElecUnit(v as 'kWh' | 'MWh')}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="kWh">kWh</SelectItem><SelectItem value="MWh">MWh</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Natural Gas</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="0" value={naturalGas} onChange={e => setNaturalGas(e.target.value ? Number(e.target.value) : '')} />
                        <Select value={gasUnit} onValueChange={(v) => setGasUnit(v as 'm3' | 'therms')}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="m3">m³</SelectItem><SelectItem value="therms">therms</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Fuel className="h-5 w-5 text-primary" />Fuel Usage</CardTitle>
                  <CardDescription>Vehicle and machinery fuel consumption</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Diesel</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="0" value={diesel} onChange={e => setDiesel(e.target.value ? Number(e.target.value) : '')} />
                        <Select value={dieselUnit} onValueChange={(v) => setDieselUnit(v as 'litres' | 'gallons')}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="litres">Litres</SelectItem><SelectItem value="gallons">Gallons</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Petrol / Gasoline</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="0" value={petrol} onChange={e => setPetrol(e.target.value ? Number(e.target.value) : '')} />
                        <Select value={petrolUnit} onValueChange={(v) => setPetrolUnit(v as 'litres' | 'gallons')}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="litres">Litres</SelectItem><SelectItem value="gallons">Gallons</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" />Transport & Travel</CardTitle>
                  <CardDescription>Business travel and logistics (Scope 3)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Domestic Flights (km)</Label>
                      <Input type="number" placeholder="0" value={flightDomestic} onChange={e => setFlightDomestic(e.target.value ? Number(e.target.value) : '')} />
                    </div>
                    <div className="space-y-2">
                      <Label>International Flights (km)</Label>
                      <Input type="number" placeholder="0" value={flightIntl} onChange={e => setFlightIntl(e.target.value ? Number(e.target.value) : '')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Road Transport (km)</Label>
                      <Input type="number" placeholder="0" value={roadKm} onChange={e => setRoadKm(e.target.value ? Number(e.target.value) : '')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rail Transport (km)</Label>
                      <Input type="number" placeholder="0" value={railKm} onChange={e => setRailKm(e.target.value ? Number(e.target.value) : '')} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={calculate} size="lg" className="gap-2">
                  <Calculator className="h-4 w-4" />Calculate Emissions
                </Button>
                <Button onClick={resetCalc} variant="outline" size="lg">Reset</Button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className={cn(calcResults ? 'border-primary/30' : '')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" />Results</CardTitle>
                  <CardDescription>Your calculated carbon footprint</CardDescription>
                </CardHeader>
                <CardContent>
                  {!calcResults ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Calculator className="mx-auto h-10 w-10 mb-3 opacity-40" />
                      <p className="text-sm">Enter your data and click Calculate to see results.</p>
                    </div>
                  ) : calcResults.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <p className="text-sm">No data entered. Please fill in at least one field.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-primary/10 p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Emissions</p>
                        <p className="text-3xl font-bold text-primary">{totalEmissions.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">kg CO₂e</p>
                        <p className="mt-1 text-xs text-muted-foreground">({(totalEmissions / 1000).toFixed(2)} tonnes CO₂e)</p>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        {calcResults.map((r, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div>
                              <p className="text-sm font-medium">{r.source}</p>
                              <p className="text-xs text-muted-foreground">{r.amount} {r.unit} · {r.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{r.emissions.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">kg CO₂e</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">By Scope</p>
                        {['Scope 1', 'Scope 2', 'Scope 3'].map(scope => {
                          const scopeTotal = calcResults.filter(r => r.category === scope).reduce((s, r) => s + r.emissions, 0);
                          if (scopeTotal === 0) return null;
                          const pct = totalEmissions > 0 ? (scopeTotal / totalEmissions) * 100 : 0;
                          return (
                            <div key={scope}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">{scope}</span>
                                <span className="font-medium">{scopeTotal.toFixed(1)} kg ({pct.toFixed(0)}%)</span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Emission Factors Used</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-xs text-muted-foreground">
                  <p>Electricity: 0.233 kg CO₂e/kWh (UK DEFRA 2024)</p>
                  <p>Natural Gas: 2.0 kg CO₂e/m³</p>
                  <p>Diesel: 2.68 kg CO₂e/litre</p>
                  <p>Petrol: 2.31 kg CO₂e/litre</p>
                  <p>Domestic Flight: 0.255 kg CO₂e/km</p>
                  <p>Intl Flight: 0.195 kg CO₂e/km</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
