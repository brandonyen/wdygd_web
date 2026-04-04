import { motion } from "motion/react";
import { Checkbox } from "./ui/checkbox";
import type { IntegrationId } from "../integrationsContext";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const INTEGRATION_LABELS: Record<IntegrationId, string> = {
  github: "GitHub",
  slack: "Slack",
  linear: "Linear",
};

function taskListHeading(integrationIds: IntegrationId[]): string {
  if (integrationIds.length === 0) {
    return "Your tasks";
  }
  const labels = integrationIds.map((id) => INTEGRATION_LABELS[id]);
  if (labels.length === 1) {
    return `Your ${labels[0]} tasks`;
  }
  if (labels.length === 2) {
    return `Your ${labels[0]} and ${labels[1]} tasks`;
  }
  const rest = labels.slice(0, -1).join(", ");
  const last = labels[labels.length - 1];
  return `Your ${rest}, and ${last} tasks`;
}

interface LinearTodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  /** Connected tools; drives the heading (e.g. "Your GitHub and Slack tasks"). */
  connectedIntegrationIds: IntegrationId[];
}

export function LinearTodoList({
  todos,
  onToggle,
  connectedIntegrationIds,
}: LinearTodoListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h3
          className="text-left leading-snug"
          style={{ color: "var(--zen-charcoal)" }}
        >
          {taskListHeading(connectedIntegrationIds)}
        </h3>
        <span className="text-sm" style={{ color: 'var(--zen-charcoal-light)' }}>
          {todos.filter(t => t.completed).length} of {todos.length}
        </span>
      </div>

      <div className="space-y-3">
        {todos.map((todo, index) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-200 hover:shadow-sm"
            style={{ backgroundColor: todo.completed ? 'var(--zen-sand-light)' : 'var(--card)' }}
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="mt-0.5"
            />
            
            <div className="flex-1 min-w-0">
              <p
                className={`transition-all duration-200 ${
                  todo.completed ? 'line-through opacity-50' : ''
                }`}
                style={{ color: 'var(--zen-charcoal)' }}
              >
                {todo.title}
              </p>
            </div>

            {!todo.completed && (
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                style={{
                  backgroundColor:
                    todo.priority === "high"
                      ? "#e07b7b"
                      : todo.priority === "medium"
                      ? "var(--zen-blue)"
                      : "var(--zen-sage-light)"
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
