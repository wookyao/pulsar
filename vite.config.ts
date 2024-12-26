import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [reactRouter(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app")
      },
    },
    // 服务器配置
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 构建配置
    build: {
      outDir: 'dist',
      sourcemap: command === 'serve',
      // 生产环境移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build',
          drop_debugger: command === 'build'
        }
      }
    }
  }
});
