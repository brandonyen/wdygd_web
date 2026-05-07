import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ProductivityGarden } from "./ProductivityGarden";
import { AISummary, type Summary } from "./AISummary";
import { useConnectedIntegrations } from "../integrationsContext";
import { getCurrentIdToken } from "../cognitoAuth";
import { useUserProfile } from "../userProfileContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod";

export function Dashboard() {
  const connectedIds = useConnectedIntegrations();
  const [isSyncing, setIsSyncing] = useState(false);
  const [latestSummary, setLatestSummary] = useState<Summary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const { profile } = useUserProfile();

  const fetchLatestSummary = useCallback(async () => {
    if (!profile.userId) return;

    try {
      setIsSummaryLoading(true);
      const token = await getCurrentIdToken();
      const { data } = await axios.get(`${API_BASE_URL}/summary`, {
        params: {
          user_id: profile.userId,
          latest: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle both [obj] and obj responses based on spec ambiguity
      const summary = Array.isArray(data.data) ? data.data[0] : data.data;
      setLatestSummary(summary || null);
    } catch (err) {
      console.error("Failed to fetch latest summary:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [profile.userId]);

  useEffect(() => {
    fetchLatestSummary();
  }, [fetchLatestSummary]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const token = await getCurrentIdToken();
      if (!profile.userId || !token) {
        alert("You must be fully logged in to sync data.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/sync`,
        { user_id: profile.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("Data collection and summary generation started for the past day.");
      // Poll briefly so users see new data appear without manual refresh.
      window.setTimeout(() => {
        void fetchLatestSummary();
      }, 5000);
      window.setTimeout(() => {
        void fetchLatestSummary();
      }, 15000);
      window.setTimeout(() => {
        void fetchLatestSummary();
      }, 30000);
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to sync data.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="max-w-7xl">
          <h1 className="text-4xl mb-2 text-zen-charcoal font-light">
            Your Productivity Garden
          </h1>
          <p className="text-lg text-zen-charcoal-light">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: "var(--zen-sage)", color: "white" }}
        >
          {isSyncing ? "Syncing..." : "Manual Sync"}
        </button>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-12">
        {connectedIds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
            <h2 className="text-2xl font-semibold text-zen-charcoal mb-4">No integrations connected</h2>
            <p className="text-zen-charcoal-light mb-6">
              Please connect an integration in the Settings to see your productivity garden.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="w-full">
              <ProductivityGarden
                activityData={{ github: 0, slack: 0 }}
                enabledIntegrationIds={connectedIds}
              />
            </div>
            
            <div className="max-w-4xl mx-auto">
              <AISummary summary={latestSummary} isLoading={isSummaryLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
