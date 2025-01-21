import { Outlet } from "react-router-dom";
import AppHeader from "./app-header";

const AppLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-100">
      <div className="bg-white">
        <AppHeader />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
