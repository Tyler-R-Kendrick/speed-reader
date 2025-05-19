import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      // Alias to use the local webcomponents source or build
      'webcomponents': resolve(__dirname, '../webcomponents/src/components'),
    },
  },
  server: {
    open: true
  }
});
