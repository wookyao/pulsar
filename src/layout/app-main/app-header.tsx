import { memo, useEffect, useState } from "react";
import { Maximize, Menu, Minimize, Moon, Sun } from "lucide-react";
import "./style/app-header.less";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import toggleFullScreen from "_/help/full-screen";
import { useTheme, isReducedMotion } from "@/components/theme-provider.tsx";

interface AppHeaderProps {
  onToggle?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggle }) => {
  const { theme, setTheme } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  /**
   * 切换主题色，扩散渐变动画
   *
   * @param {React.MouseEvent} event 点击事件
   */
  const toggleTheme = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const willDark = theme === "light";
    // 浏览器新特性不支持 或者 开启了动画减弱
    if (!document.startViewTransition || isReducedMotion()) {
      setTheme(theme === "light" ? "dark" : "light");
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });

    // 传入点击事件，从点击处开始扩散。否则，从右上角开始扩散
    const x = event?.clientX ?? window.innerWidth;
    const y = event?.clientY ?? 0;

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );
    void transition.ready.then(() => {
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

  return (
    <div className="app-header">
      <div className="item-card" onClick={onToggle}>
        <Menu data-scale />
      </div>
      {/*  切换 全屏 */}
      <div className="item-card ml-auto" onClick={toggleFullScreen}>
        {isFullScreen ? (
          <Minimize size={20} data-scale />
        ) : (
          <Maximize size={20} data-scale />
        )}
      </div>
      {/* 消息通知 */}
      <div className="item-card">
        <i className="pi pi-bell p-overlay-badge text-xl" data-scale>
          <Badge severity="danger"></Badge>
        </i>
      </div>
      <div className="item-card relative" onClick={toggleTheme}>
        {theme === "light" ? (
          <Moon size={20} data-scale />
        ) : (
          <Sun size={20} data-scale />
        )}
      </div>
      <div className="item-card">
        <Avatar data-scale image="/amyelsner.png" shape="circle" />
      </div>
    </div>
  );
};

export default memo(AppHeader);
