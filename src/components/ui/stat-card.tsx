import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  suffix?: string;
}

export function StatCard({ title, value, change, icon: Icon, variant = 'default', suffix }: StatCardProps) {
  const iconColors = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const getChangeColor = () => {
    if (change === undefined) return changeColors.neutral;
    if (change > 0) return changeColors.positive;
    if (change < 0) return changeColors.negative;
    return changeColors.neutral;
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <div className={cn('rounded-lg p-2.5', iconColors[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn('text-sm font-medium', getChangeColor())}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
