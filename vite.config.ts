import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import { run } from 'vite-plugin-run'

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
      ])
    ]
  }
})
