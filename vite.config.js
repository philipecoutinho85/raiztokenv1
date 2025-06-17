import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: './', // 🔥 Essencial para Netlify gerar corretamente os assets
  build: {
    outDir: 'dist', // 🔥 Diretório de saída para Netlify
    emptyOutDir: true // 🔥 Limpa antes de gerar (boas práticas)
  }
});
