import { motion } from "motion/react";
import {
  User,
  Github,
  MessageSquare,
  Target,
  Bell,
  Palette,
  Download,
  LogOut,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useIntegrations } from "../integrationsContext";

const integrationCatalog = [
  {
    id: "github" as const,
    name: "GitHub",
    icon: Github,
    color: "var(--zen-sage)",
  },
  {
    id: "slack" as const,
    name: "Slack",
    icon: MessageSquare,
    color: "var(--zen-blue)",
  },
  {
    id: "linear" as const,
    name: "Linear",
    icon: Target,
    color: "var(--zen-purple)",
  },
];

export function ProfilePage() {
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    achievements: false,
  });

  const { connectedIds, connectIntegration, disconnectIntegration } =
    useIntegrations();
  const connectedIntegrations = useMemo(
    () =>
      integrationCatalog.map((i) => ({
        ...i,
        connected: connectedIds.includes(i.id),
      })),
    [connectedIds],
  );

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--zen-sage)" }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-4xl"
              style={{
                color: "var(--zen-charcoal)",
                fontWeight: 300,
              }}
            >
              Profile & Settings
            </h1>
          </div>
          <p
            className="text-lg ml-15"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-8 rounded-3xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="flex items-start gap-6">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: "var(--zen-sage)" }}
            >
              <span className="text-white">JD</span>
            </div>
            <div className="flex-1">
              <h2
                className="text-2xl mb-1"
                style={{
                  color: "var(--zen-charcoal)",
                  fontWeight: 300,
                }}
              >
                Beabadoobee
              </h2>
              <p
                className="mb-4"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                bea.badoobee@example.com
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: "var(--zen-sage)",
                    color: "white",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: "var(--zen-off-white)",
                    color: "var(--zen-charcoal)",
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connected Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-3xl space-y-6"
          style={{ backgroundColor: "white" }}
        >
          <h3 style={{ color: "var(--zen-charcoal)" }}>
            Connected Integrations
          </h3>
          <div className="space-y-4">
            {connectedIntegrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.05,
                  }}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--zen-off-white)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: integration.color,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        {integration.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--zen-charcoal-light)",
                        }}
                      >
                        {integration.connected
                          ? "Connected and syncing"
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.connected && (
                      <div
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor:
                            "var(--zen-sage-light)",
                          color: "var(--zen-sage-dark)",
                        }}
                      >
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        integration.connected
                          ? disconnectIntegration(integration.id)
                          : connectIntegration(integration.id)
                      }
                      className="px-4 py-2 rounded-full text-sm transition-all"
                      style={{
                        backgroundColor: integration.connected
                          ? "var(--zen-sand)"
                          : "var(--zen-sage)",
                        color: integration.connected
                          ? "var(--zen-charcoal)"
                          : "white",
                      }}
                    >
                      {integration.connected
                        ? "Disconnect"
                        : "Connect"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 rounded-3xl space-y-6"
          style={{ backgroundColor: "white" }}
        >
          <div className="flex items-center gap-2">
            <Bell
              className="w-5 h-5"
              style={{ color: "var(--zen-charcoal)" }}
            />
            <h3 style={{ color: "var(--zen-charcoal)" }}>
              Notification Preferences
            </h3>
          </div>
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div>
                <p style={{ color: "var(--zen-charcoal)" }}>
                  Daily Summary
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--zen-charcoal-light)" }}
                >
                  Receive a daily recap of your accomplishments
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    daily: !notifications.daily,
                  })
                }
                className="w-12 h-7 rounded-full transition-all relative"
                style={{
                  backgroundColor: notifications.daily
                    ? "var(--zen-sage)"
                    : "var(--zen-sand)",
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white absolute top-1"
                  animate={{
                    left: notifications.daily ? "24px" : "4px",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div>
                <p style={{ color: "var(--zen-charcoal)" }}>
                  Weekly Report
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--zen-charcoal-light)" }}
                >
                  Get a comprehensive weekly productivity report
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    weekly: !notifications.weekly,
                  })
                }
                className="w-12 h-7 rounded-full transition-all relative"
                style={{
                  backgroundColor: notifications.weekly
                    ? "var(--zen-sage)"
                    : "var(--zen-sand)",
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white absolute top-1"
                  animate={{
                    left: notifications.weekly ? "24px" : "4px",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div>
                <p style={{ color: "var(--zen-charcoal)" }}>
                  Achievement Notifications
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--zen-charcoal-light)" }}
                >
                  Celebrate milestones and productivity streaks
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    achievements: !notifications.achievements,
                  })
                }
                className="w-12 h-7 rounded-full transition-all relative"
                style={{
                  backgroundColor: notifications.achievements
                    ? "var(--zen-sage)"
                    : "var(--zen-sand)",
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white absolute top-1"
                  animate={{
                    left: notifications.achievements
                      ? "24px"
                      : "4px",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Theme & Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 rounded-3xl space-y-6"
          style={{ backgroundColor: "white" }}
        >
          <div className="flex items-center gap-2">
            <Palette
              className="w-5 h-5"
              style={{ color: "var(--zen-charcoal)" }}
            />
            <h3 style={{ color: "var(--zen-charcoal)" }}>
              Theme & Appearance
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              className="p-4 rounded-xl border-2 transition-all"
              style={{
                borderColor: "var(--zen-sage)",
                backgroundColor: "var(--zen-sage-light)",
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: "var(--zen-sage)" }}
                />
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "var(--zen-charcoal)" }}
              >
                Zen (Default)
              </p>
            </button>
            <button
              className="p-4 rounded-xl border transition-all opacity-60"
              style={{
                borderColor: "var(--zen-sand)",
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{
                    backgroundColor: "var(--zen-charcoal)",
                  }}
                />
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "var(--zen-charcoal)" }}
              >
                Minimal
              </p>
            </button>
            <button
              className="p-4 rounded-xl border transition-all opacity-60"
              style={{
                borderColor: "var(--zen-sand)",
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: "var(--zen-blue)" }}
                />
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "var(--zen-charcoal)" }}
              >
                Ocean
              </p>
            </button>
          </div>
        </motion.div>

        {/* Data Export & Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-3xl space-y-4"
          style={{ backgroundColor: "white" }}
        >
          <h3 style={{ color: "var(--zen-charcoal)" }}>
            Account Actions
          </h3>
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-sm"
              style={{
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div className="flex items-center gap-3">
                <Download
                  className="w-5 h-5"
                  style={{ color: "var(--zen-charcoal)" }}
                />
                <div className="text-left">
                  <p style={{ color: "var(--zen-charcoal)" }}>
                    Export Your Data
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--zen-charcoal-light)",
                    }}
                  >
                    Download all your productivity data
                  </p>
                </div>
              </div>
              <span
                className="text-sm"
                style={{ color: "var(--zen-sage)" }}
              >
                Download
              </span>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-sm"
              style={{
                backgroundColor: "var(--zen-off-white)",
              }}
            >
              <div className="flex items-center gap-3">
                <LogOut
                  className="w-5 h-5"
                  style={{ color: "#e07b7b" }}
                />
                <div className="text-left">
                  <p style={{ color: "var(--zen-charcoal)" }}>
                    Sign Out
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--zen-charcoal-light)",
                    }}
                  >
                    Sign out of your account
                  </p>
                </div>
              </div>
              <span
                className="text-sm"
                style={{ color: "#e07b7b" }}
              >
                Sign Out
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}