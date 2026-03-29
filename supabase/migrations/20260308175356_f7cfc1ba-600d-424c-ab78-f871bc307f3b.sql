
-- Create enum for industry types
CREATE TYPE public.industry_type AS ENUM (
  'manufacturing', 'energy', 'oil_gas', 'construction', 'aviation',
  'agriculture', 'chemicals', 'real_estate', 'technology', 'healthcare',
  'transportation', 'mining', 'textiles', 'food_processing', 'other'
);

-- Create enum for user/company role
CREATE TYPE public.app_role AS ENUM ('industry', 'admin');

-- Create companies/profiles table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry_type industry_type NOT NULL DEFAULT 'other',
  email TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create operational_data table
CREATE TABLE public.operational_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  production_capacity TEXT,
  resource_usage TEXT,
  energy_consumption NUMERIC,
  energy_unit TEXT DEFAULT 'kWh',
  workforce_count INTEGER,
  supply_chain_info TEXT,
  current_challenges TEXT,
  annual_revenue NUMERIC,
  waste_generated NUMERIC,
  water_usage NUMERIC,
  carbon_emissions NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create optimization_results table
CREATE TABLE public.optimization_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operational_data_id UUID REFERENCES public.operational_data(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  potential_savings TEXT,
  impact_level TEXT CHECK (impact_level IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_results ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Companies policies
CREATE POLICY "Users can view own company" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own company" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all companies" ON public.companies
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Operational data policies
CREATE POLICY "Companies can view own data" ON public.operational_data
  FOR SELECT USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );
CREATE POLICY "Companies can insert own data" ON public.operational_data
  FOR INSERT WITH CHECK (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );
CREATE POLICY "Companies can update own data" ON public.operational_data
  FOR UPDATE USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );
CREATE POLICY "Admins can view all operational data" ON public.operational_data
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Optimization results policies
CREATE POLICY "Companies can view own results" ON public.optimization_results
  FOR SELECT USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );
CREATE POLICY "Admins can manage all results" ON public.optimization_results
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operational_data_updated_at
  BEFORE UPDATE ON public.operational_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create company profile and assign 'industry' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.companies (user_id, company_name, email, industry_type, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'industry_type')::industry_type, 'other'),
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'industry');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
