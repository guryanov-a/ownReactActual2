import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      sourcemap: true,
    },
    coverage: {
      reporter: 'lcov',
    }
  },
})