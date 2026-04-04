export type AppTheme = "zen" | "dark" | "ocean" | "forest" | "dusk";

/** Older builds stored the former gray theme as `minimal`; map to dark. */
const LEGACY_THEME_MAP: Record<string, AppTheme> = {
  minimal: "dark",
};

export function parseAppTheme(value: unknown): AppTheme {
  if (
    value === "zen" ||
    value === "dark" ||
    value === "ocean" ||
    value === "forest" ||
    value === "dusk"
  ) {
    return value;
  }
  if (typeof value === "string" && value in LEGACY_THEME_MAP) {
    return LEGACY_THEME_MAP[value]!;
  }
  return "zen";
}

export const APP_THEME_STORAGE_ATTR = "data-app-theme";

export function applyAppThemeToDocument(theme: AppTheme): void {
  document.documentElement.setAttribute(APP_THEME_STORAGE_ATTR, theme);
}
