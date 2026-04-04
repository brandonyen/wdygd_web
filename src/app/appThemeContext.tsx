import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyAppThemeToDocument,
  type AppTheme,
} from "./appTheme";
import { patchStoredAccount } from "./accountStorage";

type AppThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: AppTheme;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<AppTheme>(initialTheme);

  useLayoutEffect(() => {
    applyAppThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    applyAppThemeToDocument(next);
    patchStoredAccount({ theme: next });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (ctx === null) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return ctx;
}
