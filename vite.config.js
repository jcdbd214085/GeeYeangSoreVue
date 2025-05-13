import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7022', // ASP.NET Core 伺服器位址
        changeOrigin: true,
        secure: false,
      },
      '/hub': {
        target: 'https://localhost:7022', // ASP.NET Core SignalR 伺服器位址
        ws: true, // 支援 WebSocket
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
