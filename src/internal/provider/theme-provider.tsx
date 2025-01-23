import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useMountEffect } from "primereact/hooks";
import { Theme, ThemeMode, ThemeProviderState } from "#/app";
import { changeThemeStyleFile, getSystemMode } from "../help";
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

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
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
      const newTheme = getDirName(s.theme || prev.theme, s.mode || prev.mode);

      changeThemeStyleFile(newTheme);

      const result = {
        ...prev,
        ...s,
      };

      localStorage.setItem(modeStorageKey, result.mode);
      localStorage.setItem(themeStorageKey, result.theme);

      return result;
    });
  };

  useMountEffect(() => {
    changeState({
      mode: state.mode,
      theme: state.theme,
    });
  });

  const value = {
    mode: state.mode,
    theme: state.theme,
    setMode: (mode: ThemeMode) => {
      changeState({ mode });
    },
    setTheme: (theme: Theme) => {
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
