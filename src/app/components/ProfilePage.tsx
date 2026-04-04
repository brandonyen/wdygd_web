import { AnimatePresence, motion } from "motion/react";
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
  KeyRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useIntegrations } from "../integrationsContext";
import { patchStoredAccount } from "../accountStorage";
import { useAppTheme } from "../appThemeContext";
import {
  useUserProfile,
  profileInitials as getProfileInitials,
  type UserProfile,
} from "../userProfileContext";

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
  const interactiveButtonClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const interactiveToggleClass =
    "transition-all duration-200 ease-out hover:scale-[1.04] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const { profile, setProfile, changePassword, signOut } = useUserProfile();
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordFormError, setPasswordFormError] = useState<string | null>(
    null,
  );
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    achievements: false,
  });

  const { theme: activeAppTheme, setTheme: setAppTheme } = useAppTheme();

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
  const initials = useMemo(
    () => getProfileInitials(profile.fullName),
    [profile.fullName],
  );

  const handleStartEditProfile = () => {
    setDraftProfile(profile);
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setDraftProfile(profile);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    const next: UserProfile = {
      fullName: draftProfile.fullName.trim() || profile.fullName,
      email: draftProfile.email.trim() || profile.email,
      title: draftProfile.title.trim(),
      bio: draftProfile.bio.trim(),
    };
    setProfile(next);
    patchStoredAccount({
      fullName: next.fullName,
      email: next.email,
      title: next.title,
      bio: next.bio,
    });
    setIsEditingProfile(false);
  };

  const closePasswordModal = useCallback(() => {
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordFormError(null);
    setPasswordChangeSuccess(false);
  }, []);

  useEffect(() => {
    if (!passwordModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePasswordModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [passwordModalOpen, closePasswordModal]);

  const handlePasswordModalSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordFormError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordFormError("New passwords do not match.");
      return;
    }
    const result = changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordFormError(result.error);
      return;
    }
    setPasswordChangeSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

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
              <span className="text-white">{initials}</span>
            </div>
            <div className="flex-1">
              <AnimatePresence mode="wait" initial={false}>
                {isEditingProfile ? (
                  <motion.div
                    key="profile-edit-mode"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        value={draftProfile.fullName}
                        onChange={(event) =>
                          setDraftProfile({
                            ...draftProfile,
                            fullName: event.target.value,
                          })
                        }
                        placeholder="Full name"
                        className="w-full px-3 py-2 rounded-xl border"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                      <input
                        type="email"
                        value={draftProfile.email}
                        onChange={(event) =>
                          setDraftProfile({
                            ...draftProfile,
                            email: event.target.value,
                          })
                        }
                        placeholder="Email address"
                        className="w-full px-3 py-2 rounded-xl border"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                      <input
                        type="text"
                        value={draftProfile.title}
                        onChange={(event) =>
                          setDraftProfile({
                            ...draftProfile,
                            title: event.target.value,
                          })
                        }
                        placeholder="Title"
                        className="w-full px-3 py-2 rounded-xl border"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                      <textarea
                        value={draftProfile.bio}
                        onChange={(event) =>
                          setDraftProfile({
                            ...draftProfile,
                            bio: event.target.value,
                          })
                        }
                        placeholder="Short bio"
                        className="w-full px-3 py-2 rounded-xl border min-h-24"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="profile-view-mode"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <h2
                      className="text-2xl mb-1"
                      style={{
                        color: "var(--zen-charcoal)",
                        fontWeight: 300,
                      }}
                    >
                      {profile.fullName}
                    </h2>
                    <p
                      className="mb-1"
                      style={{ color: "var(--zen-charcoal-light)" }}
                    >
                      {profile.email}
                    </p>
                    <p
                      className="mb-1 text-sm"
                      style={{ color: "var(--zen-charcoal)" }}
                    >
                      {profile.title}
                    </p>
                    <p
                      className="mb-4 text-sm"
                      style={{ color: "var(--zen-charcoal-light)" }}
                    >
                      {profile.bio}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-3">
                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className={`px-4 py-2 rounded-full text-sm ${interactiveButtonClass}`}
                      style={{
                        backgroundColor: "var(--zen-sage)",
                        color: "white",
                        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                      }}
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditProfile}
                      className={`px-4 py-2 rounded-full text-sm ${interactiveButtonClass}`}
                      style={{
                        backgroundColor: "var(--zen-off-white)",
                        color: "var(--zen-charcoal)",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartEditProfile}
                    className={`px-4 py-2 rounded-full text-sm ${interactiveButtonClass}`}
                    style={{
                      backgroundColor: "var(--zen-sage)",
                      color: "white",
                    }}
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPasswordFormError(null);
                    setPasswordChangeSuccess(false);
                    setPasswordModalOpen(true);
                  }}
                  className={`px-4 py-2 rounded-full text-sm ${interactiveButtonClass}`}
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
                      className={`px-4 py-2 rounded-full text-sm ${interactiveButtonClass}`}
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
                className={`w-12 h-7 rounded-full relative ${interactiveToggleClass}`}
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
                className={`w-12 h-7 rounded-full relative ${interactiveToggleClass}`}
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
                className={`w-12 h-7 rounded-full relative ${interactiveToggleClass}`}
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
            {(
              [
                {
                  id: "zen" as const,
                  label: "Zen (Default)",
                  swatch: "var(--zen-sage)",
                },
                {
                  id: "minimal" as const,
                  label: "Minimal",
                  swatch: "var(--zen-charcoal)",
                },
                {
                  id: "ocean" as const,
                  label: "Ocean",
                  swatch: "var(--zen-blue)",
                },
              ] as const
            ).map(({ id, label, swatch }) => {
              const selected = activeAppTheme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAppTheme(id)}
                  className={`p-4 rounded-xl border-2 ${interactiveButtonClass} ${
                    selected ? "" : "opacity-60"
                  }`}
                  style={{
                    borderColor: selected
                      ? "var(--zen-sage)"
                      : "var(--zen-sand)",
                    backgroundColor: selected
                      ? "var(--zen-sage-light)"
                      : "var(--zen-off-white)",
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className="w-16 h-16 rounded-lg"
                      style={{ backgroundColor: swatch }}
                    />
                  </div>
                  <p
                    className="text-sm text-center"
                    style={{ color: "var(--zen-charcoal)" }}
                  >
                    {label}
                  </p>
                </button>
              );
            })}
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
              className={`w-full flex items-center justify-between p-4 rounded-xl ${interactiveButtonClass}`}
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
              type="button"
              onClick={signOut}
              className={`w-full flex items-center justify-between p-4 rounded-xl ${interactiveButtonClass}`}
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

        <AnimatePresence>
          {passwordModalOpen && (
            <motion.div
              key="password-modal-overlay"
              role="presentation"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closePasswordModal}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="change-password-title"
                className="w-full max-w-md rounded-3xl p-8 shadow-xl"
                style={{ backgroundColor: "white" }}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--zen-sage-light)" }}
                  >
                    <KeyRound
                      className="w-5 h-5"
                      style={{ color: "var(--zen-sage-dark)" }}
                    />
                  </div>
                  <h2
                    id="change-password-title"
                    className="text-xl"
                    style={{
                      color: "var(--zen-charcoal)",
                      fontWeight: 300,
                    }}
                  >
                    Change password
                  </h2>
                </div>

                {passwordChangeSuccess ? (
                  <div className="space-y-6">
                    <p
                      className="text-sm"
                      style={{ color: "var(--zen-sage-dark)" }}
                    >
                      Your password was updated successfully.
                    </p>
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      className={`w-full px-4 py-3 rounded-full text-sm ${interactiveButtonClass}`}
                      style={{
                        backgroundColor: "var(--zen-charcoal)",
                        color: "white",
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handlePasswordModalSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label
                        htmlFor="current-password"
                        className="text-sm"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        Current password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="new-password"
                        className="text-sm"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        New password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="confirm-new-password"
                        className="text-sm"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        Confirm new password
                      </label>
                      <input
                        id="confirm-new-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmNewPassword}
                        onChange={(e) =>
                          setConfirmNewPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          borderColor: "var(--zen-sand)",
                          color: "var(--zen-charcoal)",
                        }}
                      />
                    </div>
                    {passwordFormError && (
                      <p
                        className="text-sm"
                        style={{ color: "#c45c5c" }}
                        role="alert"
                      >
                        {passwordFormError}
                      </p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className={`flex-1 px-4 py-2.5 rounded-full text-sm ${interactiveButtonClass}`}
                        style={{
                          backgroundColor: "var(--zen-charcoal)",
                          color: "white",
                        }}
                      >
                        Update password
                      </button>
                      <button
                        type="button"
                        onClick={closePasswordModal}
                        className={`px-4 py-2.5 rounded-full text-sm ${interactiveButtonClass}`}
                        style={{
                          backgroundColor: "var(--zen-off-white)",
                          color: "var(--zen-charcoal)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}