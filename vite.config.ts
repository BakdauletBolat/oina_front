import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    allowedHosts: ["2201-2a03-32c0-28-b919-acc6-32ce-e7bd-645d.ngrok-free.app"]
  }
})
