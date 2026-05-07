import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { getCurrentIdToken } from "../cognitoAuth";
import { useUserProfile } from "../userProfileContext";
import { type Summary } from "../components/AISummary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod";

export function useLatestSummary() {
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

  return { latestSummary, isSummaryLoading, fetchLatestSummary };
}
