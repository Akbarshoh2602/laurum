import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Frontend runs on http://localhost:3000
// API requests to /api and /uploads are proxied to the backend on :8080
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
    },
  },
})
