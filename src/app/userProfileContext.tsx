import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type UserProfile = {
  fullName: string;
  email: string;
  title: string;
  bio: string;
};

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; error: string };

export type UserProfileContextValue = {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => ChangePasswordResult;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({
  profile,
  setProfile,
  accountPassword,
  setAccountPassword,
  children,
}: {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  accountPassword: string;
  setAccountPassword: Dispatch<SetStateAction<string>>;
  children: ReactNode;
}) {
  const changePassword = useCallback(
    (currentPassword: string, newPassword: string): ChangePasswordResult => {
      if (currentPassword !== accountPassword) {
        return { ok: false, error: "Current password is incorrect." };
      }
      if (newPassword.length < 8) {
        return {
          ok: false,
          error: "New password must be at least 8 characters.",
        };
      }
      setAccountPassword(newPassword);
      return { ok: true };
    },
    [accountPassword, setAccountPassword],
  );

  const value = useMemo(
    () => ({ profile, setProfile, changePassword }),
    [profile, setProfile, changePassword],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (ctx === null) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}

export function profileInitials(fullName: string): string {
  const names = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (names.length === 0) {
    return "??";
  }
  return names.map((name) => name[0]?.toUpperCase() ?? "").join("");
}
