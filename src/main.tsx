import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App.tsx";

import ThemeProvider from "_/provider/theme-provider.tsx";
import "@/common/styles/index.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider value={{ unstyled: false, ripple: true }}>
      <ThemeProvider defaultMode="light" defaultTheme="lara-blue">
        <App />
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>
);
