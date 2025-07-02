import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
  },
  optimizeDeps: {
    include: ['@twa-dev/sdk'], // pre-bundle @twa-dev/sdk for dev server
  },
  resolve: {
    alias: {
      '@twa-dev/sdk': path.resolve('./node_modules/@twa-dev/sdk'), // proper alias using path.resolve
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /@twa-dev\/sdk/], // bundle @twa-dev/sdk properly for production
    },
  },
});
