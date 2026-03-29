import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { EmissionsByCategoryChart } from '@/components/charts/EmissionsByCategoryChart';
import { FileText, Download, BarChart3, Lightbulb, TrendingDown } from 'lucide-react';

interface OptimizationResult {
  id: string;
  category: string;
  title: string;
  description: string;
  potential_savings: string | null;
  impact_level: string | null;
}

export default function ReportsPage() {
  const { company } = useAuth();
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([]);

  useEffect(() => {
    if (!company) return;
    supabase
      .from('optimization_results')
      .select('*')
      .eq('company_id', company.id)
      .then(({ data }) => {
        if (data) setOptimizations(data as OptimizationResult[]);
      });
  }, [company]);

  const handleDownloadPDF = () => {
    // Generate a simple text report for download
    const reportContent = [
      `OPTIMIZATION REPORT - ${company?.company_name}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `Industry: ${company?.industry_type}`,
      '',
      '=== OPTIMIZATION RECOMMENDATIONS ===',
      '',
      ...optimizations.map((o, i) => [
        `${i + 1}. ${o.title} [${o.impact_level} impact]`,
        `   Category: ${o.category}`,
        `   ${o.description}`,
        `   Potential: ${o.potential_savings || 'N/A'}`,
        '',
      ].join('\n')),
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimization-report-${company?.company_name?.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highImpact = optimizations.filter(o => o.impact_level === 'high').length;
  const categories = [...new Set(optimizations.map(o => o.category))];

  return (
    <DashboardLayout title="Reports & Insights" subtitle="Visual analytics and downloadable optimization reports">
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Lightbulb className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Suggestions</p><p className="text-2xl font-bold">{optimizations.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10"><TrendingDown className="h-6 w-6 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">High Impact</p><p className="text-2xl font-bold text-success">{highImpact}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10"><BarChart3 className="h-6 w-6 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Categories</p><p className="text-2xl font-bold">{categories.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><FileText className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Reports</p><p className="text-2xl font-bold">1</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Download */}
      <div className="mb-6">
        <Button onClick={handleDownloadPDF} size="lg" className="gap-2" disabled={optimizations.length === 0}>
          <Download className="h-4 w-4" />
          Download Optimization Report
        </Button>
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <EmissionsTrendChart />
        <EmissionsByCategoryChart />
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations Summary</CardTitle>
          <CardDescription>All optimization suggestions organized by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Submit operational data first to generate reports.</p>
          ) : (
            <div className="space-y-6">
              {categories.map(cat => (
                <div key={cat}>
                  <h3 className="mb-3 font-semibold text-primary">{cat}</h3>
                  <div className="space-y-2">
                    {optimizations.filter(o => o.category === cat).map(o => (
                      <div key={o.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="font-medium text-sm">{o.title}</p>
                          <p className="text-xs text-muted-foreground">{o.potential_savings}</p>
                        </div>
                        <Badge variant="outline" className={o.impact_level === 'high' ? 'border-success/20 text-success' : 'border-warning/20 text-warning'}>
                          {o.impact_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
