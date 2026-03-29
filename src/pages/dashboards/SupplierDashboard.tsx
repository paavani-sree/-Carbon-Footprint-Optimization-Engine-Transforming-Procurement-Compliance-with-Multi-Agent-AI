import { useState, useRef, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { supplierKPIs } from '@/lib/mock-data';
import { Leaf, Star, ShoppingBag, Award, Upload, FileText, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { EmissionsTrendChart } from '@/components/charts/EmissionsTrendChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const certifications = [
  { name: 'ISO 14001', status: 'verified', expiry: '2025-06-15' },
  { name: 'Carbon Trust Standard', status: 'verified', expiry: '2024-12-20' },
  { name: 'EcoVadis Gold', status: 'pending', expiry: null },
  { name: 'Science Based Targets', status: 'verified', expiry: '2025-01-30' },
];

const improvementSuggestions = [
  { title: 'Switch to renewable energy', impact: 'High', potential: '-25% emissions', progress: 45 },
  { title: 'Optimize logistics routes', impact: 'Medium', potential: '-12% transport CO2', progress: 70 },
  { title: 'Implement waste reduction', impact: 'Medium', potential: '-8% material waste', progress: 30 },
];

interface UploadedFile {
  id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

export default function SupplierDashboard() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
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
      title="Supplier Dashboard" 
      subtitle="Your emission data, sustainability metrics, and improvement opportunities"
    >
      <div className="dashboard-grid mb-6">
        <StatCard title="Reported Emissions" value={`${supplierKPIs.emissionsReported}t`} icon={Leaf} variant="default" suffix="CO2e" />
        <StatCard title="Sustainability Score" value={supplierKPIs.sustainabilityScore} icon={Star} variant="success" suffix="/100" />
        <StatCard title="Orders Processed" value={supplierKPIs.ordersProcessed} icon={ShoppingBag} variant="default" />
        <StatCard title="Certifications" value={supplierKPIs.certifications} icon={Award} variant="success" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Emission Data
            </CardTitle>
            <CardDescription>Submit your latest emission reports and sustainability data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.pdf"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <div
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
            >
              {uploading ? (
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              ) : (
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Drag and drop files or click to browse'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Supports CSV, XLSX, PDF (max 10MB)</p>
            </div>

            {uploads.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Recent Uploads</p>
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
              </div>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <EmissionsTrendChart />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  {cert.status === 'verified' ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <FileText className="h-5 w-5 text-warning" />
                  )}
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    {cert.expiry && <p className="text-xs text-muted-foreground">Expires: {cert.expiry}</p>}
                  </div>
                </div>
                <span className={`text-sm capitalize ${cert.status === 'verified' ? 'text-success' : 'text-warning'}`}>
                  {cert.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Improvement Suggestions
            </CardTitle>
            <CardDescription>AI-powered recommendations to reduce your carbon footprint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvementSuggestions.map((suggestion) => (
              <div key={suggestion.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{suggestion.title}</p>
                  <span className="text-sm text-primary">{suggestion.potential}</span>
                </div>
                <Progress value={suggestion.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{suggestion.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
