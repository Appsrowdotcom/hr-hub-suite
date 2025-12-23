-- Add theme customization columns to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#0f766e',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#14b8a6',
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#2dd4bf',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#ffffff';

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their company's folder
CREATE POLICY "Company admins can upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE id IN (SELECT get_user_companies(auth.uid()))
  )
);

-- Allow authenticated users to update their company's logos
CREATE POLICY "Company admins can update logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE id IN (SELECT get_user_companies(auth.uid()))
  )
);

-- Allow authenticated users to delete their company's logos
CREATE POLICY "Company admins can delete logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE id IN (SELECT get_user_companies(auth.uid()))
  )
);

-- Allow public access to view logos
CREATE POLICY "Anyone can view company logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');