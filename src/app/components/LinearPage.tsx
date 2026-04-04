import { motion } from "motion/react";
import { Target, Circle, CheckCircle2, Clock, Zap } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  project: string;
  time: string;
}

interface Project {
  name: string;
  completed: number;
  total: number;
  color: string;
}

export function LinearPage() {
  // Mock data
  const issues: Issue[] = [
    { id: "1", title: "Implement real-time notifications", status: "done", priority: "high", assignee: "You", project: "Backend", time: "Completed 2h ago" },
    { id: "2", title: "Design system documentation", status: "in-progress", priority: "medium", assignee: "You", project: "Documentation", time: "Started 3h ago" },
    { id: "3", title: "Fix payment gateway timeout", status: "done", priority: "urgent", assignee: "You", project: "Backend", time: "Completed 4h ago" },
    { id: "4", title: "Mobile app performance optimization", status: "in-progress", priority: "high", assignee: "You", project: "Mobile", time: "Started yesterday" },
    { id: "5", title: "Add user analytics dashboard", status: "todo", priority: "medium", assignee: "You", project: "Frontend", time: "Created 2d ago" },
    { id: "6", title: "Update API rate limiting", status: "done", priority: "medium", assignee: "You", project: "Backend", time: "Completed 1d ago" },
  ];

  const projects: Project[] = [
    { name: "Backend", completed: 8, total: 12, color: "var(--zen-purple)" },
    { name: "Frontend", completed: 6, total: 10, color: "var(--zen-sage)" },
    { name: "Mobile", completed: 4, total: 8, color: "var(--zen-blue)" },
    { name: "Documentation", completed: 3, total: 5, color: "var(--zen-sand)" },
  ];

  const stats = {
    completed: 11,
    inProgress: 5,
    todo: 8,
    cycleTime: "2.3 days",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "#e07b7b";
      case "high": return "var(--zen-purple)";
      case "medium": return "var(--zen-blue)";
      case "low": return "var(--zen-sage)";
      default: return "var(--zen-charcoal-light)";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "todo": return <Circle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen px-8 py-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--zen-purple)' }}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>
              Linear Activity
            </h1>
          </div>
          <p className="text-lg ml-15" style={{ color: 'var(--zen-charcoal-light)' }}>
            Your issues and project progress
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>Completed</span>
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--zen-sage)' }} />
            </div>
            <p className="text-3xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>{stats.completed}</p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>In Progress</span>
              <Clock className="w-4 h-4" style={{ color: 'var(--zen-purple)' }} />
            </div>
            <p className="text-3xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>{stats.inProgress}</p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>To Do</span>
              <Circle className="w-4 h-4" style={{ color: 'var(--zen-blue)' }} />
            </div>
            <p className="text-3xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>{stats.todo}</p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>Cycle Time</span>
              <Zap className="w-4 h-4" style={{ color: 'var(--zen-sage)' }} />
            </div>
            <p className="text-3xl" style={{ color: 'var(--zen-charcoal)', fontWeight: 300 }}>{stats.cycleTime}</p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 p-8 rounded-3xl space-y-6"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 style={{ color: 'var(--zen-charcoal)' }}>Recent Issues</h3>
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl border hover:shadow-sm transition-shadow"
                  style={{ 
                    borderColor: 'var(--zen-sand)', 
                    backgroundColor: issue.status === 'done' ? 'var(--zen-sand-light)' : 'var(--zen-off-white)' 
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" 
                      style={{ 
                        backgroundColor: issue.status === 'done' 
                          ? 'var(--zen-sage-light)' 
                          : issue.status === 'in-progress'
                          ? 'var(--zen-purple)'
                          : 'var(--zen-blue)',
                        color: 'white'
                      }}
                    >
                      {getStatusIcon(issue.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className={`text-sm ${issue.status === 'done' ? 'line-through opacity-60' : ''}`}
                          style={{ color: 'var(--zen-charcoal)' }}
                        >
                          {issue.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        <span 
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ 
                            backgroundColor: getPriorityColor(issue.priority),
                            color: 'white'
                          }}
                        >
                          {issue.priority}
                        </span>
                        <span style={{ color: 'var(--zen-charcoal-light)' }}>
                          {issue.project}
                        </span>
                        <span style={{ color: 'var(--zen-charcoal-light)' }}>•</span>
                        <span style={{ color: 'var(--zen-charcoal-light)' }}>
                          {issue.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Project Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl space-y-6"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 style={{ color: 'var(--zen-charcoal)' }}>Project Progress</h3>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--zen-charcoal)' }}>{project.name}</span>
                    <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>
                      {project.completed}/{project.total}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--zen-sand-light)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(project.completed / project.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <p className="text-xs text-right" style={{ color: 'var(--zen-charcoal-light)' }}>
                      {Math.round((project.completed / project.total) * 100)}% complete
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Velocity */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--zen-sand)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--zen-charcoal-light)' }}>
                This Week
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--zen-charcoal-light)' }}>Issues closed</span>
                  <span style={{ color: 'var(--zen-charcoal)' }}>11</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--zen-charcoal-light)' }}>Issues created</span>
                  <span style={{ color: 'var(--zen-charcoal)' }}>8</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--zen-charcoal-light)' }}>Velocity</span>
                  <span style={{ color: 'var(--zen-sage)' }}>+15%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
