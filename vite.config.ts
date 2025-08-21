import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Proxy /api to the local AI server during dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
})
