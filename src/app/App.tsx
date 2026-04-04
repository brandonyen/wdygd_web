import { useCallback, useState } from "react";
import { RouterProvider } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { router } from "./routes";
import {
  ConnectedIntegrationsProvider,
  type IntegrationId,
} from "./integrationsContext";
import {
  UserProfileProvider,
  type UserProfile,
} from "./userProfileContext";

export default function App() {
  const [signupComplete, setSignupComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
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

  const handleLogin = (integrations: IntegrationId[]) => {
    setConnectedIntegrations(integrations);
    setIsLoggedIn(true);
  };

  const handleSignupComplete = (account: {
    fullName: string;
    email: string;
  }) => {
    setUserProfile({
      fullName: account.fullName.trim(),
      email: account.email.trim(),
      title: "",
      bio: "",
    });
    setSignupComplete(true);
  };

  if (!signupComplete) {
    return (
      <div className="size-full">
        <SignupPage onSignupComplete={handleSignupComplete} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="size-full">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <UserProfileProvider profile={userProfile} setProfile={setUserProfile}>
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
