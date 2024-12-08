import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/lafontaine-recitation-training/",
  plugins: [react()],
  server: {
    port: 3003, // You can change this to any port you prefer
    strictPort: true // This will fail if port is already in use instead of trying another port
  }
})
