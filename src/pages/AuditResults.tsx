import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  ArrowUpRight,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScoreRing from "@/components/ScoreRing";
import { mockScores, mockIssues, mockPages } from "@/lib/mock-data";

const schemaInventory = [
  { type: "WebSite", count: 1, pages: ["/"], status: "valid" },
  { type: "Product", count: 3, pages: ["/products", "/products/widget-a", "/products/widget-b"], status: "errors" },
  { type: "Article", count: 2, pages: ["/blog/post-1", "/blog/post-2"], status: "valid" },
  { type: "LocalBusiness", count: 1, pages: ["/contact"], status: "warnings" },
  { type: "WebPage", count: 1, pages: ["/blog"], status: "valid" },
  { type: "BreadcrumbList", count: 1, pages: ["/products"], status: "valid" },
];

const statusIcon = {
  valid: <CheckCircle className="w-4 h-4 text-success" />,
  warnings: <AlertTriangle className="w-4 h-4 text-warning" />,
  errors: <XCircle className="w-4 h-4 text-destructive" />,
};

const AuditResults = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Results</h1>
          <p className="text-muted-foreground text-sm mt-1">
            https://example.com · 12 pages crawled · Feb 14, 2025
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
          <ScoreRing score={mockScores.overall} size={130} strokeWidth={10} label="Overall" />
        </div>
        <ScoreRing score={mockScores.technical} size={85} strokeWidth={6} label="Technical" />
        <ScoreRing score={mockScores.onPage} size={85} strokeWidth={6} label="On-Page" />
        <ScoreRing score={mockScores.schema} size={85} strokeWidth={6} label="Schema" />
        <ScoreRing score={mockScores.crawlHealth} size={85} strokeWidth={6} label="Crawl" />
        <ScoreRing score={mockScores.content} size={85} strokeWidth={6} label="Content" />
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
            {schemaInventory.map((schema) => (
              <div key={schema.type} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcon[schema.status as keyof typeof statusIcon]}
                    <div>
                      <span className="text-sm font-medium text-foreground font-mono">{schema.type}</span>
                      <p className="text-xs text-muted-foreground">{schema.count} instance{schema.count !== 1 ? "s" : ""} · {schema.pages.length} page{schema.pages.length !== 1 ? "s" : ""}</p>
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
            {[
              { type: "Sitelinks Search Box", eligible: true, missing: [] },
              { type: "Product Rich Results", eligible: false, missing: ["offers.price", "aggregateRating"] },
              { type: "Article Rich Results", eligible: true, missing: [] },
              { type: "FAQ Rich Results", eligible: false, missing: ["FAQPage schema not found"] },
              { type: "Breadcrumb Trail", eligible: true, missing: [] },
              { type: "Local Business Panel", eligible: false, missing: ["geo coordinates", "openingHours"] },
            ].map((item) => (
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
        <Button onClick={() => navigate("/app/issues")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <AlertTriangle className="w-4 h-4" /> View All Issues
        </Button>
        <Button onClick={() => navigate("/app/roadmap")} variant="outline" className="border-border text-foreground hover:bg-muted gap-2">
          View Roadmap
        </Button>
      </div>
    </div>
  );
};

export default AuditResults;
