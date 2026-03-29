import { useState, useRef, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { EmissionsByCategoryChart } from '@/components/charts/EmissionsByCategoryChart';
import { BarChart3, Upload, Download, TrendingDown, Factory, Truck, Package, FileText, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const emissionRecords = [
  { id: 'EM-001', source: 'Manufacturing Plant A', category: 'Scope 1', amount: 85.2, unit: 'tCO2e', period: 'Jan 2024', status: 'verified' },
  { id: 'EM-002', source: 'Fleet Transport', category: 'Scope 1', amount: 42.8, unit: 'tCO2e', period: 'Jan 2024', status: 'verified' },
  { id: 'EM-003', source: 'Electricity Usage', category: 'Scope 2', amount: 63.1, unit: 'tCO2e', period: 'Jan 2024', status: 'pending' },
  { id: 'EM-004', source: 'Supply Chain Logistics', category: 'Scope 3', amount: 28.4, unit: 'tCO2e', period: 'Jan 2024', status: 'verified' },
  { id: 'EM-005', source: 'Waste Processing', category: 'Scope 1', amount: 15.0, unit: 'tCO2e', period: 'Jan 2024', status: 'draft' },
];

const scopeSummary = [
  { scope: 'Scope 1 – Direct', icon: Factory, total: 143.0, change: -8.2 },
  { scope: 'Scope 2 – Energy', icon: BarChart3, total: 63.1, change: -12.5 },
  { scope: 'Scope 3 – Value Chain', icon: Truck, total: 28.4, change: -3.1 },
];

const statusColors: Record<string, string> = {
  verified: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  draft: 'bg-muted text-muted-foreground border-border',
};

interface UploadedFile {
  id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

export default function MyEmissionsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('jan-2024');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  const fetchUploads = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('supplier_uploads')
      .select('id, file_name, file_size, file_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setUploads(data as UploadedFile[]);
  }, [user]);

  useEffect(() => { fetchUploads(); }, [fetchUploads]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    const allowed = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf', 'application/vnd.ms-excel'];
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!allowed.includes(file.type)) {
          toast.error(`${file.name}: Unsupported file type. Use CSV, XLSX, or PDF.`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name}: File too large (max 10MB).`);
          continue;
        }
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: storageError } = await supabase.storage.from('supplier-uploads').upload(path, file);
        if (storageError) { toast.error(`Upload failed: ${storageError.message}`); continue; }
        const { error: dbError } = await supabase.from('supplier_uploads').insert({
          user_id: user.id, file_name: file.name, file_path: path, file_size: file.size, file_type: file.type,
        });
        if (dbError) { toast.error(`Save failed: ${dbError.message}`); continue; }
        toast.success(`${file.name} uploaded successfully!`);
      }
      fetchUploads();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (upload: UploadedFile) => {
    const { error } = await supabase.from('supplier_uploads').delete().eq('id', upload.id);
    if (error) { toast.error('Delete failed'); return; }
    toast.success('File deleted');
    fetchUploads();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout
      title="My Emissions"
      subtitle="Track, report, and manage your emission data across all scopes"
    >
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jan-2024">January 2024</SelectItem>
            <SelectItem value="dec-2023">December 2023</SelectItem>
            <SelectItem value="nov-2023">November 2023</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,.pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload Data'}
          </Button>
        </div>
      </div>

      {/* Recent Uploads */}
      {uploads.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploads.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-md border border-border p-2 text-sm">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{f.file_name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatSize(f.file_size)}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleDelete(f)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Scope Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {scopeSummary.map((s) => (
          <Card key={s.scope}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{s.scope}</p>
                <p className="text-2xl font-bold">{s.total} <span className="text-sm font-normal text-muted-foreground">tCO2e</span></p>
              </div>
              <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                <TrendingDown className="mr-1 h-3 w-3" />
                {s.change}%
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <EmissionsTrendChart />
        <EmissionsByCategoryChart />
      </div>

      {/* Emission Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Emission Records
          </CardTitle>
          <CardDescription>Detailed breakdown of reported emissions by source</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emissionRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.id}</TableCell>
                  <TableCell>{record.source}</TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell className="text-right font-medium">{record.amount} {record.unit}</TableCell>
                  <TableCell>{record.period}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[record.status]}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
