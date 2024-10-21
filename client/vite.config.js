import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.VITE_C_PORT, 10);

export default defineConfig({
  plugins: [react()],
   css: {
    postcss: './postcss.config.js',
    },
  server: {
    port: PORT,
    open: true,
  },
});


