import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Settings, FileText, BarChart3, LogOut, Leaf, Shield,
  ShoppingCart, Truck, Award, Bot, TrendingDown, Lightbulb, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: AppRole[]; // if undefined, visible to all authenticated users
}

const allNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Procurement', href: '/procurement', icon: ShoppingCart, roles: ['procurement', 'admin'] },
  { name: 'Sustainability', href: '/sustainability', icon: Leaf, roles: ['sustainability', 'admin'] },
  { name: 'Supplier', href: '/supplier', icon: Truck, roles: ['supplier', 'admin'] },
  { name: 'My Emissions', href: '/my-emissions', icon: TrendingDown },
  { name: 'Certifications', href: '/certifications', icon: Award },
  { name: 'Improvements', href: '/improvements', icon: Lightbulb },
  { name: 'AI Agents', href: '/ai-agents', icon: Bot },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const adminItems: NavItem[] = [
  { name: 'Admin Panel', href: '/admin', icon: Shield, roles: ['admin'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
];

export function Sidebar() {
  const { user, company, roles, isAdmin, hasRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const visibleNav = allNavItems.filter(item =>
    !item.roles || item.roles.some(r => hasRole(r))
  );

  const visibleAdmin = adminItems.filter(item =>
    !item.roles || item.roles.some(r => hasRole(r))
  );

  const displayName = company?.company_name || user.email || 'User';

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-purple-500/20 text-purple-300',
    procurement: 'bg-blue-500/20 text-blue-300',
    sustainability: 'bg-emerald-500/20 text-emerald-300',
    supplier: 'bg-amber-500/20 text-amber-300',
    industry: 'bg-sidebar-accent text-sidebar-accent-foreground',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderLink = (item: NavItem) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 gradient-dark">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CfoE</h1>
            <p className="text-xs text-sidebar-foreground/60">Optimization Engine</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {visibleNav.map(renderLink)}
          </div>

          {visibleAdmin.length > 0 && (
            <>
              <Separator className="my-3 bg-sidebar-border" />
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Administration</p>
              <div className="space-y-1">
                {visibleAdmin.map(renderLink)}
              </div>
            </>
          )}

          {/* Settings always at bottom of nav */}
          <Separator className="my-3 bg-sidebar-border" />
          {renderLink({ name: 'Settings', href: '/settings', icon: Settings })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {roles.map(role => (
                  <Badge key={role} variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', roleBadgeColor[role] || roleBadgeColor.industry)}>
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
