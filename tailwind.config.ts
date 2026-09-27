import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['var(--font-game)', 'sans-serif'],
        baloo: ['var(--font-game)', 'sans-serif'],
        sans: ['var(--font-game)', 'sans-serif'],
      },
      colors: {
        korean: {
          chili: '#E03131',
          gochujang: '#C92A2A',
          kimchi: '#F03E3E',
          soup: '#FF922B',
          cheese: '#FCC419',
          wood: {
            light: '#EBE4D8',
            medium: '#C4A482',
            dark: '#8C5B3F',
            counter: '#5C3826',
            floor: '#2F1E15',
          },
          cozy: {
            bg: '#FDF8F3',
            card: '#FFFDF9',
            border: '#E8DCCF',
            subtle: '#F4ECE4',
          }
        },
      },
      boxShadow: {
        'cozy': '0 4px 20px -2px rgba(92, 56, 38, 0.12), 0 2px 6px -1px rgba(92, 56, 38, 0.08)',
        'cozy-lg': '0 10px 30px -4px rgba(92, 56, 38, 0.18), 0 4px 12px -2px rgba(92, 56, 38, 0.1)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.7' },
          '50%': { transform: 'translateY(-12px) scale(1.1)', opacity: '0.4' },
          '100%': { transform: 'translateY(-24px) scale(1.3)', opacity: '0' },
        },
        sizzle: {
          '0%, 100%': { transform: 'rotate(-1deg) scale(1)' },
          '50%': { transform: 'rotate(1deg) scale(1.02)' },
        },
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        steam: 'steam 2s ease-out infinite',
        sizzle: 'sizzle 0.25s ease-in-out infinite',
        'bounce-slight': 'bounceSlight 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
export default config
