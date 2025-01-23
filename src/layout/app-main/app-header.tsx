import { memo, useEffect, useState } from "react";
import { Maximize, Menu, Minimize, Moon, Palette, Sun } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import toggleFullScreen from "_/help/full-screen";
import { useToggleTheme } from "_/hooks/use-theme";
import ThemeConfig from "@/components/theme-config";

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
        <div className="item-card relative" onClick={toggleMode}>
          {mode === "light" ? (
            <Moon size={20} data-scale />
          ) : (
            <Sun size={20} data-scale />
          )}
        </div>
        <div className="item-card" onClick={() => setVisible(true)}>
          <Palette size={20} data-scale />
        </div>
        <div className="item-card">
          <Avatar data-scale image="/amyelsner.png" shape="circle" />
        </div>
      </div>

      <ThemeConfig visible={visible} setVisible={setVisible} />
    </>
  );
};

export default memo(AppHeader);
