import { memo, useEffect, useState } from "react";
import { Maximize, Menu, Minimize } from "lucide-react";
import "./style/app-header.less";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import toggleFullScreen from "@/help/full-sscreen";

interface AppHeaderProps {
  onToggle?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggle }) => {
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

      <div className="item-card">
        <Avatar data-scale image="/amyelsner.png" shape="circle" />
      </div>
    </div>
  );
};

export default memo(AppHeader);
