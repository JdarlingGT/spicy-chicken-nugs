import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // avoids issues with some packages expecting Node env
  },
  server: {
    port: 5173,
    open: true,
  },
});