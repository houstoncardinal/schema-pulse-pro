import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Filter, FileText, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockIssues } from "@/lib/mock-data";

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const categoryLabels: Record<string, string> = {
  schema: "Schema",
  onpage: "On-Page",
  technical: "Technical",
};

const Issues = () => {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? mockIssues : mockIssues.filter((i) => i.severity === filter);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Issues</h1>
        <p className="text-muted-foreground text-sm mt-1">{mockIssues.length} issues found across all pages</p>
      </div>

      {/* Filters */}
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
            {f}
          </Button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border glow-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === issue.id ? null : issue.id)}
              className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="outline" className={severityColors[issue.severity]}>{issue.severity}</Badge>
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">{categoryLabels[issue.category]}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {issue.pages.length} page{issue.pages.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-foreground">{issue.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Impact</p>
                  <p className="text-sm font-bold text-primary">+{issue.impact} pts</p>
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

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Affected Pages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {issue.pages.map((p) => (
                        <code key={p} className="text-xs px-2 py-1 rounded-md bg-muted text-foreground font-mono">{p}</code>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <p className="text-xs font-medium text-primary uppercase tracking-wider">Fix Plan</p>
                    </div>
                    <p className="text-sm text-foreground">
                      {issue.category === "schema"
                        ? "Add or fix the schema markup on the affected pages. Use the Schema Builder to generate valid JSON-LD, then paste it into the <head> section of each page."
                        : issue.category === "onpage"
                        ? "Update the affected on-page elements. Each page should have a unique, descriptive tag under 60 characters that includes the target keyword."
                        : "Fix the technical issue by updating your server configuration or HTML. Test with a redirect checker tool to verify the fix."}
                    </p>
                  </div>
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
