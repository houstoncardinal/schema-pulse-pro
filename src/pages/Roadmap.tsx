import { useState } from "react";
import { motion } from "framer-motion";
import { Map, CheckCircle, Circle, Clock, Zap, Code, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockRoadmapTasks, mockScores } from "@/lib/mock-data";
import ScoreRing from "@/components/ScoreRing";

const categoryIcons: Record<string, typeof Zap> = {
  "Quick Win": Zap,
  "Developer Task": Code,
  "Content Task": FileText,
};

const categoryColors: Record<string, string> = {
  "Quick Win": "bg-success/10 text-success border-success/20",
  "Developer Task": "bg-primary/10 text-primary border-primary/20",
  "Content Task": "bg-warning/10 text-warning border-warning/20",
};

const Roadmap = () => {
  const [tasks, setTasks] = useState(mockRoadmapTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t))
    );
  };

  const completedImpact = tasks.filter((t) => t.status === "done").reduce((sum, t) => sum + t.impact, 0);
  const projectedScore = Math.min(100, mockScores.overall + completedImpact);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Roadmap to 100%</h1>
        <p className="text-muted-foreground text-sm mt-1">Prioritized tasks to maximize your SEO score.</p>
      </div>

      {/* Score Projection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card border border-border glow-card p-6 flex flex-col sm:flex-row items-center gap-8"
      >
        <div className="flex items-center gap-8">
          <div className="text-center">
            <ScoreRing score={mockScores.overall} size={100} strokeWidth={8} label="Current" />
          </div>
          <TrendingUp className="w-6 h-6 text-primary" />
          <div className="text-center">
            <ScoreRing score={projectedScore} size={100} strokeWidth={8} label="Projected" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground font-medium">
            Complete all tasks to gain up to <span className="text-primary font-bold">+{tasks.reduce((s, t) => s + t.impact, 0)} points</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tasks.filter((t) => t.status === "done").length} of {tasks.length} tasks completed
          </p>
          <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(tasks.filter((t) => t.status === "done").length / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map((task, i) => {
          const Icon = categoryIcons[task.category] || Zap;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-5 transition-all cursor-pointer ${
                task.status === "done"
                  ? "bg-success/5 border-success/20 opacity-70"
                  : "bg-card border-border glow-card hover:glow-card-hover"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {task.status === "done" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </span>
                    <Badge variant="outline" className={categoryColors[task.category]}>
                      <Icon className="w-3 h-3 mr-1" /> {task.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.estimatedTime}</span>
                    <span>Impact: <span className="text-primary font-medium">+{task.impact} pts</span></span>
                    <span>Effort: <span className="capitalize">{task.effort}</span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground gap-2">
          Export as PDF
        </Button>
        <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground gap-2">
          Export as JSON
        </Button>
      </div>
    </div>
  );
};

export default Roadmap;
