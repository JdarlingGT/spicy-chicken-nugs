import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // avoids issues with some packages expecting Node env
  },
  server: {
    port: 12000,
    host: '0.0.0.0',
    open: false,
    cors: true,
    allowedHosts: ['work-1-fmrtwonpbmmiscxz.prod-runtime.all-hands.dev'],
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  },
});