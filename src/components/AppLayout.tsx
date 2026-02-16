import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Code,
  AlertTriangle,
  Map,
  BookOpen,
  Hammer,
  Settings,
  Zap,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/app/audit/new", icon: Search, label: "New Audit" },
  { to: "/app/results", icon: Code, label: "Results" },
  { to: "/app/issues", icon: AlertTriangle, label: "Issues" },
  { to: "/app/schema-library", icon: BookOpen, label: "Schema Library" },
  { to: "/app/schema-builder", icon: Hammer, label: "Schema Builder" },
  { to: "/app/roadmap", icon: Map, label: "Roadmap" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground text-lg tracking-tight">
                Schema<span className="text-primary">Pulse</span>
              </span>
            </div>
          </button>
        </div>

        {/* New Audit Button */}
        <div className="p-4">
          <Button
            onClick={() => navigate("/app/audit/new")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            New Audit
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-muted-foreground font-medium">Free Plan</p>
            <p className="text-xs text-muted-foreground mt-1">3 / 5 audits used</p>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
