export type Theme =
  | "bootstrap-blue"
  | "bootstrap-purple"
  | "lara-amber"
  | "lara-blue"
  | "lara-cyan"
  | "lara-green"
  | "lara-indigo"
  | "lara-pink"
  | "lara-purple"
  | "lara-teal"
  | "md-indigo";

export type ThemeMode = "light" | "dark" | "system";

export type ThemeProviderState = {
  mode: ThemeMode;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
};

export type ThemeConf = {
  light: string;
  dark: string;
  label: string;
  group: string;
};
