import { violations } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const severityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

const statusStyles = {
  open: 'bg-destructive/10 text-destructive',
  investigating: 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
};

export function ViolationsCard() {
  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-destructive/10 p-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Active Violations</h3>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {violations.map((violation) => (
          <div
            key={violation.id}
            className={cn(
              'rounded-lg border p-4',
              severityStyles[violation.severity]
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">{violation.supplier}</span>
              <Badge variant="secondary" className={cn('capitalize', statusStyles[violation.status])}>
                {violation.status}
              </Badge>
            </div>
            <p className="text-sm">{violation.type}</p>
            <p className="mt-1 text-xs text-muted-foreground">{violation.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
