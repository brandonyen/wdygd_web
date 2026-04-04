import { motion } from "motion/react";
import { Link } from "react-router";
import { Github, MessageSquare, Target, Plug } from "lucide-react";
import { useIntegrations, type IntegrationId } from "../integrationsContext";

const META: Record<
  IntegrationId,
  {
    name: string;
    description: string;
    accentVar: string;
    Icon: typeof Github;
  }
> = {
  github: {
    name: "GitHub",
    description:
      "Connect GitHub to passively track commits, pull requests, and reviews in your garden.",
    accentVar: "var(--zen-sage)",
    Icon: Github,
  },
  slack: {
    name: "Slack",
    description:
      "Connect Slack so we can summarize your contributions in channels and threads.",
    accentVar: "var(--zen-blue)",
    Icon: MessageSquare,
  },
  linear: {
    name: "Linear",
    description:
      "Connect Linear to sync issues and completed work into your daily picture.",
    accentVar: "var(--zen-purple)",
    Icon: Target,
  },
};

export function ConnectIntegrationPage({
  integrationId,
}: {
  integrationId: IntegrationId;
}) {
  const { connectIntegration } = useIntegrations();
  const { name, description, accentVar, Icon } = META[integrationId];

  const handleConnect = () => {
    connectIntegration(integrationId);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-8 py-16 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg w-full text-center space-y-8"
      >
        <div
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: accentVar }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-3">
          <h1
            className="text-3xl md:text-4xl font-light tracking-tight"
            style={{ color: "var(--zen-charcoal)" }}
          >
            Connect {name}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <motion.button
            type="button"
            onClick={handleConnect}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white text-sm font-medium transition-all"
            style={{ backgroundColor: accentVar }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plug className="w-4 h-4" />
            Connect {name}
          </motion.button>
          <Link
            to="/profile"
            className="text-sm underline-offset-4 hover:underline"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Manage integrations in settings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
