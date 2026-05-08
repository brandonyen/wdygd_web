import { motion } from "motion/react";
import { MessageSquare, Hash } from "lucide-react";
import { useIntegrationStatus } from "../integrationsContext";
import { useLatestSummary } from "../hooks/useLatestSummary";

export function SlackPage() {
  const status = useIntegrationStatus("slack");
  const isConnected = status?.connected === true;
  const { latestSummary, isSummaryLoading } = useLatestSummary();

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
          <div className="text-center py-20 rounded-3xl border border-border bg-card">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Slack is not connected</h2>
            <p className="text-muted-foreground">Please connect Slack in Settings to see your activity.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm"
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connection Status: Connected
              </h2>
              
              <div className="space-y-6">
                {status?.workspaces && status.workspaces.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Connected Workspaces</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {status.workspaces.map((ws) => (
                        <div key={ws.workspaceId} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                          <div className="w-8 h-8 rounded-lg bg-zen-blue/10 flex items-center justify-center">
                            <Hash className="w-4 h-4 text-zen-blue" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-foreground">{ws.workspaceName || ws.workspaceId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {isSummaryLoading ? (
              <div className="text-center py-12 bg-muted/50 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground animate-pulse">Loading activity...</p>
              </div>
            ) : latestSummary?.slack_content_array && latestSummary.slack_content_array.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4"
              >
                <h3 className="text-lg font-medium text-card-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {latestSummary.slack_content_array.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zen-blue mt-2 shrink-0" />
                      <p className="text-card-foreground leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-3xl border border-dashed border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-2">No message data available yet</h3>
                <p className="text-muted-foreground">Your workspaces are linked, and we're currently indexing your recent activity.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
