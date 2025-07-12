
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { run } from 'vite-plugin-run'

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true
    }),
    tailwindcss(),
    react(),
    run([
      {
        name: 'typescript transform',
        run: ['php', 'artisan', 'typescript:transform'],
        pattern: ['app/**/*Data.php', 'app/**/Enums/**/*.php']
      },
      {
        name: 'build routes',
        run: ['php', 'artisan', 'routes:generate'],
        condition: file => file.includes('/routes/')
      }
    ])
  ],
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist']
  },
  build: {
    commonjsOptions: {
      include: [/react-pdf/, /pdfjs-dist/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          pdfWorker: ['pdfjs-dist/build/pdf.worker.min']
        }
      }
    }
  },
  resolve: {
    alias: {
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf'
    }
  }
})
