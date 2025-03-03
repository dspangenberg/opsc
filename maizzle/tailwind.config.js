/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
module.exports = {
  presets: [
    require('tailwindcss-preset-email'),
  ],
  content: [
    './components/**/*.html',
    './emails/**/*.html',
    './layouts/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Clear Sans', ...defaultTheme.fontFamily.sans],
        facit: ['Clear Sans']
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 600,
        semibold: 600,
        bold: 700
      },
      fontSize: {
        xxs: ['0.67rem', '0.6rem'],
        xs: ['0.85rem', '0.9rem'],
        sm: ['0.9rem', '1.1rem'],
        base: ['1.0rem', '1.2rem'],
        lg: ['1.0rem', '1.20rem'],
        xl: ['1.2rem', '1.30rem'],
        '2xl': ['2.369rem', {lineHeight: '1.25'}],
        '3xl': ['3.157rem', {lineHeight: '1.25'}],
        '4xl': ['4.209rem', {lineHeight: '1.25'}],
        '5xl': ['5.61rem', {lineHeight: '1.25'}]
      },
    }
    }
}
