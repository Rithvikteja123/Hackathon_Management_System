import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// CoBuild Fullstack Vite Deployment Config
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
})
