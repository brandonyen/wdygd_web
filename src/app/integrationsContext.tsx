import { createContext, useContext, useMemo, type ReactNode } from "react";

/** IDs match integration onboarding toggles and route segments. */
export type IntegrationId = "github" | "slack";

export interface IntegrationStatus {
  connected: boolean;
  connectedAt?: string;
  tokenExpiration?: string;
  workspaces?: {
    connectedAt: string;
    tokenExpiration: string;
    workspaceId: string;
    workspaceName?: string;
  }[];
}

/** When disconnecting Slack, pass `slackWorkspaceId` to remove a single workspace; omit to remove all Slack connections. */
export type DisconnectIntegrationOptions = {
  slackWorkspaceId?: string;
};

export type IntegrationsContextValue = {
  connectedIds: IntegrationId[];
  statuses: Record<IntegrationId, IntegrationStatus | null>;
  connectIntegration: (id: IntegrationId) => void;
  disconnectIntegration: (
    id: IntegrationId,
    options?: DisconnectIntegrationOptions,
  ) => Promise<void>;
  refreshIntegrations: () => Promise<void>;
};

const IntegrationsContext = createContext<IntegrationsContextValue | null>(
  null,
);

export function ConnectedIntegrationsProvider({
  connectedIds,
  statuses,
  connectIntegration,
  disconnectIntegration,
  refreshIntegrations,
  children,
}: {
  connectedIds: IntegrationId[];
  statuses: Record<IntegrationId, IntegrationStatus | null>;
  connectIntegration: (id: IntegrationId) => void;
  disconnectIntegration: (
    id: IntegrationId,
    options?: DisconnectIntegrationOptions,
  ) => Promise<void>;
  refreshIntegrations: () => Promise<void>;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      connectedIds,
      statuses,
      connectIntegration,
      disconnectIntegration,
      refreshIntegrations,
    }),
    [connectedIds, statuses, connectIntegration, disconnectIntegration, refreshIntegrations],
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

export function useIntegrationStatus(id: IntegrationId): IntegrationStatus | null {
  return useIntegrations().statuses[id];
}
