import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'jspdf',
      'jspdf-autotable'
    ]
  },
  
  plugins: [
    tailwindcss(),
    react(),
  ],
  
  server: {
    proxy: {
      // Proxy API requests to the FastAPI backend
      '/api': 'http://localhost:8000',  
    }
  }
})
