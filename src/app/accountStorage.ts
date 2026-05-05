import type { AppTheme } from "./appTheme";
import { parseAppTheme } from "./appTheme";
import type { IntegrationId } from "./integrationsContext";
import type { UserProfile } from "./userProfileContext";

const KEY = "wdygd_account";

export type StoredAccount = UserProfile & {
  connectedIntegrations: IntegrationId[];
  theme: AppTheme;
};

function isIntegrationId(x: unknown): x is IntegrationId {
  return x === "github" || x === "slack";
}

export function readStoredAccount(): StoredAccount | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StoredAccount>;
    if (
      typeof data.email !== "string" ||
      typeof data.fullName !== "string"
    ) {
      return null;
    }
    const connectedIntegrations: IntegrationId[] = Array.isArray(
      data.connectedIntegrations,
    )
      ? data.connectedIntegrations.filter(isIntegrationId)
      : [];
    return {
      fullName: data.fullName,
      email: data.email,
      title: typeof data.title === "string" ? data.title : "",
      bio: typeof data.bio === "string" ? data.bio : "",
      connectedIntegrations,
      theme: parseAppTheme(data.theme),
    };
  } catch {
    return null;
  }
}

export function writeStoredAccount(account: StoredAccount): void {
  localStorage.setItem(KEY, JSON.stringify(account));
}

export function patchStoredAccount(partial: Partial<StoredAccount>): void {
  const cur = readStoredAccount();
  if (!cur) return;
  writeStoredAccount({ ...cur, ...partial });
}
