/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Body / UI
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        // Display headings (LGH brand)
        display: ['Archivo', 'system-ui', 'sans-serif'],
        // Eyebrows, labels, job refs, spec numbers
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Light concrete ground (warm neutral off-whites, LGH brand)
        surface: {
          DEFAULT: '#F6F5F2',
          deep: '#F1F0EC',
          raised: '#FFFFFF',
          border: '#E3E1DC',
        },
        // LGH crimson (primary brand)
        brand: {
          DEFAULT: '#B11722',
          hover: '#97121C',
          deep: '#7C0F18',
          dim: '#2A0C0F',
        },
        // Functional status colours
        leave: {
          DEFAULT: '#E0A82E',
          dim: '#231A05',
        },
        other: {
          DEFAULT: '#7C8794',
          dim: '#14181C',
        },
        pool: {
          DEFAULT: '#3F9E6A',
          dim: '#0A1A11',
        },
      },
      boxShadow: {
        // Grounded, low-spread (brand pack)
        card: '0 1px 2px rgba(0,0,0,0.4)',
        lift: '0 8px 24px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        brand: '8px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.22s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
