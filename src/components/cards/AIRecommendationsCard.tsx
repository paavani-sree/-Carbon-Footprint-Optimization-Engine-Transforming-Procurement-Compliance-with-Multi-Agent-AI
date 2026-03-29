import { aiRecommendations } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const typeIcons = {
  alternative: Sparkles,
  optimization: Zap,
  compliance: Shield,
};

const typeStyles = {
  alternative: 'bg-primary/10 text-primary',
  optimization: 'bg-success/10 text-success',
  compliance: 'bg-warning/10 text-warning',
};

export function AIRecommendationsCard() {
  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {aiRecommendations.map((rec) => {
          const Icon = typeIcons[rec.type];
          return (
            <div
              key={rec.id}
              className="rounded-lg border border-border p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('rounded-md p-1.5', typeStyles[rec.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium">{rec.title}</h4>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {rec.confidence}% confidence
                </Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{rec.impact}</span>
                <span className="text-xs text-muted-foreground">{rec.agent}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
