import { motion } from "motion/react";
import { Copy, Check, Calendar, Sparkles, Clock } from "lucide-react";
import { useState } from "react";

interface AISummaryProps {
  summary: string[];
}

export function AISummary({ summary }: AISummaryProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(summary);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const timePeriods = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const handleCopy = () => {
    const text = currentSummary.map((item) => `• ${item}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate API call with mock data based on selected period
    setTimeout(() => {
      let newSummary: string[] = [];

      switch (selectedPeriod) {
        case "today":
          newSummary = [
            "Merged 3 pull requests related to the authentication system refactor, improving security and code maintainability",
            "Participated in 12 Slack discussions across #engineering and #product channels, helping unblock teammates",
            "Completed 4 high-priority Linear tickets, including fixing critical bugs in the payment flow",
            "Reviewed and provided feedback on 5 PRs from team members",
            "Updated project documentation for the new API endpoints",
          ];
          break;
        case "yesterday":
          newSummary = [
            "Implemented new dashboard widgets with improved user interaction patterns",
            "Led architecture discussion for the upcoming mobile app redesign",
            "Resolved 3 critical production incidents affecting payment processing",
            "Mentored junior developer on React best practices during pair programming session",
            "Completed sprint planning and estimated 15 tickets for next iteration",
          ];
          break;
        case "week":
          newSummary = [
            "Shipped 2 major features: real-time notifications system and advanced search functionality",
            "Merged 18 pull requests across backend and frontend repositories",
            "Actively participated in 45+ Slack conversations, providing technical guidance to team members",
            "Completed 12 Linear tickets including 6 high-priority items",
            "Conducted 3 technical interviews for senior engineer positions",
            "Reviewed 20+ PRs from team members with detailed feedback",
            "Reduced API response time by 40% through database query optimization",
          ];
          break;
        case "month":
          newSummary = [
            "Led development of authentication system overhaul, improving security and user experience",
            "Delivered 4 major features and 23 improvements across web and mobile platforms",
            "Maintained 95% code review participation rate with an average turnaround of 4 hours",
            "Completed 48 Linear tickets with 100% on-time delivery for critical issues",
            "Contributed to 180+ Slack discussions, establishing yourself as a go-to technical resource",
            "Reduced production incidents by 60% through improved monitoring and error handling",
            "Mentored 2 junior developers and conducted 8 technical interviews",
            "Published 5 technical documentation articles for internal knowledge base",
          ];
          break;
      }

      setCurrentSummary(newSummary);
      setLastUpdated(new Date());
      setIsGenerating(false);
    }, 1500);
  };

  const getPeriodTitle = () => {
    const period = timePeriods.find((p) => p.value === selectedPeriod);
    return period ? `${period.label}'s Accomplishments` : "Accomplishments";
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000); // difference in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getNextUpdate = () => {
    const nextUpdate = new Date(lastUpdated);
    nextUpdate.setHours(nextUpdate.getHours() + 1);
    return nextUpdate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-8 rounded-3xl bg-white space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-zen-charcoal">{getPeriodTitle()}</h3>
          <div className="flex items-center gap-4 text-xs text-zen-charcoal-light">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last updated {getTimeAgo()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Next update at {getNextUpdate()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:shadow-md bg-zen-sand-light text-zen-charcoal data-[copied=true]:bg-zen-sage data-[copied=true]:text-white"
          data-copied={copied}
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

      {/* Time Period Selector */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className="px-4 py-2 rounded-full text-sm transition-all duration-200 bg-zen-sand-light text-zen-charcoal data-[selected=true]:bg-zen-sage data-[selected=true]:text-white"
              data-selected={selectedPeriod === period.value}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 bg-zen-purple text-white"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 pt-2">
        {currentSummary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            className="flex gap-3"
          >
            <span className="text-zen-sage">•</span>
            <p className="text-zen-charcoal leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-sm pt-4 italic text-zen-charcoal-light"
      >
        Generated by AI from your GitHub commits, Slack messages, and Linear
        updates
      </motion.p>
    </motion.div>
  );
}
