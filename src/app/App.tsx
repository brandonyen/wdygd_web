import { useCallback, useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router";
import axios from "axios";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ConfirmSignupPage } from "./components/ConfirmSignupPage";
import { router } from "./routes";
import {
  patchStoredAccount,
  readStoredAccount,
  writeStoredAccount,
  type StoredAccount,
} from "./accountStorage";
import {
  signOutCognito,
  getCurrentCognitoUserEmail,
  getCurrentIdToken,
} from "./cognitoAuth";
import {
  ConnectedIntegrationsProvider,
  type IntegrationId,
  type IntegrationStatus,
} from "./integrationsContext";
import { applyAppThemeToDocument, parseAppTheme } from "./appTheme";
import { AppThemeProvider } from "./appThemeContext";
import { UserProfileProvider, type UserProfile } from "./userProfileContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod";

function extractWorkspaceName(conn: any): string | undefined {
  let maybeMetadata = conn.provider_metadata;
  if (typeof conn.provider_metadata === "string") {
    try {
      maybeMetadata = JSON.parse(conn.provider_metadata);
    } catch {
      maybeMetadata = undefined;
    }
  }

  return (
    conn.provider_workspace_name ??
    conn.workspace_name ??
    conn.team_name ??
    conn.team?.name ??
    conn.workspace?.name ??
    maybeMetadata?.workspace_name ??
    maybeMetadata?.team_name ??
    maybeMetadata?.team?.name
  );
}

function extractConnectedAt(conn: any): string {
  return (
    conn.created_at ??
    conn.connected_at ??
    conn.connection_created_at ??
    conn.inserted_at ??
    ""
  );
}

export default function App() {
  const [authScreen, setAuthScreen] = useState<"signup" | "login" | "confirm">(
    () => (readStoredAccount() ? "login" : "signup"),
  );
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");
  const [signupComplete, setSignupComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userId: undefined,
    fullName: "",
    email: "",
    title: "",
    bio: "",
  });
  const [connectedIntegrations, setConnectedIntegrations] = useState<
    IntegrationId[]
  >([]);
  const [integrationStatuses, setIntegrationStatuses] = useState<
    Record<IntegrationId, IntegrationStatus | null>
  >({ github: null, slack: null });
  const refreshRetryTimerRef = useRef<number | null>(null);

  const handleCredentialLoginSuccess = useCallback(async (email: string) => {
    let fetchedUserId: string | undefined;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/user-config`, {
        params: { email },
      });
      fetchedUserId = data.data.user_id;
    } catch (err) {
      console.warn("Could not fetch user_id from backend:", err);
    }

    const stored = readStoredAccount();
    const storedEmail = stored?.email.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const activeAccount: StoredAccount =
      stored && storedEmail === normalizedEmail
        ? { ...stored, userId: fetchedUserId || stored.userId }
        : {
            userId: fetchedUserId,
            fullName: normalizedEmail.split("@")[0] ?? normalizedEmail,
            email: normalizedEmail,
            title: "",
            bio: "",
            connectedIntegrations: [],
            theme: "zen",
          };

    writeStoredAccount(activeAccount);
    setUserProfile({
      userId: activeAccount.userId,
      fullName: activeAccount.fullName,
      email: activeAccount.email,
      title: activeAccount.title,
      bio: activeAccount.bio,
    });
    setConnectedIntegrations(activeAccount.connectedIntegrations);
    setSignupComplete(true);
    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const email = await getCurrentCognitoUserEmail();
        if (mounted) {
          if (email) {
            await handleCredentialLoginSuccess(email);
          }
          setIsInitializing(false);
        }
      } catch (e) {
        console.error("Session check failed", e);
        if (mounted) setIsInitializing(false);
      }
    };
    void checkSession();
    return () => {
      mounted = false;
    };
  }, [handleCredentialLoginSuccess]);

  const refreshConnectedIntegrations = useCallback(async () => {
    const userId = userProfile.userId ?? readStoredAccount()?.userId;
    if (!userId) return;

    try {
      const token = await getCurrentIdToken();
      const { data } = await axios.get(
        `${API_BASE_URL}/integration-connection`,
        {
          params: { user_id: userId, userId },
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        },
      );

      const rawConnections = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
      const connections = rawConnections;
      const newStatuses: Record<IntegrationId, IntegrationStatus | null> = {
        github: { connected: false },
        slack: { connected: false, workspaces: [] },
      };

      connections.forEach((conn: any) => {
        const provider = conn.provider?.toLowerCase() as IntegrationId;
        if (provider === "github") {
          newStatuses.github = {
            connected: true,
            connectedAt: conn.created_at,
            tokenExpiration: conn.token_expiration,
          };
        } else if (provider === "slack") {
          newStatuses.slack!.connected = true;
          newStatuses.slack!.workspaces = newStatuses.slack!.workspaces || [];
          newStatuses.slack!.workspaces.push({
            workspaceId: conn.provider_workspace_id,
            workspaceName: extractWorkspaceName(conn),
            connectedAt: extractConnectedAt(conn),
            tokenExpiration: conn.token_expiration,
          });
        }
      });

      setIntegrationStatuses(newStatuses);
      setConnectedIntegrations(
        (["github", "slack"] as IntegrationId[]).filter(
          (id) => newStatuses[id]?.connected,
        ),
      );
    } catch (error) {
      console.error("Failed to fetch integration connections:", error);
    }
  }, [userProfile.userId]);

  const launchIntegrationOAuth = useCallback(
    (id: IntegrationId) => {
      const userId = userProfile.userId ?? readStoredAccount()?.userId;
      if (!userId) {
        console.warn(`Cannot connect ${id} without a user ID`);
        alert("Could not start OAuth because your user ID is missing. Please sign out and sign back in, then try again.");
        return;
      }

      const authUrl = new URL(`${API_BASE_URL}/auth/${id}`);
      authUrl.searchParams.set("userId", userId);
      authUrl.searchParams.set("user_id", userId);
      const redirectUrl = new URL(
        `${window.location.origin}/oauth-complete.html`,
      );
      redirectUrl.searchParams.set("provider", id);
      authUrl.searchParams.set("redirectUrl", redirectUrl.toString());
      authUrl.searchParams.set("redirect_url", redirectUrl.toString());
      authUrl.searchParams.set("redirect_uri", redirectUrl.toString());
      // Use same-tab OAuth to work reliably inside Cursor preview/webview flows.
      window.location.assign(authUrl.toString());
    },
    [userProfile.userId],
  );

  useEffect(() => {
    const onOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const payload = event.data as
        | {
            type?: string;
            provider?: string;
            success?: boolean;
            error?: string;
          }
        | undefined;
      if (!payload || payload.type !== "oauth-complete") return;
      if (payload.success === false) {
        const reason = payload.error ? ` (${payload.error})` : "";
        alert(`OAuth connection failed${reason}.`);
      }

      // Some backends take a moment before /integration-connection reflects new rows.
      // Retry refresh a few times so successful OAuth is reliably reflected in UI.
      void refreshConnectedIntegrations();
      let attemptsLeft = 5;
      if (refreshRetryTimerRef.current) {
        window.clearInterval(refreshRetryTimerRef.current);
      }
      refreshRetryTimerRef.current = window.setInterval(() => {
        attemptsLeft -= 1;
        void refreshConnectedIntegrations();
        if (attemptsLeft <= 0 && refreshRetryTimerRef.current) {
          window.clearInterval(refreshRetryTimerRef.current);
          refreshRetryTimerRef.current = null;
        }
      }, 1500);
    };

    window.addEventListener("message", onOAuthMessage);
    return () => {
      window.removeEventListener("message", onOAuthMessage);
      if (refreshRetryTimerRef.current) {
        window.clearInterval(refreshRetryTimerRef.current);
        refreshRetryTimerRef.current = null;
      }
    };
  }, [refreshConnectedIntegrations]);

  const connectIntegration = useCallback(
    (id: IntegrationId) => {
      launchIntegrationOAuth(id);
    },
    [launchIntegrationOAuth],
  );

  const disconnectIntegration = useCallback(
    async (id: IntegrationId) => {
      const userId = userProfile.userId ?? readStoredAccount()?.userId;
      if (!userId) {
        console.warn(`Cannot disconnect ${id} without a user ID`);
        return;
      }

      try {
        const disconnectUrl = new URL(`${API_BASE_URL}/auth/${id}`);
        disconnectUrl.searchParams.set("userId", userId);
        disconnectUrl.searchParams.set("user_id", userId);
        await axios.delete(disconnectUrl.toString());
        void refreshConnectedIntegrations();
      } catch (error) {
        console.error(`Failed to disconnect ${id}:`, error);
      }
    },
    [refreshConnectedIntegrations, userProfile.userId],
  );

  const handleSignupComplete = (account: {
    fullName: string;
    email: string;
  }) => {
    const record: StoredAccount = {
      fullName: account.fullName.trim(),
      email: account.email.trim(),
      title: "",
      bio: "",
      connectedIntegrations: [],
      theme: "zen",
    };
    writeStoredAccount(record);
    setUserProfile({
      fullName: record.fullName,
      email: record.email,
      title: "",
      bio: "",
    });
    setPendingConfirmationEmail(record.email);
    setAuthScreen("confirm");
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    patchStoredAccount({ connectedIntegrations });
  }, [connectedIntegrations, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    void refreshConnectedIntegrations();

    const onWindowFocus = () => {
      void refreshConnectedIntegrations();
    };
    window.addEventListener("focus", onWindowFocus);
    return () => window.removeEventListener("focus", onWindowFocus);
  }, [isLoggedIn, refreshConnectedIntegrations]);

  const handleSignOut = useCallback(() => {
    signOutCognito();
    applyAppThemeToDocument("zen");
    setIsLoggedIn(false);
    setSignupComplete(false);
    setUserProfile({
      userId: undefined,
      fullName: "",
      email: "",
      title: "",
      bio: "",
    });
    setConnectedIntegrations([]);
    setPendingConfirmationEmail("");
    setAuthScreen(readStoredAccount() ? "login" : "signup");
  }, []);

  if (isInitializing) {
    return null;
  }

  if (!signupComplete) {
    if (authScreen === "signup") {
      return (
        <div className="size-full">
          <SignupPage
            onSignupComplete={handleSignupComplete}
            onSwitchToLogin={() => setAuthScreen("login")}
          />
        </div>
      );
    }
    if (authScreen === "confirm") {
      return (
        <div className="size-full">
          <ConfirmSignupPage
            email={pendingConfirmationEmail}
            onConfirmed={() => setAuthScreen("login")}
            onBackToLogin={() => setAuthScreen("login")}
          />
        </div>
      );
    }
    return (
      <div className="size-full">
        <LoginPage
          onLoginSuccess={handleCredentialLoginSuccess}
          onSwitchToSignup={() => setAuthScreen("signup")}
          onUserNotConfirmed={(email) => {
            setPendingConfirmationEmail(email);
            setAuthScreen("confirm");
          }}
        />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const initialAppTheme = parseAppTheme(readStoredAccount()?.theme);

  return (
    <UserProfileProvider
      profile={userProfile}
      setProfile={setUserProfile}
      signOut={handleSignOut}
    >
      <AppThemeProvider initialTheme={initialAppTheme}>
        <ConnectedIntegrationsProvider
          connectedIds={connectedIntegrations}
          statuses={integrationStatuses}
          connectIntegration={connectIntegration}
          disconnectIntegration={disconnectIntegration}
          refreshIntegrations={refreshConnectedIntegrations}
        >
          <RouterProvider router={router} />
        </ConnectedIntegrationsProvider>
      </AppThemeProvider>
    </UserProfileProvider>
  );
}
