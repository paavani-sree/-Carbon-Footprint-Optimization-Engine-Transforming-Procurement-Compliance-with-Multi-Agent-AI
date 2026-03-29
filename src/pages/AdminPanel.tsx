import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Building2, Users, FileText, Lightbulb } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { SupplierComparisonChart } from '@/components/charts/SupplierComparisonChart';

interface CompanyRow {
  id: string;
  company_name: string;
  industry_type: string;
  email: string;
  location: string | null;
  created_at: string;
}

interface OptRow {
  id: string;
  company_id: string;
  category: string;
  title: string;
  description: string;
  potential_savings: string | null;
  impact_level: string | null;
  status: string | null;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [optimizations, setOptimizations] = useState<OptRow[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [c, o] = await Promise.all([
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('optimization_results').select('*').order('created_at', { ascending: false }),
      ]);
      if (c.data) setCompanies(c.data as CompanyRow[]);
      if (o.data) setOptimizations(o.data as OptRow[]);
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <DashboardLayout title="Admin Panel" subtitle="Access restricted">
        <Card><CardContent className="py-16 text-center text-muted-foreground">You do not have admin access.</CardContent></Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Panel" subtitle="Monitor all industry data and provide expert recommendations">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-5 text-center"><p className="text-sm text-muted-foreground">Total Companies</p><p className="text-3xl font-bold">{companies.length}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-sm text-muted-foreground">Optimizations Generated</p><p className="text-3xl font-bold text-primary">{optimizations.length}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-sm text-muted-foreground">Industries</p><p className="text-3xl font-bold">{new Set(companies.map(c => c.industry_type)).size}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-sm text-muted-foreground">High Impact</p><p className="text-3xl font-bold text-success">{optimizations.filter(o => o.impact_level === 'high').length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList><TabsTrigger value="companies">Companies</TabsTrigger><TabsTrigger value="recommendations">Recommendations</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>

        <TabsContent value="companies">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />Registered Companies</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead><TableHead>Industry</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.company_name}</TableCell>
                      <TableCell><Badge variant="secondary">{c.industry_type.replace('_', ' ')}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{c.email}</TableCell>
                      <TableCell>{c.location || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {companies.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No companies registered yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {optimizations.length === 0 ? (
              <Card><CardContent className="py-16 text-center text-muted-foreground">No optimization data yet.</CardContent></Card>
            ) : (
              optimizations.map(o => (
                <Card key={o.id}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium">{o.title}</span>
                        <Badge variant="outline">{o.category}</Badge>
                        {o.impact_level && <Badge variant="secondary">{o.impact_level}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{o.description}</p>
                      {o.potential_savings && <p className="text-sm text-primary mt-1">{o.potential_savings}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <EmissionsTrendChart />
            <SupplierComparisonChart />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
