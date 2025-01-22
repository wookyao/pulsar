import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { PrimeReactContext } from "primereact/api";
import { Theme, ThemeMode, ThemeProviderState } from "#/app";
import { THEME } from "../config/theme";

const initialState: ThemeProviderState = {
  mode: "light",
  theme: "lara-blue",
  setTheme: () => null,
  setMode: () => null,
};

type ThemeState = {
  mode: ThemeMode;
  theme: Theme;
};

type ThemeProviderProps = {
  defaultTheme?: Theme;
  defaultMode?: ThemeMode;
};

const themeStorageKey = "app-theme";
const modeStorageKey = "app-mode";

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

function getDirName(theme: Theme, mode: ThemeMode) {
  const config = THEME[theme];

  const key = mode === "system" ? getSystemMode() : mode;

  return config[key];
}

function getSystemMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
  const { changeTheme } = useContext(PrimeReactContext);

  const [state, setState] = useState<ThemeState>(() => {
    const theme =
      (localStorage.getItem(themeStorageKey) as Theme) ||
      props.defaultTheme ||
      initialState.theme;

    const mode =
      (localStorage.getItem(modeStorageKey) as ThemeMode) ||
      props.defaultMode ||
      initialState.mode;

    return {
      mode,
      theme,
    };
  });

  // 切换 light / dark 模式
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (state.mode === "system") {
      const systemTheme = getSystemMode();

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(state.mode);
  }, [state.mode]);

  const changeState = (s: Partial<ThemeState>) => {
    setState((prev) => {
      const currentTheme = getDirName(prev.theme, prev.mode);
      const newTheme = getDirName(s.theme || prev.theme, s.mode || prev.mode);

      changeTheme?.(currentTheme, newTheme, "theme-link");

      return {
        ...prev,
        ...s,
      };
    });
  };

  const value = {
    mode: state.mode,
    theme: state.theme,
    setMode: (mode: ThemeMode) => {
      localStorage.setItem(modeStorageKey, mode);
      // setMode(mode);
      changeState({ mode });
    },
    setTheme: (theme: Theme) => {
      localStorage.setItem(themeStorageKey, theme);
      // setTheme(theme);
      changeState({ theme });
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {props.children}
    </ThemeProviderContext.Provider>
  );
};

export default ThemeProvider;
