import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    include: ['@twa-dev/sdk'], // Ensure Vite pre-bundles this dependency
  },
  resolve: {
    alias: {
      // Optional but helps Vite resolve the path exactly
      '@twa-dev/sdk': require.resolve('@twa-dev/sdk'),
    },
  },
});
