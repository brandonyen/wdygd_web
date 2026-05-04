import { motion } from "motion/react";
import { MessageSquare, Hash, Users, TrendingUp } from "lucide-react";
import { useConnectedIntegrations } from "../integrationsContext";

export function SlackPage() {
  const connectedIds = useConnectedIntegrations();
  const isConnected = connectedIds.includes("slack");

  return (
    <div className="overflow-y-auto px-8 py-8">
      <div className="max-w-7xl mx-auto lg:h-full flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--zen-blue)" }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-4xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              Slack Activity
            </h1>
          </div>
          <p
            className="text-lg ml-15"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Your conversations and team collaboration
          </p>
        </motion.div>

        {!isConnected ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
            <h2 className="text-2xl font-semibold text-zen-charcoal mb-4">Slack is not connected</h2>
            <p className="text-zen-charcoal-light">Please connect Slack in Settings to see your activity.</p>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
            <h2 className="text-2xl font-semibold text-zen-charcoal mb-4">No data available</h2>
            <p className="text-zen-charcoal-light">Slack is connected, but no activity data is available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
