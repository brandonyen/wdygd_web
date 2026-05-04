import { motion } from "motion/react";
import { Copy, Check, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useConnectedIntegrations } from "../integrationsContext";

export function AISummary() {
  const [copied, setCopied] = useState(false);
  const connectedIds = useConnectedIntegrations();

  const handleCopy = () => {
    // If we had data, we would copy it here
    navigator.clipboard.writeText("No data available to copy.");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span>Last updated Never</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Next update at N/A</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          disabled={true}
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

      <div className="space-y-4 pt-2">
        {connectedIds.length === 0 ? (
          <p className="text-zen-charcoal-light">No integrations connected.</p>
        ) : (
          <p className="text-zen-charcoal-light">No data available from integrations yet.</p>
        )}
      </div>
    </motion.div>
  );
}
