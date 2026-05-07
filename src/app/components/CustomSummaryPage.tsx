import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { Calendar as CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { AISummary, type Summary } from "./AISummary";
import { getCurrentIdToken } from "../cognitoAuth";
import { useUserProfile } from "../userProfileContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod";

export function CustomSummaryPage() {
  const { profile } = useUserProfile();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both a start and end date.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const token = await getCurrentIdToken();

      if (!profile.userId || !token) {
        setError("You must be logged in to generate a summary.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/summary`,
        {
          user_id: profile.userId,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          summary_type: "USER_GENERATED"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.data) {
        setSummary(response.data.data);
      } else {
        setError("Failed to generate summary. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--zen-sand-light)" }}
            >
              <Sparkles className="w-6 h-6 text-zen-charcoal" />
            </div>
            <h1
              className="text-4xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              Custom Summaries
            </h1>
          </div>
          <p
            className="text-lg ml-15"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Generate a summary for a specific time period
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm"
        >
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zen-charcoal flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zen-sand focus:outline-none focus:ring-2 focus:ring-zen-sage text-zen-charcoal bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zen-charcoal flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zen-sand focus:outline-none focus:ring-2 focus:ring-zen-sage text-zen-charcoal bg-white"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isGenerating || !startDate || !endDate}
              className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--zen-sage)", color: "white" }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Summary"
              )}
            </button>
          </form>
        </motion.div>

        {summary && (
          <div className="mt-8">
            <AISummary summary={summary} isLoading={isGenerating} />
          </div>
        )}
      </div>
    </div>
  );
}
