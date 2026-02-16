import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Copy, Check, BookOpen, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockSchemaLibrary } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const categoryColors: Record<string, string> = {
  business: "bg-primary/10 text-primary border-primary/20",
  ecommerce: "bg-success/10 text-success border-success/20",
  content: "bg-accent/10 text-accent border-accent/20",
  navigation: "bg-warning/10 text-warning border-warning/20",
  general: "bg-secondary text-secondary-foreground border-border",
  events: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-primary/10 text-primary border-primary/20",
};

const SchemaLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = mockSchemaLibrary.filter(
    (s) =>
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedType ? mockSchemaLibrary.find((s) => s.type === selectedType) : null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied!", description: "Schema code copied to clipboard." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Schema Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse {mockSchemaLibrary.length} schema types with examples and code generators.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* List */}
        <div className="lg:w-96 flex-shrink-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schema types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filtered.map((schema, i) => (
              <motion.button
                key={schema.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedType(schema.type)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedType === schema.type
                    ? "bg-primary/10 border-primary/30 glow-card-hover"
                    : "bg-card border-border glow-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground font-mono">{schema.type}</span>
                  <Badge variant="outline" className={`text-xs ${categoryColors[schema.category]}`}>
                    {schema.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{schema.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 min-w-0">
          {selected ? (
            <motion.div
              key={selected.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-xl bg-card border border-border glow-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground font-mono">{selected.type}</h2>
                  <Badge variant="outline" className={categoryColors[selected.category]}>
                    {selected.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{selected.description}</p>

                <div className="mb-6">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Use Cases</h3>
                  <ul className="space-y-1">
                    {selected.useCases.map((uc) => (
                      <li key={uc} className="text-sm text-foreground flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-primary" /> {uc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Required Fields</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.requiredFields.map((f) => (
                        <code key={f} className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive font-mono">{f}</code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recommended Fields</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.recommendedFields.map((f) => (
                        <code key={f} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-mono">{f}</code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="rounded-xl bg-card border border-border glow-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">JSON-LD Example</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(selected.example, selected.type)}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copiedId === selected.type ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === selected.type ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="p-5 overflow-x-auto text-sm font-mono text-foreground leading-relaxed">
                  {selected.example}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-12">
              <div>
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a schema type to view details, examples, and code.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaLibrary;
