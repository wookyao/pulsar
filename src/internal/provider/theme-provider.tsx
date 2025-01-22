import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { PrimeReactContext } from "primereact/api";
import { useMountEffect } from "primereact/hooks";
import { Theme, ThemeMode, ThemeProviderState } from "#/app";
import { getSystemMode } from "../help";
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

      const styleElement = document.querySelector(
        "style[data-primereact-style-id]"
      );

      changeTheme?.(currentTheme, newTheme, "theme-link", () => {
        // 获取 link 标签 并将link 标签 放到 head 最后
        const link = document.querySelector("#theme-link") as HTMLLinkElement;

        const hasDataMove = link.hasAttribute("data-moved");

        if (link && !hasDataMove) {
          document.head.removeChild(link);
        }

        if (!hasDataMove) {
          link.setAttribute("data-moved", "");

          // 获取 head 元素
          const head = document.head;
          head.insertBefore(link, styleElement);
        }
      });

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
    console.log(6666);
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
