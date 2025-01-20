import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App.tsx";

import "@/common/styles/index.css";
// primreact css
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ unstyled: false }}>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
