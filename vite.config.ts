import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import { run } from 'vite-plugin-run'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // @ts-ignore

  return {
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
      ]),
      visualizer({
        filename: './public/build/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return

            // React core must be first (base dependency for many libs)
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-core'
            }

            // Large editor libraries
            if (id.includes('@monaco-editor')) return 'monaco-editor'
            if (id.includes('@mdxeditor')) return 'mdx-editor'

            // PDF libraries
            if (id.includes('pdfjs-dist') || id.includes('react-pdf')) return 'pdf'

            // Maps
            if (id.includes('mapbox-gl') || id.includes('@react-google-maps')) return 'maps'

            // Motion/animation (before React aria which may use it)
            if (id.includes('framer-motion') || id.includes('node_modules/motion/')) return 'motion'

            // React aria (large UI library)
            if (id.includes('react-aria') || id.includes('@react-aria') || id.includes('@react-stately')) {
              return 'react-aria'
            }

            // Inertia (routing & SPA)
            if (id.includes('@inertiajs')) return 'inertia'

            // Radix UI components
            if (id.includes('@radix-ui')) return 'radix'

            // Sentry (error tracking)
            if (id.includes('@sentry')) return 'sentry'

            // Tanstack libraries (query, table)
            if (id.includes('@tanstack')) return 'tanstack'

            // DND Kit (drag and drop)
            if (id.includes('@dnd-kit')) return 'dnd-kit'

            // Icon libraries
            if (id.includes('lucide-react') || id.includes('@hugeicons')) return 'icons'

            // Utilities
            if (id.includes('lodash') || id.includes('date-fns')) return 'utils'

            // Toast notifications
            if (id.includes('sonner')) return 'notifications'

            // Markdown and syntax highlighting
            if (id.includes('react-markdown') || id.includes('remark-') || id.includes('rehype-') || id.includes('lowlight')) return 'markdown'

            // All other vendor code
            return 'vendor'
          }
        }
      }
    }
  }
})
