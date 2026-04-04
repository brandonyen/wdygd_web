import {
  createContext,
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

export type UserProfileContextValue = {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({
  profile,
  setProfile,
  children,
}: {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ profile, setProfile }),
    [profile, setProfile],
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
