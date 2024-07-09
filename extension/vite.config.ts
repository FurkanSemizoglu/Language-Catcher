import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { crx } from '@crxjs/vite-plugin'

import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), crx({ manifest })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
