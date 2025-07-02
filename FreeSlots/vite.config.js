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
    include: ['@twa-dev/sdk'], // ✅ Pre-bundle for dev server
  },
  resolve: {
    alias: {
      '@twa-dev/sdk': path.resolve(__dirname, 'node_modules/@twa-dev/sdk'), // ✅ use __dirname for absolute safety
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /@twa-dev\/sdk/], // ✅ ensure CommonJS support
    },
  },
});
