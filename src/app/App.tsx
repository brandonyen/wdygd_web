import { useCallback, useState } from "react";
import { RouterProvider } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { router } from "./routes";
import {
  ConnectedIntegrationsProvider,
  type IntegrationId,
} from "./integrationsContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  if (!isLoggedIn) {
    return (
      <div className="size-full">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <ConnectedIntegrationsProvider
      connectedIds={connectedIntegrations}
      connectIntegration={connectIntegration}
      disconnectIntegration={disconnectIntegration}
    >
      <RouterProvider router={router} />
    </ConnectedIntegrationsProvider>
  );
}
