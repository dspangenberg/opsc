
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

/*
|-------------------------------------------------------------------------------
| Production config                       https://maizzle.com/docs/environments
|-------------------------------------------------------------------------------
|
| This is the production configuration that Maizzle will use when you run the
| `npm run build` command. Settings here will be merged on top of the base
| `config.js`, so you only need to add the options that are changing.
|
*/

/** @type {import('@maizzle/framework').Config} */
export default {
  build: {
    options: {
      posthtml: {
        expressions: {
          unescapeDelimiters: ['{!!', '!!}']
        }
      }},
    output: {
      path: '../resources/views/generated/',
      extension: 'blade.php'
    },
  },
  css: {
    inline: true,
    purge: true,
    shorthand: true,
  },
  prettify: true,
}
