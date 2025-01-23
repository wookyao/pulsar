import { useEffect, useMemo, useState } from "react";
import { useMountEffect, useResizeListener } from "primereact/hooks";
import AppHeader from "./app-header";
import SvgIcon from "@/components/svg-icon";
import "./style/index.less";
import useUserStore from "@/store/use-user";

const AppMain = () => {
  const { user } = useUserStore();

  const [toggle, setToggle] = useState(true);
  const [appState, setAppState] = useState({});

  const [bindWindowResizeListener, unbindWindowResizeListener] =
    useResizeListener({
      listener: (event: Event) => {
        const el = event.currentTarget as Window;
        if (el.innerWidth < 768) {
          setToggle(false);
        } else {
          setToggle(true);
        }
      },
    });

  useMountEffect(() => {
    if (window.innerWidth < 768) {
      setToggle(false);
    }
  });

  useEffect(() => {
    bindWindowResizeListener();

    return () => {
      unbindWindowResizeListener();
    };
  }, [bindWindowResizeListener, unbindWindowResizeListener]);

  useEffect(() => {
    const obj = toggle ? {} : { "data-closed": "" };

    setAppState(obj);
  }, [toggle]);

  const roleLabel = useMemo(() => {
    const roles = user?.roles ?? [];

    if (!roles.length) return "-";
    return roles[0]?.name;
  }, [user]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="app-main" {...appState}>
      <div className="app-main__sidebar">
        {/* logo  pulsar */}
        <div className="logo-area">
          <div className="size-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <SvgIcon iconName="pulsar" size={18} />
          </div>
          <div className="text-lg font-bold pl-2 tracking-widest">PULSAR</div>
        </div>

        {/* user info  */}

        <div className="mx-4 rounded-2xl px-2 py-2 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-600">
          <div className="size-12 overflow-hidden rounded-full">
            <img
              src="/amyelsner.png"
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="flex-1 ">
            <h4 className="text-neutral-900 dark:text-neutral-100 text-sm pb-1">
              {user?.account || "Pulsar OA"}
            </h4>
            <h5 className="text-xs text-neutral-500 dark:text-neutral-300">
              {roleLabel}
            </h5>
          </div>
        </div>
      </div>
      <div className="app-main__content">
        <AppHeader onToggle={handleToggle} />
        <div className="app-main__stage">666</div>
      </div>
    </div>
  );
};

export default AppMain;
