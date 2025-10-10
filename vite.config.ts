import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite does not expose process.env, so we need to define it
    // This makes `process.env.API_KEY` available in the code,
    // sourced from `import.meta.env.VITE_API_KEY` which Vite provides.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
})
