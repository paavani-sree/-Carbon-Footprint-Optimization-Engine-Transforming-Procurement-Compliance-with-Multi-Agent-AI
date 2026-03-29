
-- Create storage bucket for supplier uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('supplier-uploads', 'supplier-uploads', false);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'supplier-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'supplier-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'supplier-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create table to track uploaded files metadata
CREATE TABLE public.supplier_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own uploads"
ON public.supplier_uploads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own uploads"
ON public.supplier_uploads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads"
ON public.supplier_uploads FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all uploads"
ON public.supplier_uploads FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
