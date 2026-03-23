import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Filter, FileText, Lightbulb, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuditIssues, getLatestAudit } from "@/lib/api";

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const categoryLabels: Record<string, string> = {
  schema: "Schema",
  seo: "On-Page",
  technical: "Technical",
  content: "Content",
  security: "Security",
  performance: "Performance",
};

const Issues = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        let auditId = searchParams.get("audit");
        if (!auditId) {
          const latest = await getLatestAudit();
          auditId = latest?.id;
        }
        if (auditId) {
          const data = await getAuditIssues(auditId);
          setIssues(data);
        }
      } catch (e) {
        console.error('Error loading issues:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filtered = filter === "all" ? issues : issues.filter((i) => i.severity === filter);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Issues</h1>
        <p className="text-muted-foreground text-sm mt-1">{issues.length} issues found across all pages</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["all", "critical", "warning", "info"].map((f) => (
          <Button
            key={f}
            variant="outline"
            size="sm"
            onClick={() => setFilter(f)}
            className={`capitalize ${filter === f ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground"}`}
          >
            {f} {f !== "all" && `(${issues.filter(i => i.severity === f).length})`}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm rounded-xl bg-card border border-border">
            {filter === "all" ? "No issues found." : `No ${filter} issues found.`}
          </div>
        )}
        {filtered.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
            className="rounded-xl bg-card border border-border glow-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === issue.id ? null : issue.id)}
              className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="outline" className={severityColors[issue.severity] || ''}>{issue.severity}</Badge>
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
                    {categoryLabels[issue.category] || issue.category}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-foreground">{issue.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{issue.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Impact</p>
                  <p className="text-sm font-bold text-primary">+{issue.impact_score || 0} pts</p>
                </div>
                {expanded === issue.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {expanded === issue.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t border-border"
              >
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-foreground">{issue.description}</p>
                  </div>

                  {issue.evidence && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Evidence</p>
                      <code className="text-xs block p-3 rounded-md bg-muted text-foreground font-mono whitespace-pre-wrap break-all">
                        {issue.evidence}
                      </code>
                    </div>
                  )}

                  {issue.fix_plan && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <p className="text-xs font-medium text-primary uppercase tracking-wider">Fix Plan</p>
                      </div>
                      <p className="text-sm text-foreground">{issue.fix_plan}</p>
                    </div>
                  )}

                  {issue.effort && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Effort:</p>
                      <Badge variant="outline" className="text-xs capitalize">{issue.effort}</Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Issues;
