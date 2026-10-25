/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colours taken from athanasiadoulaw.com and its logo
        gold: {
          DEFAULT: '#BFA575',
          light: '#D4BF96',
          deep: '#CBA557',
          dark: '#9C8455'
        },
        wine: '#402328',
        ink: {
          DEFAULT: '#0B0A09',
          800: '#141210',
          700: '#1C1A18',
          600: '#262320'
        },
        paper: {
          DEFAULT: '#FAF8F4',
          dark: '#F3EFE7'
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
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
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(.2,.7,.2,1) both',
        fadeIn: 'fadeIn 0.8s ease both',
        grow: 'grow 1.2s cubic-bezier(.2,.7,.2,1) both'
      }
    }
  },
  plugins: []
};
