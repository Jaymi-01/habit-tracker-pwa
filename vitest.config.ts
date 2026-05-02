import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
