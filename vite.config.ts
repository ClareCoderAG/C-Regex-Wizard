import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // Important for GitHub Pages: Use relative base path so assets load correctly
    // regardless of the subdirectory (e.g. /C-Regex-Wizard/)
    base: './',
    define: {
      // Pass the API key from build environment to the client
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})