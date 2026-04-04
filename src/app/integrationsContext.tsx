import { createContext, useContext, useMemo, type ReactNode } from "react";

/** IDs match integration onboarding toggles and route segments. */
export type IntegrationId = "github" | "slack" | "linear";

export type IntegrationsContextValue = {
  connectedIds: IntegrationId[];
  connectIntegration: (id: IntegrationId) => void;
  disconnectIntegration: (id: IntegrationId) => void;
};

const IntegrationsContext = createContext<IntegrationsContextValue | null>(
  null,
);

export function ConnectedIntegrationsProvider({
  connectedIds,
  connectIntegration,
  disconnectIntegration,
  children,
}: {
  connectedIds: IntegrationId[];
  connectIntegration: (id: IntegrationId) => void;
  disconnectIntegration: (id: IntegrationId) => void;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      connectedIds,
      connectIntegration,
      disconnectIntegration,
    }),
    [connectedIds, connectIntegration, disconnectIntegration],
  );

  return (
    <IntegrationsContext.Provider value={value}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations(): IntegrationsContextValue {
  const value = useContext(IntegrationsContext);
  if (value === null) {
    throw new Error(
      "useIntegrations must be used within ConnectedIntegrationsProvider",
    );
  }
  return value;
}

export function useConnectedIntegrations(): IntegrationId[] {
  return useIntegrations().connectedIds;
}

export function useHasIntegration(id: IntegrationId): boolean {
  return useConnectedIntegrations().includes(id);
}
