import { memo, useEffect, useState } from "react";
import { Maximize, Menu, Minimize, Moon, Palette, Sun } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import toggleFullScreen from "_/help/full-screen";
import { useToggleTheme } from "_/hooks/use-theme";
import ThemeConfig from "@/components/theme-config";
import cn from "_/help/cn";

import "./style/app-header.less";

interface AppHeaderProps {
  onToggle?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggle }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { mode, toggleMode } = useToggleTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <>
      <div className="app-header">
        <div className="icon-card" onClick={onToggle}>
          <Menu data-scale />
        </div>
        {/*  切换 全屏 */}
        <div className="icon-card ml-auto" onClick={toggleFullScreen}>
          {isFullScreen ? (
            <Minimize size={20} data-scale />
          ) : (
            <Maximize size={20} data-scale />
          )}
        </div>
        {/* 消息通知 */}
        <div className="icon-card">
          <i className="pi pi-bell p-overlay-badge text-xl" data-scale>
            <Badge severity="danger"></Badge>
          </i>
        </div>
        <div className="icon-card relative" onClick={toggleMode}>
          {mode === "light" ? (
            <Moon size={20} data-scale />
          ) : (
            <Sun size={20} data-scale />
          )}
        </div>
        <div className="icon-card palette" onClick={() => setVisible(true)}>
          <Palette
            className="text-neutral-50 dark:text-neutral-800"
            size={20}
            data-scale
          />
        </div>
        <div className="icon-card">
          <Avatar data-scale image="/amyelsner.png" shape="circle" />
        </div>
      </div>

      <ThemeConfig visible={visible} setVisible={setVisible} />
    </>
  );
};

export default memo(AppHeader);
