-- Create storage bucket for PDF reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for users to view their own reports
CREATE POLICY "Users can view their own reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policy for users to upload their own reports
CREATE POLICY "Users can upload their own reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policy for users to delete their own reports
CREATE POLICY "Users can delete their own reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add table to track saved reports
CREATE TABLE public.saved_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_reports
CREATE POLICY "Users can view their own saved reports"
ON public.saved_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved reports"
ON public.saved_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved reports"
ON public.saved_reports FOR DELETE
USING (auth.uid() = user_id);

-- Add constraints
ALTER TABLE public.saved_reports
  ADD CONSTRAINT report_name_length_check CHECK (length(report_name) <= 200),
  ADD CONSTRAINT report_type_length_check CHECK (length(report_type) <= 50),
  ADD CONSTRAINT file_path_length_check CHECK (length(file_path) <= 500);