import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    }
  },
define: {
  'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
}
});
