import type { ReactNode } from "react";
import type { IntegrationId } from "../integrationsContext";
import { useHasIntegration } from "../integrationsContext";
import { ConnectIntegrationPage } from "./ConnectIntegrationPage";

export function IntegrationGate({
  integrationId,
  children,
}: {
  integrationId: IntegrationId;
  children: ReactNode;
}) {
  const connected = useHasIntegration(integrationId);
  if (!connected) {
    return <ConnectIntegrationPage integrationId={integrationId} />;
  }
  return <>{children}</>;
}
