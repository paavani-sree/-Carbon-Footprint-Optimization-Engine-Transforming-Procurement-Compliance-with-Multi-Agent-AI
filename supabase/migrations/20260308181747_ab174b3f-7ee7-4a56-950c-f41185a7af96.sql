-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'procurement';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sustainability';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';