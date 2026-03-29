import { recentProcurements, Procurement } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Lightbulb } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const statusStyles = {
  approved: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  flagged: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function ProcurementsTable() {
  return (
    <div className="table-container">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold">Recent Procurements</h3>
        <Button variant="ghost" size="sm" className="gap-2">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Carbon Impact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentProcurements.map((procurement) => (
            <TableRow key={procurement.id}>
              <TableCell className="font-medium">{procurement.id}</TableCell>
              <TableCell>{procurement.item}</TableCell>
              <TableCell>{procurement.supplier}</TableCell>
              <TableCell className="text-right">{procurement.quantity.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <span className={cn(
                  'font-medium',
                  procurement.carbonImpact > 1500 ? 'text-destructive' : 
                  procurement.carbonImpact > 500 ? 'text-warning' : 'text-success'
                )}>
                  {procurement.carbonImpact.toLocaleString()} kg
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn('capitalize', statusStyles[procurement.status])}
                >
                  {procurement.status}
                </Badge>
              </TableCell>
              <TableCell>
                {procurement.alternative && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">AI Suggestion:</p>
                      <p>{procurement.alternative}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
