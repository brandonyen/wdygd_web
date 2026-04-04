import { motion } from "motion/react";
import { Github, Check } from "lucide-react";
import { useState } from "react";
import type { IntegrationId } from "../integrationsContext";

interface IntegrationOnboardingPageProps {
  onContinue: (integrations: IntegrationId[]) => void;
}

export function IntegrationOnboardingPage({
  onContinue,
}: IntegrationOnboardingPageProps) {
  const [selectedIntegrations, setSelectedIntegrations] = useState<
    Set<IntegrationId>
  >(new Set());

  const toggleIntegration = (integration: IntegrationId) => {
    const newSelected = new Set(selectedIntegrations);
    if (newSelected.has(integration)) {
      newSelected.delete(integration);
    } else {
      newSelected.add(integration);
    }
    setSelectedIntegrations(newSelected);
  };

  const handleContinue = () => {
    if (selectedIntegrations.size > 0) {
      onContinue(Array.from(selectedIntegrations));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center space-y-16"
      >
        <div className="space-y-6">
          <h1
            className="text-5xl md:text-6xl tracking-tight"
            style={{
              color: "var(--zen-charcoal)",
              fontWeight: 300,
              lineHeight: 1.2,
            }}
          >
            Focus on your work.
          </h1>
          <p
            className="text-2xl md:text-3xl tracking-wide"
            style={{
              color: "var(--zen-charcoal-light)",
              fontWeight: 300,
            }}
          >
            We&apos;ll remember what you got done.
          </p>
        </div>

        <p className="text-lg" style={{ color: "var(--zen-charcoal-light)" }}>
          Link your tools to passively track accomplishments.
          <br />
          Choose any or all integrations.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 pt-8"
        >
          <button
            type="button"
            onClick={() => toggleIntegration("github")}
            className="w-full max-w-md mx-auto flex items-center justify-between gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: selectedIntegrations.has("github")
                ? "var(--zen-sage)"
                : "var(--card)",
              color: selectedIntegrations.has("github")
                ? "white"
                : "var(--zen-charcoal)",
              border: selectedIntegrations.has("github")
                ? "none"
                : "2px solid var(--zen-sage)",
            }}
          >
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </div>
            {selectedIntegrations.has("github") && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleIntegration("slack")}
            className="w-full max-w-md mx-auto flex items-center justify-between gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: selectedIntegrations.has("slack")
                ? "var(--zen-blue)"
                : "var(--card)",
              color: selectedIntegrations.has("slack")
                ? "white"
                : "var(--zen-charcoal)",
              border: selectedIntegrations.has("slack")
                ? "none"
                : "2px solid var(--zen-blue)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              <span>Slack</span>
            </div>
            {selectedIntegrations.has("slack") && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleIntegration("linear")}
            className="w-full max-w-md mx-auto flex items-center justify-between gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: selectedIntegrations.has("linear")
                ? "var(--zen-purple)"
                : "var(--card)",
              color: selectedIntegrations.has("linear")
                ? "white"
                : "var(--zen-charcoal)",
              border: selectedIntegrations.has("linear")
                ? "none"
                : "2px solid var(--zen-purple)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M0 11.5h24M12 0v24" />
              </svg>
              <span>Linear</span>
            </div>
            {selectedIntegrations.has("linear") && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            )}
          </button>

          <motion.button
            type="button"
            onClick={handleContinue}
            disabled={selectedIntegrations.size === 0}
            className="w-full max-w-md mx-auto px-8 py-4 rounded-full transition-all duration-300 mt-8 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--zen-charcoal)",
              color: "white",
            }}
            whileHover={selectedIntegrations.size > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedIntegrations.size > 0 ? { scale: 0.98 } : {}}
          >
            Continue with {selectedIntegrations.size} integration
            {selectedIntegrations.size !== 1 ? "s" : ""}
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm pt-8"
          style={{ color: "var(--zen-charcoal-light)" }}
        >
          Your data stays private. We only track work activity to help you
          shine.
        </motion.p>
      </motion.div>
    </div>
  );
}
