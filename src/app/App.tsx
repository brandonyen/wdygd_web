import { useCallback, useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import axios from "axios";
import { IntegrationOnboardingPage } from "./components/IntegrationOnboardingPage";
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
} from "./integrationsContext";
import { applyAppThemeToDocument, parseAppTheme } from "./appTheme";
import { AppThemeProvider } from "./appThemeContext";
import { UserProfileProvider, type UserProfile } from "./userProfileContext";

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

  const connectIntegration = useCallback((id: IntegrationId) => {
    setConnectedIntegrations((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  }, []);

  const disconnectIntegration = useCallback((id: IntegrationId) => {
    setConnectedIntegrations((prev) => prev.filter((x) => x !== id));
  }, []);

  const handleIntegrationContinue = (integrations: IntegrationId[]) => {
    setConnectedIntegrations(integrations);
    patchStoredAccount({ connectedIntegrations: integrations });
    setIsLoggedIn(true);
  };

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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod";
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
    if (activeAccount.connectedIntegrations.length > 0) {
      setIsLoggedIn(true);
    }
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

  if (!isLoggedIn) {
    return (
      <div className="size-full">
        <IntegrationOnboardingPage onContinue={handleIntegrationContinue} />
      </div>
    );
  }

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
          connectIntegration={connectIntegration}
          disconnectIntegration={disconnectIntegration}
        >
          <RouterProvider router={router} />
        </ConnectedIntegrationsProvider>
      </AppThemeProvider>
    </UserProfileProvider>
  );
}
