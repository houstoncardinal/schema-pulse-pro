import { motion } from "framer-motion";
import { Settings, User, Key, CreditCard, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppSettings = () => {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Key className="w-4 h-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border glow-card p-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input defaultValue="John Doe" className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input defaultValue="john@example.com" className="bg-secondary border-border mt-1" />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="api">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border glow-card p-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">API Key</Label>
              <div className="flex gap-2 mt-1">
                <Input defaultValue="sp_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="bg-secondary border-border font-mono text-sm" />
                <Button variant="outline" size="sm" className="border-border text-muted-foreground">Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Use this key to access the SchemaPulse API programmatically.</p>
            </div>
            <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">Regenerate Key</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border glow-card p-6 space-y-5">
            {[
              { label: "Audit complete notifications", desc: "Get notified when an audit finishes", defaultChecked: true },
              { label: "Weekly SEO digest", desc: "Summary of score changes and new issues", defaultChecked: true },
              { label: "Regression alerts", desc: "Alert when score drops or new critical issues appear", defaultChecked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
