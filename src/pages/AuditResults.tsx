import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Download,
  FileText,
  ArrowUpRight,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScoreRing from "@/components/ScoreRing";
import { getAudit, getAuditPages, getAuditIssues, getAuditSchemaEntities } from "@/lib/api";

const statusIcon: Record<string, JSX.Element> = {
  valid: <CheckCircle className="w-4 h-4 text-success" />,
  warnings: <AlertTriangle className="w-4 h-4 text-warning" />,
  errors: <XCircle className="w-4 h-4 text-destructive" />,
};

const AuditResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auditId = searchParams.get("audit");
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [schemaEntities, setSchemaEntities] = useState<any[]>([]);

  useEffect(() => {
    if (!auditId) return;
    async function load() {
      try {
        const [a, p, i, s] = await Promise.all([
          getAudit(auditId!),
          getAuditPages(auditId!),
          getAuditIssues(auditId!),
          getAuditSchemaEntities(auditId!),
        ]);
        setAudit(a);
        setPages(p);
        setIssues(i);
        setSchemaEntities(s);
      } catch (e) {
        console.error('Error loading audit results:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [auditId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="p-6 text-center text-muted-foreground">Audit not found.</div>
    );
  }

  // Build schema inventory from real data
  const schemaInventory = buildSchemaInventory(schemaEntities, pages);

  // Build rich results potential from schema data
  const richResults = buildRichResults(schemaEntities);

  const scores = {
    overall: audit.overall_score ?? 0,
    technical: audit.technical_score ?? 0,
    onPage: audit.onpage_score ?? 0,
    schema: audit.schema_score ?? 0,
    crawlHealth: audit.crawl_health_score ?? 0,
    content: audit.content_score ?? 0,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Results</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {audit.url} · {pages.length} pages crawled · {new Date(audit.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border text-muted-foreground hover:text-foreground">
            <FileText className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Scores */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6 rounded-xl bg-card border border-border glow-card"
      >
        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex justify-center">
          <ScoreRing score={scores.overall} size={130} strokeWidth={10} label="Overall" />
        </div>
        <ScoreRing score={scores.technical} size={85} strokeWidth={6} label="Technical" />
        <ScoreRing score={scores.onPage} size={85} strokeWidth={6} label="On-Page" />
        <ScoreRing score={scores.schema} size={85} strokeWidth={6} label="Schema" />
        <ScoreRing score={scores.crawlHealth} size={85} strokeWidth={6} label="Crawl" />
        <ScoreRing score={scores.content} size={85} strokeWidth={6} label="Content" />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Schema Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border glow-card"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Schema Inventory</h2>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {schemaInventory.length} types
            </Badge>
          </div>
          <div className="divide-y divide-border">
            {schemaInventory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No schema markup found on any page.</div>
            ) : schemaInventory.map((schema) => (
              <div key={schema.type} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcon[schema.status]}
                    <div>
                      <span className="text-sm font-medium text-foreground font-mono">{schema.type}</span>
                      <p className="text-xs text-muted-foreground">
                        {schema.count} instance{schema.count !== 1 ? "s" : ""} · {schema.pageCount} page{schema.pageCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rich Results Potential */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border glow-card"
        >
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-foreground">Rich Results Potential</h2>
          </div>
          <div className="p-5 space-y-4">
            {richResults.map((item) => (
              <div key={item.type} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {item.eligible ? (
                    <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.type}</p>
                    {item.missing.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Missing: {item.missing.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={item.eligible ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}
                >
                  {item.eligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate(`/app/issues?audit=${audit.id}`)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <AlertTriangle className="w-4 h-4" /> View All Issues ({issues.length})
        </Button>
        <Button onClick={() => navigate("/app/roadmap")} variant="outline" className="border-border text-foreground hover:bg-muted gap-2">
          View Roadmap
        </Button>
      </div>
    </div>
  );
};

function buildSchemaInventory(entities: any[], pages: any[]) {
  const typeMap = new Map<string, { count: number; pageIds: Set<string>; hasErrors: boolean; hasWarnings: boolean }>();

  for (const entity of entities) {
    const type = entity.schema_type || 'Unknown';
    const existing = typeMap.get(type) || { count: 0, pageIds: new Set<string>(), hasErrors: false, hasWarnings: false };
    existing.count++;
    existing.pageIds.add(entity.page_id);
    if (!entity.is_valid || (Array.isArray(entity.errors) && entity.errors.length > 0)) existing.hasErrors = true;
    if (Array.isArray(entity.warnings) && entity.warnings.length > 0) existing.hasWarnings = true;
    typeMap.set(type, existing);
  }

  return Array.from(typeMap.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    pageCount: data.pageIds.size,
    status: data.hasErrors ? 'errors' : data.hasWarnings ? 'warnings' : 'valid',
  })).sort((a, b) => b.count - a.count);
}

function buildRichResults(entities: any[]) {
  const typeSet = new Set(entities.map(e => e.schema_type));

  const richResultTypes = [
    { type: 'Sitelinks Search Box', schemaNeeded: 'WebSite', requiredProps: ['potentialAction'] },
    { type: 'Product Rich Results', schemaNeeded: 'Product', requiredProps: ['offers', 'aggregateRating'] },
    { type: 'Article Rich Results', schemaNeeded: 'Article', requiredProps: [] },
    { type: 'FAQ Rich Results', schemaNeeded: 'FAQPage', requiredProps: ['mainEntity'] },
    { type: 'Breadcrumb Trail', schemaNeeded: 'BreadcrumbList', requiredProps: ['itemListElement'] },
    { type: 'Local Business Panel', schemaNeeded: 'LocalBusiness', requiredProps: ['address', 'geo', 'openingHours'] },
    { type: 'How-To Rich Results', schemaNeeded: 'HowTo', requiredProps: ['step'] },
    { type: 'Event Rich Results', schemaNeeded: 'Event', requiredProps: ['startDate', 'location'] },
    { type: 'Recipe Rich Results', schemaNeeded: 'Recipe', requiredProps: ['recipeIngredient', 'recipeInstructions'] },
    { type: 'Video Rich Results', schemaNeeded: 'VideoObject', requiredProps: ['thumbnailUrl', 'uploadDate'] },
  ];

  return richResultTypes.map(rt => {
    const hasSchema = typeSet.has(rt.schemaNeeded) || 
      // Check for subtypes
      (rt.schemaNeeded === 'Article' && (typeSet.has('NewsArticle') || typeSet.has('BlogPosting')));
    
    if (!hasSchema) {
      return { type: rt.type, eligible: false, missing: [`${rt.schemaNeeded} schema not found`] };
    }

    // Check if the entities of this type have the required props
    const relevantEntities = entities.filter(e => 
      e.schema_type === rt.schemaNeeded || 
      (rt.schemaNeeded === 'Article' && ['NewsArticle', 'BlogPosting'].includes(e.schema_type))
    );

    const missing: string[] = [];
    for (const prop of rt.requiredProps) {
      const hasProp = relevantEntities.some(e => {
        const raw = e.raw_json;
        return raw && typeof raw === 'object' && raw[prop] !== undefined && raw[prop] !== null && raw[prop] !== '';
      });
      if (!hasProp) missing.push(prop);
    }

    return { type: rt.type, eligible: missing.length === 0, missing };
  }).filter(rt => {
    // Only show rich results that are relevant (schema exists or commonly expected)
    const commonTypes = ['Sitelinks Search Box', 'Article Rich Results', 'Breadcrumb Trail', 'FAQ Rich Results', 'Product Rich Results'];
    const hasRelatedSchema = entities.some(e => e.schema_type === richResultTypes.find(r => r.type === rt.type)?.schemaNeeded);
    return commonTypes.includes(rt.type) || hasRelatedSchema;
  });
}

export default AuditResults;
