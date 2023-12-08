import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    server: {
      sourcemap: true,
    },
    coverage: {
      reporter: ['text', 'html', 'clover', 'json', 'lcov', 'text-summary'],
      reportOnFailure: true,
    }
  },
})
