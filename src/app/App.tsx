import { useCallback, useEffect, useState } from "react";
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
import { signOutCognito } from "./cognitoAuth";
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

export default function App() {
  const [authScreen, setAuthScreen] = useState<"signup" | "login" | "confirm">(
    () =>
    readStoredAccount() ? "login" : "signup",
  );
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");
  const [signupComplete, setSignupComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const parseConnectedStatus = (raw: unknown): IntegrationStatus => {
    let data = raw;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch {
        return { connected: false };
      }
    }
    
    if (data && typeof data === "object") {
      const maybeBody = (data as { body?: unknown }).body;
      if (typeof maybeBody === "string") {
        try {
          data = JSON.parse(maybeBody);
        } catch {
          // fallback
        }
      }

      const status = data as Partial<IntegrationStatus>;
      return {
        connected: status.connected === true,
        connectedAt: status.connectedAt,
        tokenExpiration: status.tokenExpiration,
        workspaces: status.workspaces,
      };
    }
    return { connected: false };
  };

  const refreshConnectedIntegrations = useCallback(async () => {
    const userId = userProfile.userId ?? readStoredAccount()?.userId;
    if (!userId) return;

    const providers: IntegrationId[] = ["github", "slack"];
    const newStatuses: Record<IntegrationId, IntegrationStatus | null> = { github: null, slack: null };

    await Promise.all(
      providers.map(async (provider) => {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/auth/${provider}/status`,
            {
              params: { userId },
            },
          );
          const parsed = parseConnectedStatus(data);
          newStatuses[provider] = parsed;
        } catch (error) {
          console.error(`Failed to check ${provider} status:`, error);
          newStatuses[provider] = { connected: false };
        }
      }),
    );

    setIntegrationStatuses(newStatuses);
    setConnectedIntegrations(
      providers.filter((id) => newStatuses[id]?.connected),
    );
  }, [userProfile.userId]);

  const launchIntegrationOAuth = useCallback(
    (id: IntegrationId) => {
      const userId = userProfile.userId ?? readStoredAccount()?.userId;
      if (!userId) {
        console.warn(`Cannot connect ${id} without a user ID`);
        return;
      }

      const authUrl = new URL(`${API_BASE_URL}/auth/${id}`);
      authUrl.searchParams.set("userId", userId);
      const redirectUrl = new URL(`${window.location.origin}/oauth-complete.html`);
      redirectUrl.searchParams.set("provider", id);
      authUrl.searchParams.set("redirectUrl", redirectUrl.toString());
      const popupFeatures =
        "popup=yes,width=600,height=800,menubar=no,toolbar=no,location=yes,resizable=yes,scrollbars=yes,status=no";
      const popup = window.open(authUrl.toString(), `${id}-oauth`, popupFeatures);
      if (popup) {
        const popupMonitor = window.setInterval(() => {
          if (popup.closed) {
            window.clearInterval(popupMonitor);
            void refreshConnectedIntegrations();
          }
        }, 1000);
      }
      if (!popup) {
        // Fallback when popups are blocked by the browser.
        window.location.assign(authUrl.toString());
      }
    },
    [refreshConnectedIntegrations, userProfile.userId],
  );

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

  const handleCredentialLoginSuccess = async (email: string) => {
    let fetchedUserId: string | undefined;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/user-config`, { params: { email } });
      fetchedUserId = data.data.user_id;
    } catch (err) {
      console.warn("Could not fetch user_id from backend:", err);
    }

    const stored = readStoredAccount();
    const storedEmail = stored?.email.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const activeAccount: StoredAccount = stored && storedEmail === normalizedEmail
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
  };

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
