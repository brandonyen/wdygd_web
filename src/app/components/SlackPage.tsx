import { motion } from "motion/react";
import { MessageSquare, Hash, Users, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  channel: string;
  preview: string;
  time: string;
  replies: number;
}

interface Channel {
  name: string;
  messages: number;
  color: string;
}

export function SlackPage() {
  // Mock data
  const messages: Message[] = [
    {
      id: "1",
      channel: "#engineering",
      preview: "Just merged the authentication refactor PR...",
      time: "10m ago",
      replies: 3,
    },
    {
      id: "2",
      channel: "#product",
      preview: "Updated the roadmap for Q2, check it out...",
      time: "45m ago",
      replies: 7,
    },
    {
      id: "3",
      channel: "#design",
      preview: "New mockups for the dashboard are ready...",
      time: "1h ago",
      replies: 12,
    },
    {
      id: "4",
      channel: "#engineering",
      preview: "Anyone available to review my PR?",
      time: "2h ago",
      replies: 2,
    },
    {
      id: "5",
      channel: "#random",
      preview: "Great team lunch today! 🍕",
      time: "3h ago",
      replies: 15,
    },
    {
      id: "6",
      channel: "#product",
      preview: "Customer feedback summary for last week...",
      time: "4h ago",
      replies: 5,
    },
  ];

  const topChannels: Channel[] = [
    { name: "#engineering", messages: 34, color: "var(--zen-blue)" },
    { name: "#product", messages: 18, color: "var(--zen-purple)" },
    { name: "#design", messages: 12, color: "var(--zen-sage)" },
    { name: "#random", messages: 8, color: "var(--zen-sand)" },
  ];

  const stats = {
    messages: 72,
    channels: 12,
    replies: 28,
    mentions: 15,
  };

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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Messages
              </span>
              <MessageSquare
                className="w-4 h-4"
                style={{ color: "var(--zen-blue)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.messages}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Channels
              </span>
              <Hash className="w-4 h-4" style={{ color: "var(--zen-blue)" }} />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.channels}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Replies
              </span>
              <Users className="w-4 h-4" style={{ color: "var(--zen-blue)" }} />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.replies}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Mentions
              </span>
              <TrendingUp
                className="w-4 h-4"
                style={{ color: "var(--zen-blue)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.mentions}
            </p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:flex-1 lg:min-h-0">
          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 pl-8 pt-8 pb-8 pr-6 rounded-3xl space-y-6 max-h-[52vh] flex flex-col lg:min-h-0"
            style={{ backgroundColor: "var(--card)" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Recent Messages</h3>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0 pr-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl border hover:shadow-sm transition-shadow"
                  style={{
                    borderColor: "var(--zen-sand)",
                    backgroundColor: "var(--zen-off-white)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: "var(--zen-blue)" }}
                    >
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-sm"
                          style={{ color: "var(--zen-blue)" }}
                        >
                          {message.channel}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: "var(--zen-charcoal-light)" }}
                        >
                          {message.time}
                        </span>
                      </div>
                      <p
                        className="mb-2 line-clamp-2"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        {message.preview}
                      </p>
                      <div
                        className="flex items-center gap-1 text-sm"
                        style={{ color: "var(--zen-charcoal-light)" }}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{message.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Channels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pl-8 pt-8 pb-8 pr-6 rounded-3xl space-y-6 max-h-[52vh] flex flex-col lg:min-h-0"
            style={{ backgroundColor: "var(--card)" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Top Channels</h3>
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0 pr-3">
              {topChannels.map((channel, index) => (
                <motion.div
                  key={channel.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash
                        className="w-4 h-4"
                        style={{ color: channel.color }}
                      />
                      <span style={{ color: "var(--zen-charcoal)" }}>
                        {channel.name}
                      </span>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "var(--zen-charcoal-light)" }}
                    >
                      {channel.messages}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--zen-sand-light)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(channel.messages / topChannels[0].messages) * 100}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + index * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity Summary */}
            <div
              className="pt-4 border-t"
              style={{ borderColor: "var(--zen-sand)" }}
            >
              <p
                className="text-sm mb-3"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Today's Activity
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--zen-charcoal-light)" }}>
                    Most active time
                  </span>
                  <span style={{ color: "var(--zen-charcoal)" }}>
                    2pm - 4pm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--zen-charcoal-light)" }}>
                    Response rate
                  </span>
                  <span style={{ color: "var(--zen-charcoal)" }}>87%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--zen-charcoal-light)" }}>
                    Avg. response time
                  </span>
                  <span style={{ color: "var(--zen-charcoal)" }}>12 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
