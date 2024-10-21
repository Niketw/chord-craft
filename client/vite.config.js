import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
   css: {
    postcss: './postcss.config.js',
    },
  server: {
    port: 3000, // Set Vite to run on port 3000
    open: true, // Automatically open the app in your browser
  },
});


