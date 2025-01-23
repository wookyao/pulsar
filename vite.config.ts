import path from "path";
import { ConfigEnv, defineConfig, loadEnv } from "vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import react from "@vitejs/plugin-react";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const metaEnv = loadEnv(mode, process.cwd());

  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/common/svg")],
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        ["_"]: path.resolve(__dirname, "./src/internal"),
        "#": path.resolve(__dirname, "./types"),
      },
    },
    server: {
      port: Number(metaEnv.VITE_PORT),
    },
    define: {
      "process.env": process.env,
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
