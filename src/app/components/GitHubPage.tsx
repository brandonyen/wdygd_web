import { motion } from "motion/react";
import { GitBranch, Clock } from "lucide-react";
import { useIntegrationStatus } from "../integrationsContext";

export function GitHubPage() {
  const status = useIntegrationStatus("github");
  const isConnected = status?.connected === true;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="px-8 py-8">
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
              style={{ backgroundColor: "var(--zen-sage-light)" }}
            >
              <GitBranch
                className="w-6 h-6"
                style={{ color: "var(--zen-sage-dark)" }}
              />
            </div>
            <h1
              className="text-4xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              GitHub Activity
            </h1>
          </div>
          <p
            className="text-lg ml-15"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Your code contributions and collaboration
          </p>
        </motion.div>

        {!isConnected ? (
          <div className="text-center py-20 bg-card text-card-foreground rounded-3xl border border-border">
            <h2 className="text-2xl font-semibold mb-4">GitHub is not connected</h2>
            <p className="text-muted-foreground">Please connect GitHub in Settings to see your activity.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-card text-card-foreground border border-border shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connection Status: Connected
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {status?.tokenExpiration && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Token Expiration
                    </p>
                    <p className="text-lg text-card-foreground font-medium">
                      {formatDate(status.tokenExpiration)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="text-center py-12 bg-muted rounded-3xl border border-dashed border-border">
              <h3 className="text-lg font-medium text-card-foreground mb-2">No activity data available yet</h3>
              <p className="text-muted-foreground">We've successfully linked your account, but your contribution data is still being processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
