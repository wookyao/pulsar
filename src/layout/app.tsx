import { Outlet } from "react-router-dom";
import TemplateDemo from "./app-header";

const AppLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-100">
      <div className="h-16 bg-white">
        <TemplateDemo />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
