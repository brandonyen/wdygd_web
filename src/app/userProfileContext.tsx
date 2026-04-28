import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { changeCognitoPassword } from "./cognitoAuth";

export type UserProfile = {
  fullName: string;
  email: string;
  title: string;
  bio: string;
};

export type ChangePasswordResult = { ok: true } | { ok: false; error: string };

export type UserProfileContextValue = {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<ChangePasswordResult>;
  signOut: () => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({
  profile,
  setProfile,
  signOut,
  children,
}: {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  signOut: () => void;
  children: ReactNode;
}) {
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordResult> => {
    if (newPassword.length < 8) {
      return {
        ok: false,
        error: "New password must be at least 8 characters.",
      };
    }

    try {
      await changeCognitoPassword(currentPassword, newPassword);
      return { ok: true };
    } catch (err) {
      if (err instanceof Error) {
        return { ok: false, error: err.message };
      }
      return { ok: false, error: "Unable to change password right now." };
    }
  };

  const value = useMemo(
    () => ({ profile, setProfile, changePassword, signOut }),
    [profile, setProfile, changePassword, signOut],
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
  const names = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (names.length === 0) {
    return "??";
  }
  return names.map((name) => name[0]?.toUpperCase() ?? "").join("");
}
