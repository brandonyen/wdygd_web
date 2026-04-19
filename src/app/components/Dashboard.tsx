import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ProductivityGarden } from "./ProductivityGarden";
import { LinearTodoList } from "./LinearTodoList";
import { AISummary } from "./AISummary";
import { useConnectedIntegrations } from "../integrationsContext";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export function Dashboard() {
  const connectedIds = useConnectedIntegrations();

  // Mock activity data
  const activityData = {
    github: 75,
    slack: 60,
    linear: 85,
  };

  // Mock to-do items
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      title: "Review PR for authentication refactor",
      completed: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Update API documentation",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      title: "Fix responsive layout on dashboard",
      completed: false,
      priority: "high",
    },
    {
      id: "4",
      title: "Team sync meeting at 2pm",
      completed: true,
      priority: "low",
    },
    {
      id: "5",
      title: "Investigate performance issues in prod",
      completed: false,
      priority: "high",
    },
    {
      id: "6",
      title: "Write unit tests for new feature",
      completed: false,
      priority: "medium",
    },
  ]);

  const summary = useMemo(() => {
    const bySource: Record<string, string> = {
      github:
        "Merged 3 pull requests related to the authentication system refactor, improving security and code maintainability",
      slack:
        "Participated in 12 Slack discussions across #engineering and #product channels, helping unblock teammates",
      linear:
        "Completed 4 high-priority Linear tickets, including fixing critical bugs in the payment flow",
    };
    const generic = [
      "Reviewed and provided feedback on 5 PRs from team members",
      "Updated project documentation for the new API endpoints",
    ];
    return [
      ...connectedIds.map((id) => bySource[id]).filter(Boolean),
      ...generic,
    ];
  }, [connectedIds]);

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl mb-2 text-zen-charcoal font-light">
            Your Productivity Garden
          </h1>
          <p className="text-lg text-zen-charcoal-light">
            Friday, February 20, 2026
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Garden overview: garden + tasks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 min-w-0">
            <ProductivityGarden
              activityData={activityData}
              enabledIntegrationIds={connectedIds}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="lg:col-span-1 p-8 rounded-3xl bg-card lg:sticky lg:top-24"
          >
            <LinearTodoList
              todos={todos}
              onToggle={handleToggleTodo}
              connectedIntegrationIds={connectedIds}
            />
          </motion.div>
        </motion.section>

        {/* AI Summary */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <AISummary summary={summary} />
        </motion.section>
      </div>
    </div>
  );
}
