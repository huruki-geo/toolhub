import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',     // ← これを必ず明示する
   build: {
    outDir: 'dist',
     rollupOptions: {
      input: {
        main: 'index.html',
        about:'legal-pages.html',
      },
    }
  }
});
