// vite.config.js
export default {
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'INVALID_PROPTYPE') return;
        defaultHandler(warning);
      }
    }
  }
}
