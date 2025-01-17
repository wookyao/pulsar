import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "#": path.resolve(__dirname, "./types"),
    },
  },
  server: {
    host: "localhost",
    port: Number(process.env.VITE_PORT),
  },
  define: {
    "process.env": process.env
  },
  build: {
    outDir: "dist",
    minify: true,
    // 打包后 去除 console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
    }
  }
})
