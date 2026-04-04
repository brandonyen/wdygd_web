export type AppTheme = "zen" | "minimal" | "ocean";

export function parseAppTheme(value: unknown): AppTheme {
  if (value === "zen" || value === "minimal" || value === "ocean") {
    return value;
  }
  return "zen";
}

export const APP_THEME_STORAGE_ATTR = "data-app-theme";

export function applyAppThemeToDocument(theme: AppTheme): void {
  document.documentElement.setAttribute(APP_THEME_STORAGE_ATTR, theme);
}
