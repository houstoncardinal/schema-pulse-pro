import { supabase } from "@/integrations/supabase/client";

export async function createAudit(params: {
  url: string;
  maxPages?: number;
  maxDepth?: number;
  respectRobots?: boolean;
  followSitemap?: boolean;
}) {
  // Normalize URL
  let url = params.url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // Create audit record
  const { data: audit, error } = await supabase
    .from("audits")
    .insert({
      url,
      max_pages: params.maxPages ?? 50,
      max_depth: params.maxDepth ?? 5,
      respect_robots: params.respectRobots ?? true,
      follow_sitemap: params.followSitemap ?? true,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger the audit edge function (fire and forget)
  supabase.functions.invoke("run-audit", {
    body: { audit_id: audit.id },
  }).catch(err => console.error("Failed to trigger audit:", err));

  return audit;
}

export async function getAudit(auditId: string) {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", auditId)
    .single();
  if (error) throw error;
  return data;
}

export async function getLatestAudit() {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAuditPages(auditId: string) {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("audit_id", auditId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAuditIssues(auditId: string) {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .eq("audit_id", auditId)
    .order("impact_score", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAuditSchemaEntities(auditId: string) {
  const { data, error } = await supabase
    .from("schema_entities")
    .select("*")
    .eq("audit_id", auditId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAllAudits() {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
