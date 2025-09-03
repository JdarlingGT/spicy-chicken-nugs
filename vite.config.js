import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // avoids issues with some packages expecting Node env
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit temporarily while we optimize
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