import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      ownReact: './src/ownReact',
    }
  },
  plugins: [react({ jsxImportSource: 'ownReact/jsx' })],
});
