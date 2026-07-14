import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const rootDir = dirname(fileURLToPath(import.meta.url))

// Vite does not copy dotfiles from public/, but Apache needs this file when
// Hostinger serves the built frontend directly.
const hostingerSpaFallback = {
  name: 'hostinger-spa-fallback',
  writeBundle() {
    copyFileSync(
      resolve(rootDir, 'public/.htaccess'),
      resolve(rootDir, 'dist/.htaccess'),
    )
  },
}

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [react(), hostingerSpaFallback],
})
