import { motion } from "motion/react";
import { Copy, Check, Calendar, Clock, List, AlignLeft } from "lucide-react";
import { useState } from "react";
import { useConnectedIntegrations } from "../integrationsContext";

export interface Summary {
  summary_id: string;
  user_id: string;
  summary_type: "DAILY" | "USER_GENERATED";
  created_at: string;
  start_date: string;
  end_date: string;
  content: string;
  content_array?: string[];
  github_content_array?: string[];
  slack_content_array?: string[];
}

interface AISummaryProps {
  summary?: Summary | null;
  isLoading?: boolean;
}

export function AISummary({ summary, isLoading }: AISummaryProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"bullets" | "text">("bullets");
  const connectedIds = useConnectedIntegrations();

  const handleCopy = () => {
    if (!summary) return;
    const text = viewMode === "bullets"
      ? (summary.content_array?.map(i => `• ${i}`).join("\n") || summary.content)
      : summary.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-8 rounded-3xl bg-card space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-zen-charcoal">Accomplishments</h3>
          <div className="flex items-center gap-4 text-xs text-zen-charcoal-light">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {summary 
                  ? `Last updated ${getTimeAgo(summary.created_at)}` 
                  : isLoading ? "Updating..." : "Last updated Never"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {summary 
                  ? new Date(summary.created_at).toLocaleDateString()
                  : "Next update at N/A"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {summary && (
            <div className="flex items-center bg-zen-off-white rounded-full p-1 border border-[#E2E8F0]">
              <button
                onClick={() => setViewMode("bullets")}
                className={`p-1.5 rounded-full transition-colors ${viewMode === "bullets" ? "bg-white shadow-sm text-zen-charcoal" : "text-zen-charcoal-light hover:text-zen-charcoal"}`}
                title="Bullet Points"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("text")}
                className={`p-1.5 rounded-full transition-colors ${viewMode === "text" ? "bg-white shadow-sm text-zen-charcoal" : "text-zen-charcoal-light hover:text-zen-charcoal"}`}
                title="Paragraph"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            disabled={!summary}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:shadow-md bg-zen-sand-light text-zen-charcoal disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy for Standup</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {isLoading ? (
          <p className="text-zen-charcoal-light animate-pulse">Fetching your latest accomplishments...</p>
        ) : summary ? (
          viewMode === "bullets" ? (
            <div className="space-y-3">
              {(summary.content_array || summary.content.split("\n")).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zen-sage mt-2 shrink-0" />
                  <p className="text-zen-charcoal leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zen-charcoal leading-relaxed whitespace-pre-wrap"
            >
              {summary.content}
            </motion.div>
          )
        ) : connectedIds.length === 0 ? (
          <p className="text-zen-charcoal-light">No integrations connected.</p>
        ) : (
          <p className="text-zen-charcoal-light">No data available from integrations yet.</p>
        )}
      </div>
    </motion.div>
  );
}
