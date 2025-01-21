import { useEffect, useState } from "react";
import AppHeader from "./app-header";
import "./style/index.less";

const AppMain = () => {
  const [toggle, setToggle] = useState(true);

  const [appState, setAppState] = useState({});

  useEffect(() => {
    const obj = toggle ? {} : { "data-closed": "" };

    setAppState(obj);
  }, [toggle]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="app-main" {...appState}>
      <div className="app-main__sidebar"></div>
      <div className="app-main__content">
        <AppHeader onToggle={handleToggle} />
        <div style={{ height: "150vh" }}></div>
      </div>
    </div>
  );
};

export default AppMain;
