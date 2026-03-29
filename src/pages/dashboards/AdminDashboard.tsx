import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { systemUsers, aiAgents } from '@/lib/mock-data';
import { Users, Bot, Settings, Shield } from 'lucide-react';
import { AIAgentsCard } from '@/components/cards/AIAgentsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MoreHorizontal, UserPlus, Save } from 'lucide-react';

const roleColors = {
  procurement: 'bg-blue-100 text-blue-700',
  sustainability: 'bg-green-100 text-green-700',
  supplier: 'bg-orange-100 text-orange-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function AdminDashboard() {
  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Manage users, AI agents, and system configuration"
    >
      {/* KPI Cards */}
      <div className="dashboard-grid mb-6">
        <StatCard
          title="Total Users"
          value={systemUsers.length}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Active Agents"
          value={aiAgents.filter(a => a.status === 'active').length}
          icon={Bot}
          variant="success"
          suffix={`/ ${aiAgents.length}`}
        />
        <StatCard
          title="System Health"
          value="98.5%"
          icon={Settings}
          variant="success"
        />
        <StatCard
          title="Security Score"
          value="A+"
          icon={Shield}
          variant="success"
        />
      </div>

      {/* Users and Configuration */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Users Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('capitalize', roleColors[user.role])}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        user.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      )}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Emission Thresholds
            </CardTitle>
            <CardDescription>
              Configure violation detection thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>High Emission Alert (kg CO2e)</Label>
              <Slider defaultValue={[1500]} max={3000} step={100} />
              <p className="text-sm text-muted-foreground">Current: 1,500 kg</p>
            </div>
            <div className="space-y-3">
              <Label>Supplier Compliance Minimum (%)</Label>
              <Slider defaultValue={[80]} max={100} step={5} />
              <p className="text-sm text-muted-foreground">Current: 80%</p>
            </div>
            <div className="space-y-3">
              <Label>Monthly Reduction Target (%)</Label>
              <Input type="number" defaultValue="5" />
            </div>
            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents */}
      <AIAgentsCard />
    </DashboardLayout>
  );
}
