import forms from '@tailwindcss/forms'
import animate from 'tailwindcss-animate'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
    './resources/js/**/*.ts'
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Clear Sans', ...defaultTheme.fontFamily.sans]
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 500,
        bold: 700
      },
      fontSize: {
        xxs: ['0.67rem', '0.6rem'],
        xs: ['0.74rem', '0.9rem'],
        sm: ['0.85rem', '0.95rem'],
        base: ['0.90rem', '1.0rem'],
        lg: ['1.0rem', '1.20rem'],
        xl: ['1.2rem', '1.30rem'],
        '2xl': ['2.369rem', { lineHeight: '1.25' }],
        '3xl': ['3.157rem', { lineHeight: '1.25' }],
        '4xl': ['4.209rem', { lineHeight: '1.25' }],
        '5xl': ['5.61rem', { lineHeight: '1.25' }]
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        6: 'repeat(6, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
        32: 'repeat(32, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-28': 'span 28 / span 28',
        'span-32': 'span 32 / span 32'
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
        28: '28',
        29: '29',
        30: '30',
        31: '31',
        32: '32',
        33: '33',
        34: '34'
      },
      colors: {
        gray: colors.gray,
        stone: colors.stone,
        neutral: colors.neutral,
        blue: colors.blue,
        red: colors.red,
        white: colors.white,
        green: colors.green,
        zinc: colors.zinc,
        black: colors.black,
        indigo: colors.indigo,
        yellow: colors.yellow,
        orange: colors.orange,
        transparent: colors.transparent,
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      }
    }
  },

  plugins: [forms, animate]
}
