
-- Audits table: stores each crawl/audit session
CREATE TABLE public.audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'crawling', 'analyzing', 'completed', 'failed')),
  max_pages INTEGER NOT NULL DEFAULT 50,
  max_depth INTEGER NOT NULL DEFAULT 5,
  respect_robots BOOLEAN NOT NULL DEFAULT true,
  follow_sitemap BOOLEAN NOT NULL DEFAULT true,
  pages_crawled INTEGER NOT NULL DEFAULT 0,
  pages_total INTEGER NOT NULL DEFAULT 0,
  overall_score INTEGER,
  technical_score INTEGER,
  onpage_score INTEGER,
  schema_score INTEGER,
  crawl_health_score INTEGER,
  content_score INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Pages table: stores each crawled page
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status_code INTEGER,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  word_count INTEGER,
  has_schema BOOLEAN NOT NULL DEFAULT false,
  schema_types TEXT[] DEFAULT '{}',
  page_score INTEGER,
  load_time_ms INTEGER,
  html_size INTEGER,
  canonical_url TEXT,
  robots_meta TEXT,
  is_indexable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schema entities found on pages
CREATE TABLE public.schema_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  schema_type TEXT NOT NULL,
  source_format TEXT NOT NULL CHECK (source_format IN ('json-ld', 'microdata', 'rdfa')),
  raw_json JSONB NOT NULL,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  errors JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  properties_count INTEGER DEFAULT 0,
  has_required_fields BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Issues found during audit
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('schema', 'seo', 'technical', 'content', 'security', 'performance')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info', 'opportunity')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT,
  fix_plan TEXT,
  impact_score INTEGER DEFAULT 0,
  effort TEXT CHECK (effort IN ('low', 'medium', 'high')),
  affected_pages INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_pages_audit_id ON public.pages(audit_id);
CREATE INDEX idx_schema_entities_audit_id ON public.schema_entities(audit_id);
CREATE INDEX idx_schema_entities_page_id ON public.schema_entities(page_id);
CREATE INDEX idx_issues_audit_id ON public.issues(audit_id);
CREATE INDEX idx_issues_severity ON public.issues(severity);
CREATE INDEX idx_issues_category ON public.issues(category);

-- Enable RLS (public access for now since no auth yet)
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Allow public access (will tighten with auth later)
CREATE POLICY "Allow public read audits" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Allow public insert audits" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update audits" ON public.audits FOR UPDATE USING (true);

CREATE POLICY "Allow public read pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Allow public insert pages" ON public.pages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read schema_entities" ON public.schema_entities FOR SELECT USING (true);
CREATE POLICY "Allow public insert schema_entities" ON public.schema_entities FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Allow public insert issues" ON public.issues FOR INSERT WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_audits_updated_at
BEFORE UPDATE ON public.audits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
