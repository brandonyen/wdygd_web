import { useCallback, useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { IntegrationOnboardingPage } from "./components/IntegrationOnboardingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { router } from "./routes";
import {
  patchStoredAccount,
  readStoredAccount,
  writeStoredAccount,
  type StoredAccount,
} from "./accountStorage";
import {
  ConnectedIntegrationsProvider,
  type IntegrationId,
} from "./integrationsContext";
import { UserProfileProvider, type UserProfile } from "./userProfileContext";

export default function App() {
  const [authScreen, setAuthScreen] = useState<"signup" | "login">(() =>
    readStoredAccount() ? "login" : "signup",
  );
  const [signupComplete, setSignupComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    title: "",
    bio: "",
  });
  const [accountPassword, setAccountPassword] = useState("");
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
    password: string;
  }) => {
    const record: StoredAccount = {
      fullName: account.fullName.trim(),
      email: account.email.trim(),
      title: "",
      bio: "",
      password: account.password,
      connectedIntegrations: [],
    };
    writeStoredAccount(record);
    setUserProfile({
      fullName: record.fullName,
      email: record.email,
      title: "",
      bio: "",
    });
    setAccountPassword(account.password);
    setSignupComplete(true);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    patchStoredAccount({ connectedIntegrations });
  }, [connectedIntegrations, isLoggedIn]);

  const handleSignOut = useCallback(() => {
    setIsLoggedIn(false);
    setSignupComplete(false);
    setUserProfile({
      fullName: "",
      email: "",
      title: "",
      bio: "",
    });
    setAccountPassword("");
    setConnectedIntegrations([]);
    setAuthScreen(readStoredAccount() ? "login" : "signup");
  }, []);

  const handleCredentialLoginSuccess = (stored: StoredAccount) => {
    setUserProfile({
      fullName: stored.fullName,
      email: stored.email,
      title: stored.title,
      bio: stored.bio,
    });
    setAccountPassword(stored.password);
    setConnectedIntegrations(stored.connectedIntegrations);
    setSignupComplete(true);
    if (stored.connectedIntegrations.length > 0) {
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
    return (
      <div className="size-full">
        <LoginPage
          onLoginSuccess={handleCredentialLoginSuccess}
          onSwitchToSignup={() => setAuthScreen("signup")}
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

  return (
    <UserProfileProvider
      profile={userProfile}
      setProfile={setUserProfile}
      accountPassword={accountPassword}
      setAccountPassword={setAccountPassword}
      onPasswordUpdated={(newPassword) =>
        patchStoredAccount({ password: newPassword })
      }
      signOut={handleSignOut}
    >
      <ConnectedIntegrationsProvider
        connectedIds={connectedIntegrations}
        connectIntegration={connectIntegration}
        disconnectIntegration={disconnectIntegration}
      >
        <RouterProvider router={router} />
      </ConnectedIntegrationsProvider>
    </UserProfileProvider>
  );
}
