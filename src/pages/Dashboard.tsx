import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  FileText,
  Globe,
  TrendingUp,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { mockScores, mockIssues, mockAudits, mockPages } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const latestAudit = mockAudits[0];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Latest audit: <span className="text-foreground font-medium">{latestAudit.url}</span>
          <span className="text-muted-foreground ml-2">· {latestAudit.date}</span>
        </p>
      </div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6 rounded-xl bg-card border border-border glow-card"
      >
        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex justify-center">
          <ScoreRing score={mockScores.overall} size={140} strokeWidth={10} label="Overall" />
        </div>
        <ScoreRing score={mockScores.technical} size={90} strokeWidth={6} label="Technical" />
        <ScoreRing score={mockScores.onPage} size={90} strokeWidth={6} label="On-Page" />
        <ScoreRing score={mockScores.schema} size={90} strokeWidth={6} label="Schema" />
        <ScoreRing score={mockScores.crawlHealth} size={90} strokeWidth={6} label="Crawl Health" />
        <ScoreRing score={mockScores.content} size={90} strokeWidth={6} label="Content" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical Issues */}
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
              onClick={() => navigate("/app/issues")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {mockIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={severityColors[issue.severity]}>
                        {issue.severity}
                      </Badge>
                      <span className="text-sm font-medium text-foreground truncate">{issue.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <FileText className="w-3 h-3" />
                    {issue.pages.length} page{issue.pages.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Crawl Summary */}
          <div className="rounded-xl bg-card border border-border glow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Crawl Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages crawled</span>
                <span className="text-foreground font-medium">{mockPages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total issues</span>
                <span className="text-foreground font-medium">{mockIssues.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schema types found</span>
                <span className="text-foreground font-medium">
                  {[...new Set(mockPages.flatMap((p) => p.schemaTypes))].length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages without schema</span>
                <span className="text-warning font-medium">
                  {mockPages.filter((p) => p.schemaTypes.length === 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Audits */}
          <div className="rounded-xl bg-card border border-border glow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Recent Audits</h2>
            </div>
            <div className="space-y-3">
              {mockAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                  <div className="min-w-0">
                    <p className="text-foreground font-medium truncate text-xs">{audit.url}</p>
                    <p className="text-muted-foreground text-xs">{audit.date} · {audit.pages} pages</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="font-medium text-foreground text-xs">{audit.score}</span>
                  </div>
                </div>
              ))}
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
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Issues</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockPages.map((page) => (
                <tr key={page.url} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="py-3 px-5">
                    <span className="text-foreground font-mono text-xs">{page.url}</span>
                  </td>
                  <td className="py-3 px-5">
                    <Badge variant="outline" className={page.status === 200 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                      {page.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1 flex-wrap">
                      {page.schemaTypes.length > 0 ? page.schemaTypes.map((t) => (
                        <Badge key={t} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {t}
                        </Badge>
                      )) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={page.issues > 2 ? "text-destructive" : page.issues > 0 ? "text-warning" : "text-success"}>
                      {page.issues}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`font-medium ${page.score >= 80 ? "text-success" : page.score >= 60 ? "text-accent" : page.score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {page.score}
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
