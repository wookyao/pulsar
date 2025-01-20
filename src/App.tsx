import { RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { Toaster } from "react-hot-toast";
import router from "@/routes";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function App() {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <RouterProvider router={router} />
      <Toaster />
    </PrimeReactProvider>
  );
}

export default App;
