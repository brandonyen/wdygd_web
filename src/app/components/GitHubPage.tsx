import { motion } from "motion/react";
import { GitBranch, Clock } from "lucide-react";
import { useIntegrationStatus } from "../integrationsContext";
import { useLatestSummary } from "../hooks/useLatestSummary";

export function GitHubPage() {
  const status = useIntegrationStatus("github");
  const isConnected = status?.connected === true;
  const { latestSummary, isSummaryLoading } = useLatestSummary();
  const githubMetrics = latestSummary?.github_metrics;

  const formatCount = (value?: number) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

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
          <div className="text-center py-20 rounded-3xl border border-border bg-card">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">GitHub is not connected</h2>
            <p className="text-muted-foreground">Please connect GitHub in Settings to see your activity.</p>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm"
            >
              <h3 className="text-lg font-medium text-card-foreground mb-4">Summary Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Commits</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.commits)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">PRs Opened</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.prsOpened)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">PRs Merged</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.prsMerged)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">PRs Closed</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.prsClosed)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Reviews</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.totalReviews)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Issues Opened</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.totalIssuesOpened)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Issues Closed</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.totalIssuesClosed)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Tracked Repos</p>
                  <p className="mt-1 text-2xl font-semibold text-card-foreground">{formatCount(githubMetrics?.repos?.length)}</p>
                </div>
              </div>
            </motion.div>

            {isSummaryLoading ? (
              <div className="text-center py-12 bg-muted/50 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground animate-pulse">Loading activity...</p>
              </div>
            ) : latestSummary?.github_content_array && latestSummary.github_content_array.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4"
              >
                <h3 className="text-lg font-medium text-card-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {latestSummary.github_content_array.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zen-sage mt-2 shrink-0" />
                      <p className="text-card-foreground leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-3xl border border-dashed border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-2">No activity data available yet</h3>
                <p className="text-muted-foreground">We've successfully linked your account, but your contribution data is still being processed.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
