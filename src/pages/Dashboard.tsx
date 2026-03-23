import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  FileText,
  Globe,
  TrendingUp,
  Loader2,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { getLatestAudit, getAllAudits, getAuditIssues, getAuditPages } from "@/lib/api";

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [latest, allAudits] = await Promise.all([getLatestAudit(), getAllAudits()]);
        setAudit(latest);
        setAudits(allAudits.filter(a => a.status === 'completed').slice(0, 5));
        if (latest?.id) {
          const [iss, pgs] = await Promise.all([getAuditIssues(latest.id), getAuditPages(latest.id)]);
          setIssues(iss);
          setPages(pgs);
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!audit || audit.status !== 'completed') {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">No completed audits yet. Run your first audit to see results here.</p>
        <button onClick={() => navigate('/app/new-audit')} className="text-primary hover:underline">
          Start New Audit →
        </button>
      </div>
    );
  }

  const scores = {
    overall: audit.overall_score ?? 0,
    technical: audit.technical_score ?? 0,
    onPage: audit.onpage_score ?? 0,
    schema: audit.schema_score ?? 0,
    crawlHealth: audit.crawl_health_score ?? 0,
    content: audit.content_score ?? 0,
  };

  const schemaTypes = [...new Set(pages.flatMap(p => p.schema_types || []))];
  const pagesWithoutSchema = pages.filter(p => !p.has_schema).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Latest audit: <span className="text-foreground font-medium">{audit.url}</span>
          <span className="text-muted-foreground ml-2">· {new Date(audit.created_at).toLocaleDateString()}</span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6 rounded-xl bg-card border border-border glow-card"
      >
        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex justify-center">
          <ScoreRing score={scores.overall} size={140} strokeWidth={10} label="Overall" />
        </div>
        <ScoreRing score={scores.technical} size={90} strokeWidth={6} label="Technical" />
        <ScoreRing score={scores.onPage} size={90} strokeWidth={6} label="On-Page" />
        <ScoreRing score={scores.schema} size={90} strokeWidth={6} label="Schema" />
        <ScoreRing score={scores.crawlHealth} size={90} strokeWidth={6} label="Crawl Health" />
        <ScoreRing score={scores.content} size={90} strokeWidth={6} label="Content" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl bg-card border border-border glow-card"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h2 className="font-semibold text-foreground">Top Issues</h2>
            </div>
            <button
              onClick={() => navigate(`/app/issues?audit=${audit.id}`)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={severityColors[issue.severity] || ''}>
                        {issue.severity}
                      </Badge>
                      <span className="text-sm font-medium text-foreground truncate">{issue.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <FileText className="w-3 h-3" />
                    {issue.affected_pages || 1} page{(issue.affected_pages || 1) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
            {issues.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No issues found — great job!</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="rounded-xl bg-card border border-border glow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Crawl Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages crawled</span>
                <span className="text-foreground font-medium">{pages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total issues</span>
                <span className="text-foreground font-medium">{issues.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schema types found</span>
                <span className="text-foreground font-medium">{schemaTypes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages without schema</span>
                <span className="text-warning font-medium">{pagesWithoutSchema}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border glow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Recent Audits</h2>
            </div>
            <div className="space-y-3">
              {audits.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/app/results?audit=${a.id}`)}
                  className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-foreground font-medium truncate text-xs">{a.url}</p>
                    <p className="text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()} · {a.pages_crawled} pages</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="font-medium text-foreground text-xs">{a.overall_score}</span>
                  </div>
                </div>
              ))}
              {audits.length === 0 && (
                <p className="text-muted-foreground text-xs">No audits yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pages Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-card border border-border glow-card overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Pages Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Schema Types</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.slice(0, 20).map((page) => (
                <tr key={page.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="py-3 px-5">
                    <span className="text-foreground font-mono text-xs truncate block max-w-[300px]">{page.url}</span>
                  </td>
                  <td className="py-3 px-5">
                    <Badge variant="outline" className={page.status_code === 200 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                      {page.status_code}
                    </Badge>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1 flex-wrap">
                      {(page.schema_types || []).length > 0 ? (page.schema_types || []).map((t: string) => (
                        <Badge key={t} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {t}
                        </Badge>
                      )) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`font-medium ${(page.page_score ?? 0) >= 80 ? "text-success" : (page.page_score ?? 0) >= 60 ? "text-accent" : (page.page_score ?? 0) >= 40 ? "text-warning" : "text-destructive"}`}>
                      {page.page_score ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
