import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => {
  // ⬇️ 載入 .env 變數
  const env = loadEnv(mode, process.cwd(), "VITE");

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: ["vue.jayceeswlrorobot.win", "localhost"],
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        "/hub": {
          target: env.VITE_API_BASE_URL,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
