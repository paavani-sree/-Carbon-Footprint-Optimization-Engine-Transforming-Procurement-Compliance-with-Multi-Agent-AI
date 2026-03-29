import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, ArrowRight, Building2, Mail, Lock, MapPin, BarChart3, Shield, Zap, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const industryTypes = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'energy', label: 'Energy & Power' },
  { value: 'oil_gas', label: 'Oil & Gas' },
  { value: 'construction', label: 'Construction' },
  { value: 'aviation', label: 'Aviation' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'mining', label: 'Mining' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'food_processing', label: 'Food Processing' },
  { value: 'other', label: 'Other' },
];

const benefits = [
  { icon: BarChart3, title: 'Smart Analytics', desc: 'AI-powered operational insights' },
  { icon: Zap, title: 'Energy Savings', desc: 'Up to 25% energy cost reduction' },
  { icon: Shield, title: 'Compliance', desc: 'Track environmental standards' },
  { icon: TrendingDown, title: 'Carbon Reduction', desc: 'Measurable emission targets' },
];

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, {
        company_name: companyName,
        industry_type: industryType,
        location,
      });
      if (error) {
        toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Account Created!', description: 'You can now sign in to your account.' });
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      } else {
        navigate('/dashboard');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <div className="gradient-dark absolute inset-0" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-white">CfoE</span>
          </Link>

          {/* Main content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">
              Optimize your
              <span className="block mt-1 text-primary">industrial operations</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-sidebar-foreground/70">
              Submit your operational data and receive AI-driven recommendations for energy efficiency, 
              cost reduction, and sustainability improvements.
            </p>

            {/* Benefits */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-3 rounded-xl bg-sidebar-accent/50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <b.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sidebar-foreground">{b.title}</p>
                    <p className="text-xs text-sidebar-foreground/60">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-sidebar-foreground/40">
            © 2026 CfoE — Carbon Footprint Optimization Engine
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CfoE</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? 'Register your industry to start optimizing operations'
                : 'Sign in to access your optimization dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="company" placeholder="Your Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Industry Type</Label>
                    <Select value={industryType} onValueChange={setIndustryType} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {industryTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 h-11" disabled={isLoading}>
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:underline">
              {isSignUp ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
