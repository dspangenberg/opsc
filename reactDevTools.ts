import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'

const reactDevTools = (): PluginOption => {
  return {
    name: 'react-devtools',
    apply: 'serve', // Only apply this plugin during development
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: 'http://localhost:8097'
            },
            injectTo: 'head'
          }
        ]
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), reactDevTools()]
})
