import { aiAgents } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, Activity, Clock, Pause } from 'lucide-react';

const statusIcons = {
  active: Activity,
  processing: Clock,
  idle: Pause,
};

const statusStyles = {
  active: 'bg-success/10 text-success',
  processing: 'bg-warning/10 text-warning animate-pulse-slow',
  idle: 'bg-muted text-muted-foreground',
};

export function AIAgentsCard() {
  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">AI Agents Status</h3>
      </div>
      <div className="space-y-3">
        {aiAgents.map((agent) => {
          const StatusIcon = statusIcons[agent.status];
          return (
            <div
              key={agent.id}
              className="rounded-lg border border-border p-4 transition-all hover:border-primary/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{agent.name}</span>
                <Badge variant="secondary" className={cn('gap-1 capitalize', statusStyles[agent.status])}>
                  <StatusIcon className="h-3 w-3" />
                  {agent.status}
                </Badge>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{agent.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last run: {agent.lastRun}</span>
                <span>{agent.tasksCompleted.toLocaleString()} tasks completed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
