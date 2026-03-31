import { motion } from "motion/react";
import { Checkbox } from "./ui/checkbox";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface LinearTodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
}

export function LinearTodoList({ todos, onToggle }: LinearTodoListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 style={{ color: 'var(--zen-charcoal)' }}>Your Linear Tasks</h3>
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
            style={{ backgroundColor: todo.completed ? 'var(--zen-sand-light)' : 'white' }}
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
