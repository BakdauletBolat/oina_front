import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    allowedHosts: ["ec7d-2a03-32c0-28-b919-f091-3c7f-1256-e843.ngrok-free.app"]
  }
})
