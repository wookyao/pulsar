// 切换主题色
// 1. 切换 primereact 的主题色
// 2. 切换 tailwindcss 的主题色

import { useContext } from "react";
// import { PrimeReactContext } from "primereact/api";
import { ThemeProviderContext } from "_/provider/theme-provider.tsx";
import { isReducedMotion } from "../help";
import { ThemeMode } from "#/app";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme必须在ThemeProvider中使用");

  return context;
};

export const useToggleTheme = () => {
  const { mode, theme, setMode } = useTheme();
  // const { changeTheme } = useContext(PrimeReactContext);

  // const _changeTheme = (theme: string, colorScheme: string) => {
  //   changeTheme?.(layoutConfig.theme, theme, "theme-css", () => {
  //     setLayoutConfig((prevState: LayoutConfig) => ({
  //       ...prevState,
  //       theme,
  //       colorScheme,
  //     }));
  //   });
  // };

  const _changeMode = (mode: ThemeMode) => {
    setMode(mode);
  };

  const toggleMode = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const willDark = mode === "light";

    // 判断浏览器是否支持 viewTransition 或者 是否开启了 动画减弱
    if (!document.startViewTransition || isReducedMotion()) {
      _changeMode(willDark ? "dark" : "light");
      return;
    }

    // 开启 viewTransition
    const transition = document.startViewTransition(async () => {
      _changeMode(willDark ? "dark" : "light");
    });

    // 传入点击事件，从点击处开始扩散。否则，从右上角开始扩散
    const x = event?.clientX ?? window.innerWidth;
    const y = event?.clientY ?? 0;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    void transition.ready.then(() => {
      // 创建一个圆形的裁剪区域，从点击处开始扩散
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: willDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: willDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      );
    });
  };

  return {
    theme,
    mode,
    toggleMode,
  };
};
