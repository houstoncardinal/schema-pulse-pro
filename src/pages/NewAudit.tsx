import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Settings2,
  Globe,
  Shield,
  Zap,
  Play,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const NewAudit = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxPages, setMaxPages] = useState([50]);
  const [maxDepth, setMaxDepth] = useState([5]);
  const [respectRobots, setRespectRobots] = useState(true);
  const [followSitemap, setFollowSitemap] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsRunning(true);
    setProgress(0);

    // Simulate crawl progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/app/results"), 500);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 300);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">New Audit</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter a website URL to crawl and analyze schema markup, SEO signals, and technical health.
        </p>

        {!isRunning ? (
          <form onSubmit={handleStartAudit} className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label className="text-foreground">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 h-14 text-base bg-secondary border-border rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Quick Checks */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Search, label: "Schema Validation", desc: "JSON-LD, Microdata, RDFa" },
                { icon: Shield, label: "SEO Audit", desc: "200+ on-page checks" },
                { icon: Zap, label: "Score & Roadmap", desc: "Prioritized action plan" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 rounded-xl bg-card border border-border text-center">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>

            {/* Advanced Settings */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-4 flex items-center justify-between text-sm hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Advanced Settings</span>
                </div>
                <span className="text-muted-foreground text-xs">{showAdvanced ? "Hide" : "Show"}</span>
              </button>

              {showAdvanced && (
                <div className="p-4 pt-0 space-y-5 border-t border-border mt-0 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm text-foreground">Max Pages</Label>
                      <span className="text-sm text-muted-foreground font-mono">{maxPages[0]}</span>
                    </div>
                    <Slider value={maxPages} onValueChange={setMaxPages} min={1} max={500} step={1} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm text-foreground">Max Depth</Label>
                      <span className="text-sm text-muted-foreground font-mono">{maxDepth[0]}</span>
                    </div>
                    <Slider value={maxDepth} onValueChange={setMaxDepth} min={1} max={10} step={1} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-foreground">Respect robots.txt</Label>
                    <Switch checked={respectRobots} onCheckedChange={setRespectRobots} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-foreground">Follow sitemap.xml</Label>
                    <Switch checked={followSitemap} onCheckedChange={setFollowSitemap} />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-primary gap-2 text-base"
            >
              <Play className="w-5 h-5" />
              Start Audit
            </Button>
          </form>
        ) : (
          /* Progress View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-card border border-border p-8 text-center space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <Loader2 className="w-24 h-24 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{Math.min(100, Math.round(progress))}%</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Auditing {url}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {progress < 30
                  ? "Crawling pages..."
                  : progress < 60
                  ? "Extracting schema markup..."
                  : progress < 85
                  ? "Running SEO checks..."
                  : "Generating report..."}
              </p>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NewAudit;
