import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle2, Clock, AlertTriangle, Upload, FileText, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: string;
  expiry: string | null;
  progress: number;
  description: string;
  requirements: string[];
  benefits: string[];
  nextSteps: string[];
}

const certifications: Certification[] = [
  {
    id: 'C-001', name: 'ISO 14001', issuer: 'ISO', status: 'verified', expiry: '2025-06-15', progress: 100,
    description: 'Environmental Management Systems',
    requirements: ['Environmental policy established', 'Aspect & impact assessment', 'Legal compliance register', 'Internal audits completed', 'Management review conducted'],
    benefits: ['Reduced environmental impact', 'Regulatory compliance', 'Improved stakeholder trust', 'Cost savings through efficiency'],
    nextSteps: ['Schedule surveillance audit (Q3 2025)', 'Update environmental aspects register', 'Review corrective actions'],
  },
  {
    id: 'C-002', name: 'Carbon Trust Standard', issuer: 'Carbon Trust', status: 'verified', expiry: '2024-12-20', progress: 100,
    description: 'Carbon reduction and management',
    requirements: ['Carbon footprint measurement', 'Reduction targets set', 'Year-on-year reduction demonstrated', 'Third-party verification'],
    benefits: ['Demonstrates carbon reduction commitment', 'Market differentiation', 'Stakeholder confidence'],
    nextSteps: ['Renewal due Dec 2024', 'Prepare updated carbon footprint data', 'Book verification audit'],
  },
  {
    id: 'C-003', name: 'EcoVadis Gold', issuer: 'EcoVadis', status: 'in_progress', expiry: null, progress: 65,
    description: 'Sustainability rating for global supply chains',
    requirements: ['Environment documentation', 'Labor & human rights policies', 'Ethics & fair business practices', 'Sustainable procurement policy'],
    benefits: ['Global supply chain recognition', 'Customer requirement fulfillment', 'Benchmarking against peers'],
    nextSteps: ['Complete labor practices documentation (40% remaining)', 'Upload sustainable procurement policy', 'Submit for final review'],
  },
  {
    id: 'C-004', name: 'Science Based Targets', issuer: 'SBTi', status: 'verified', expiry: '2025-01-30', progress: 100,
    description: 'Climate targets aligned with Paris Agreement',
    requirements: ['Scope 1 & 2 targets set', 'Scope 3 screening completed', 'Targets validated by SBTi', 'Annual progress reporting'],
    benefits: ['Paris Agreement alignment', 'Investor confidence', 'Climate leadership recognition'],
    nextSteps: ['Submit annual progress report (Jan 2025)', 'Review Scope 3 reduction pathway'],
  },
  {
    id: 'C-005', name: 'ISO 50001', issuer: 'ISO', status: 'expired', expiry: '2023-11-01', progress: 100,
    description: 'Energy Management Systems',
    requirements: ['Energy policy defined', 'Energy baseline established', 'Energy performance indicators set', 'Continual improvement demonstrated'],
    benefits: ['Systematic energy management', 'Cost reduction', 'Regulatory compliance'],
    nextSteps: ['Re-certification audit required', 'Update energy review documentation', 'Contact certification body for scheduling'],
  },
  {
    id: 'C-006', name: 'LEED Certification', issuer: 'USGBC', status: 'not_started', expiry: null, progress: 0,
    description: 'Green building leadership',
    requirements: ['Site sustainability assessment', 'Water efficiency measures', 'Energy & atmosphere optimization', 'Materials & resources evaluation', 'Indoor environmental quality'],
    benefits: ['Green building recognition', 'Property value increase', 'Reduced operating costs', 'Healthier work environment'],
    nextSteps: ['Conduct preliminary assessment', 'Engage LEED consultant', 'Register project with USGBC'],
  },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  verified: { icon: CheckCircle2, color: 'text-success', label: 'Verified' },
  in_progress: { icon: Clock, color: 'text-warning', label: 'In Progress' },
  expired: { icon: AlertTriangle, color: 'text-destructive', label: 'Expired' },
  not_started: { icon: FileText, color: 'text-muted-foreground', label: 'Not Started' },
};

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <DashboardLayout
      title="Certifications"
      subtitle="Manage your environmental and sustainability certifications"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: certifications.length, color: 'text-foreground' },
          { label: 'Verified', value: certifications.filter(c => c.status === 'verified').length, color: 'text-success' },
          { label: 'In Progress', value: certifications.filter(c => c.status === 'in_progress').length, color: 'text-warning' },
          { label: 'Expired', value: certifications.filter(c => c.status === 'expired').length, color: 'text-destructive' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-2">
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => {
          const config = statusConfig[cert.status];
          const StatusIcon = config.icon;
          return (
            <Card key={cert.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{cert.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    <StatusIcon className={`mr-1 h-3 w-3 ${config.color}`} />
                    {config.label}
                  </Badge>
                </div>
                <CardDescription>{cert.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Issuer</span>
                  <span className="font-medium">{cert.issuer}</span>
                </div>
                {cert.expiry && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expiry</span>
                    <span className="font-medium">{cert.expiry}</span>
                  </div>
                )}
                {cert.status === 'in_progress' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedCert(cert)}
                >
                  {cert.status === 'not_started' ? 'Start Application' : 'View Details'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-lg">
          {selectedCert && (() => {
            const config = statusConfig[selectedCert.status];
            const StatusIcon = config.icon;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle>{selectedCert.name}</DialogTitle>
                      <DialogDescription>{selectedCert.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Status & Meta */}
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline">
                      <StatusIcon className={`mr-1 h-3 w-3 ${config.color}`} />
                      {config.label}
                    </Badge>
                    <Badge variant="secondary">Issuer: {selectedCert.issuer}</Badge>
                    {selectedCert.expiry && (
                      <Badge variant="secondary">Expiry: {selectedCert.expiry}</Badge>
                    )}
                  </div>

                  {selectedCert.status === 'in_progress' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{selectedCert.progress}%</span>
                      </div>
                      <Progress value={selectedCert.progress} className="h-2" />
                    </div>
                  )}

                  <Separator />

                  {/* Requirements */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Requirements</h4>
                    <ul className="space-y-1">
                      {selectedCert.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Benefits */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.benefits.map((b, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{b}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Next Steps */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Next Steps</h4>
                    <ul className="space-y-1">
                      {selectedCert.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                          {step}
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
