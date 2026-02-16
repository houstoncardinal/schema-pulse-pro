import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, Copy, Check, AlertTriangle, CheckCircle, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const SchemaBuilder = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [pastedSchema, setPastedSchema] = useState("");
  const [validationResult, setValidationResult] = useState<null | { valid: boolean; errors: string[] }>(null);

  // Builder state
  const [orgName, setOrgName] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [orgDescription, setOrgDescription] = useState("");

  const generatedSchema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      ...(orgName && { name: orgName }),
      ...(orgUrl && { url: orgUrl }),
      ...(orgLogo && { logo: orgLogo }),
      ...(orgDescription && { description: orgDescription }),
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "JSON-LD copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    if (!pastedSchema.trim()) return;
    try {
      const parsed = JSON.parse(pastedSchema);
      const errors: string[] = [];
      if (!parsed["@context"]) errors.push('Missing "@context" property');
      if (!parsed["@type"]) errors.push('Missing "@type" property');
      if (parsed["@type"] && !parsed.name) errors.push(`Missing "name" property for ${parsed["@type"]}`);
      if (parsed.url && !/^https?:\/\//.test(parsed.url)) errors.push('"url" should start with http:// or https://');
      setValidationResult({ valid: errors.length === 0, errors });
    } catch {
      setValidationResult({ valid: false, errors: ["Invalid JSON: Check syntax (missing commas, brackets, or quotes)"] });
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Schema Builder</h1>
        <p className="text-muted-foreground text-sm mt-1">Build schemas visually or validate existing markup.</p>
      </div>

      <Tabs defaultValue="builder">
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger value="builder" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Hammer className="w-4 h-4" /> Builder
          </TabsTrigger>
          <TabsTrigger value="validator" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ClipboardPaste className="w-4 h-4" /> Validator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl bg-card border border-border glow-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground text-sm">Organization Schema</h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Organization Name *</Label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Inc." className="bg-secondary border-border mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Website URL</Label>
                  <Input value={orgUrl} onChange={(e) => setOrgUrl(e.target.value)} placeholder="https://acme.com" className="bg-secondary border-border mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Logo URL</Label>
                  <Input value={orgLogo} onChange={(e) => setOrgLogo(e.target.value)} placeholder="https://acme.com/logo.png" className="bg-secondary border-border mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} placeholder="A brief description..." className="bg-secondary border-border mt-1 resize-none" rows={3} />
                </div>
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl bg-card border border-border glow-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="p-5 overflow-x-auto text-sm font-mono text-foreground leading-relaxed min-h-[300px]">
                {generatedSchema}
              </pre>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="validator">
          <div className="space-y-6">
            <div className="rounded-xl bg-card border border-border glow-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground text-sm">Paste your schema markup</h2>
              <Textarea
                value={pastedSchema}
                onChange={(e) => { setPastedSchema(e.target.value); setValidationResult(null); }}
                placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                className="bg-secondary border-border font-mono text-sm resize-none"
                rows={10}
              />
              <Button onClick={handleValidate} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Validate Schema
              </Button>
            </div>

            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border p-5 ${validationResult.valid ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {validationResult.valid ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                  <h3 className="font-semibold text-foreground">
                    {validationResult.valid ? "Schema is valid!" : `${validationResult.errors.length} issue${validationResult.errors.length !== 1 ? "s" : ""} found`}
                  </h3>
                </div>
                {validationResult.errors.length > 0 && (
                  <ul className="space-y-1.5">
                    {validationResult.errors.map((err, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span> {err}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaBuilder;
