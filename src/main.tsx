import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App.tsx";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import "@/common/styles/index.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <PrimeReactProvider value={{ unstyled: false, ripple: true }}>
        <App />
      </PrimeReactProvider>
    </ThemeProvider>
  </StrictMode>
);
