import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   build: {
    rollupOptions: {
      external: ['@twa-dev/sdk'], // ⛔ Don't bundle this
    },
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    }
  },
  define: {
    'process.env': process.env
  }
});
