/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'

import { defineConfig } from 'vite'
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
  ]
})
