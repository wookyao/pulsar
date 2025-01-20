import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "@/routes";
import useMessage from "./store/use-message";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";

function App() {
  const toastRef = useRef<Toast>(null);

  const { setToast } = useMessage();

  useEffect(() => {
    setToast(toastRef);
  }, [setToast]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <Toast ref={toastRef} />
    </>
  );
}

export default App;
