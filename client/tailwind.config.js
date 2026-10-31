/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colours from the H.A. Andreou & Co logo (navy and gold)
        gold: {
          DEFAULT: '#B08B4F',
          light: '#C9A870',
          deep: '#B08B4F',
          dark: '#8C6C38'
        },
        brand: '#2A4475',
        wine: '#5A2A33',
        ink: {
          DEFAULT: '#0E1A30',
          800: '#13213B',
          700: '#172844',
          600: '#1F3354'
        },
        paper: {
          DEFAULT: '#F7F6F2',
          dark: '#EEEBE4'
        }
      },
      fontFamily: {
        // Latin and Cyrillic use the first font; Greek and Hebrew glyphs fall back to the next ones
        heading: ['"Playfair Display"', '"Noto Serif Display"', '"Frank Ruhl Libre"', 'Georgia', 'serif'],
        accent: ['"Cormorant Garamond"', '"Noto Serif Display"', '"Frank Ruhl Libre"', 'Georgia', 'serif'],
        body: ['Inter', 'Heebo', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        eyebrow: '0.28em'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        grow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(.2,.7,.2,1) both',
        fadeIn: 'fadeIn 0.8s ease both',
        grow: 'grow 1.2s cubic-bezier(.2,.7,.2,1) both',
        marquee: 'marquee 60s linear infinite',
        'marquee-reverse': 'marqueeReverse 60s linear infinite'
      }
    }
  },
  plugins: []
};
