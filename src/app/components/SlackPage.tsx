import { motion } from "motion/react";
import { MessageSquare, Hash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useIntegrationStatus } from "../integrationsContext";

function formatConnectedDate(value: string): string {
  if (!value) return "Unknown date";

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    const epochMs = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
    const epochDate = new Date(epochMs);
    if (!Number.isNaN(epochDate.getTime())) {
      return epochDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SlackPage() {
  const status = useIntegrationStatus("slack");
  const isConnected = status?.connected === true;
  const workspaces = status?.workspaces ?? [];
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (workspaces.length === 0) {
      setSelectedWorkspaceId(null);
      return;
    }
    setSelectedWorkspaceId((current) => {
      if (current && workspaces.some((ws) => ws.workspaceId === current)) {
        return current;
      }
      return workspaces[0]?.workspaceId ?? null;
    });
  }, [workspaces]);

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((ws) => ws.workspaceId === selectedWorkspaceId) ??
      workspaces[0],
    [workspaces, selectedWorkspaceId],
  );

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
          <div className="text-center py-20 bg-card text-card-foreground rounded-3xl border border-border">
            <h2 className="text-2xl font-semibold mb-4">Slack is not connected</h2>
            <p className="text-muted-foreground">Please connect Slack in Settings to see your activity.</p>
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
              
              <div className="space-y-6">
                {workspaces.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Connected Workspaces</h3>

                    <div className="mb-4">
                      <label
                        htmlFor="workspace-select"
                        className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2"
                      >
                        Select Workspace
                      </label>
                      <select
                        id="workspace-select"
                        value={selectedWorkspace?.workspaceId ?? ""}
                        onChange={(event) => setSelectedWorkspaceId(event.target.value)}
                        className="w-full sm:w-auto min-w-[260px] rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground"
                      >
                        {workspaces.map((ws) => (
                          <option key={ws.workspaceId} value={ws.workspaceId}>
                            {ws.workspaceName || ws.workspaceId}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {workspaces.map((ws) => (
                        <button
                          type="button"
                          key={ws.workspaceId}
                          onClick={() => setSelectedWorkspaceId(ws.workspaceId)}
                          className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                            selectedWorkspace?.workspaceId === ws.workspaceId
                              ? "bg-zen-blue text-white border-zen-blue"
                              : "bg-card text-card-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {selectedWorkspace?.workspaceId === ws.workspaceId
                            ? `Selected: ${ws.workspaceName || ws.workspaceId}`
                            : `Select ${ws.workspaceName || ws.workspaceId}`}
                        </button>
                      ))}
                    </div>

                    {selectedWorkspace && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
                        <div className="w-8 h-8 rounded-lg bg-zen-blue/10 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-zen-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">
                            {selectedWorkspace.workspaceName || selectedWorkspace.workspaceId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Connected on {formatConnectedDate(selectedWorkspace.connectedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="text-center py-12 bg-muted rounded-3xl border border-dashed border-border">
              <h3 className="text-lg font-medium text-card-foreground mb-2">No message data available yet</h3>
              <p className="text-muted-foreground">Your workspaces are linked, and we're currently indexing your recent activity.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
