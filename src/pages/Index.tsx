import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Search,
  Code,
  BarChart3,
  Shield,
  BookOpen,
  ArrowRight,
  Check,
  Star,
  Globe,
  Layers,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Code,
    title: "Schema Validation",
    description: "Detect and validate JSON-LD, Microdata, and RDFa across every page. Line-level error reporting with fix suggestions.",
  },
  {
    icon: BarChart3,
    title: "SEO Scoring",
    description: "Get a 0-100 score with subscores for Technical, On-Page, Schema Quality, and Crawl Health.",
  },
  {
    icon: Target,
    title: "Roadmap to 100%",
    description: "Prioritized action plan with quick wins, developer tasks, and estimated impact per fix.",
  },
  {
    icon: Globe,
    title: "Smart Crawler",
    description: "Respectful, queue-based crawling with robots.txt compliance, depth limits, and sitemap ingestion.",
  },
  {
    icon: BookOpen,
    title: "Schema Library",
    description: "Searchable directory of schema types with examples, required fields, and one-click code generation.",
  },
  {
    icon: Layers,
    title: "Visual Builder",
    description: "Form-based schema builder with live JSON-LD preview, paste-to-validate, and diff view.",
  },
];

const stats = [
  { value: "50+", label: "Schema Types" },
  { value: "200+", label: "SEO Checks" },
  { value: "10K+", label: "Sites Audited" },
  { value: "99.9%", label: "Uptime" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 audits/month", "50 pages per crawl", "Basic schema validation", "SEO score report"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited audits", "500 pages per crawl", "Full schema library", "Roadmap planner", "PDF/CSV exports", "API access"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    features: ["Everything in Pro", "5,000 pages per crawl", "Scheduled audits", "White-label reports", "Team collaboration", "Priority support"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Index = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/app/audit/new${url ? `?url=${encodeURIComponent(url)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-foreground">
              Schema<span className="text-primary">Pulse</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app")} className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
            <Button size="sm" onClick={() => navigate("/app/audit/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Audit
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 mb-8">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">The #1 Schema Markup Validator</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Validate. Optimize.
              <br />
              <span className="gradient-text">Dominate Search.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Crawl any website, audit schema markup & SEO in real-time, and get a prioritized roadmap to reach a perfect score.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleAudit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Enter your website URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14 text-base bg-secondary border-border focus:border-primary focus:ring-primary/20 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl glow-primary whitespace-nowrap gap-2"
            >
              Audit Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Free tier available · No credit card required · Results in seconds
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need for <span className="gradient-text">perfect SEO</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From schema validation to actionable roadmaps, SchemaPulse covers every angle of structured data optimization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-xl bg-card border border-border glow-card hover:glow-card-hover transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Scale as you grow.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-6 rounded-xl border ${
                  plan.highlighted
                    ? "bg-card border-primary/50 glow-primary"
                    : "bg-card border-border glow-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => navigate("/app")}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">
              Schema<span className="text-primary">Pulse</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SchemaPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
