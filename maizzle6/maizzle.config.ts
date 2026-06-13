import { defineConfig } from '@maizzle/framework'

export default defineConfig({
  output: {
    path: '../resources/views/generated/',
    extension: 'blade.php'
  },
  css: {
    purge: true,
    inline: true,
    shorthand: true
  },
  html: {
    format: true
  }
})
