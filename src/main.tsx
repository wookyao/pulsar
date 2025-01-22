import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App.tsx";

import ThemeProvider from "_/provider/theme-provider.tsx";
import { getSystemMode } from "_/help/index.ts";
import "@/common/styles/index.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <ThemeProvider defaultMode={getSystemMode()} defaultTheme="lara-blue">
        <App />
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>
);
