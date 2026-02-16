import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import NewAudit from "./pages/NewAudit";
import AuditResults from "./pages/AuditResults";
import Issues from "./pages/Issues";
import SchemaLibrary from "./pages/SchemaLibrary";
import SchemaBuilder from "./pages/SchemaBuilder";
import Roadmap from "./pages/Roadmap";
import AppSettings from "./pages/AppSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="audit/new" element={<NewAudit />} />
            <Route path="results" element={<AuditResults />} />
            <Route path="issues" element={<Issues />} />
            <Route path="schema-library" element={<SchemaLibrary />} />
            <Route path="schema-builder" element={<SchemaBuilder />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="settings" element={<AppSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
