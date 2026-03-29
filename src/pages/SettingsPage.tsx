import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Leaf,
  Mail,
  Globe,
  Save,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function SettingsPage() {
  const { company, user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [autoReports, setAutoReports] = useState(true);

  useEffect(() => {
    if (company?.company_name) {
      setCompanyName(company.company_name);
    }
  }, [company]);

  const handleSaveCompanyName = async () => {
    if (!company || !companyName.trim()) return;
    setSavingName(true);
    const { error } = await supabase
      .from('companies')
      .update({ company_name: companyName.trim() })
      .eq('id', company.id);
    setSavingName(false);
    if (error) {
      toast.error('Failed to update company name');
    } else {
      toast.success('Company name updated successfully');
    }
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <DashboardLayout title="Settings" subtitle="Configure system preferences and thresholds">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="emissions" className="gap-2">
            <Leaf className="h-4 w-4" />
            Emissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Company Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="orgName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveCompanyName}
                      disabled={savingName || companyName === company?.company_name}
                      className="shrink-0"
                    >
                      {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="manufacturing">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Primary Region</Label>
                  <Select defaultValue="europe">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                  <Select defaultValue="january">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Configure system behavior and defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="iso">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                      <SelectItem value="us">MM/DD/YYYY</SelectItem>
                      <SelectItem value="eu">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Reports</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically generate monthly ESG reports
                    </p>
                  </div>
                  <Switch checked={autoReports} onCheckedChange={setAutoReports} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emissions Settings */}
        <TabsContent value="emissions">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emission Thresholds</CardTitle>
                <CardDescription>Configure violation detection thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>High Emission Alert</Label>
                    <Badge variant="secondary">1,500 kg CO2e</Badge>
                  </div>
                  <Slider defaultValue={[1500]} max={5000} step={100} />
                  <p className="text-xs text-muted-foreground">
                    Trigger alert when single procurement exceeds this threshold
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Critical Emission Level</Label>
                    <Badge variant="destructive">3,000 kg CO2e</Badge>
                  </div>
                  <Slider defaultValue={[3000]} max={5000} step={100} />
                  <p className="text-xs text-muted-foreground">
                    Block procurement and require approval above this level
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Monthly Target Reduction</Label>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                  <Slider defaultValue={[5]} max={20} step={1} />
                  <p className="text-xs text-muted-foreground">
                    Target reduction percentage compared to previous month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Settings</CardTitle>
                <CardDescription>Configure compliance monitoring rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Supplier Compliance Minimum</Label>
                    <Badge variant="secondary">80%</Badge>
                  </div>
                  <Slider defaultValue={[80]} max={100} step={5} />
                  <p className="text-xs text-muted-foreground">
                    Minimum sustainability score for approved suppliers
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Regulatory Framework</Label>
                  <Select defaultValue="eu-csrd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eu-csrd">EU CSRD</SelectItem>
                      <SelectItem value="ghg-protocol">GHG Protocol</SelectItem>
                      <SelectItem value="iso-14064">ISO 14064</SelectItem>
                      <SelectItem value="sbti">Science Based Targets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emission Factors Source</Label>
                  <Select defaultValue="defra">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defra">UK DEFRA</SelectItem>
                      <SelectItem value="epa">US EPA</SelectItem>
                      <SelectItem value="ecoinvent">Ecoinvent</SelectItem>
                      <SelectItem value="custom">Custom Factors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Slack Integration</p>
                      <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                    </div>
                  </div>
                  <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Choose which events trigger notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Emission threshold violations', enabled: true },
                  { label: 'New AI recommendations', enabled: true },
                  { label: 'Supplier compliance issues', enabled: true },
                  { label: 'Report generation complete', enabled: false },
                  { label: 'System maintenance alerts', enabled: true },
                ].map((pref) => (
                  <div
                    key={pref.label}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <span className="text-sm">{pref.label}</span>
                    <Switch defaultChecked={pref.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Configure security and access settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-xs text-muted-foreground">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Allowlist</Label>
                    <p className="text-xs text-muted-foreground">
                      Restrict access to specific IPs
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Configure audit logging preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Audit Logging</Label>
                    <p className="text-xs text-muted-foreground">
                      Track all user actions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Log Retention Period</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Export Audit Logs</Label>
                  <Button variant="outline" className="w-full gap-2">
                    <Database className="h-4 w-4" />
                    Download Audit Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
