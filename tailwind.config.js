/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#161b22',
          deep: '#0d1117',
          raised: '#1c2128',
          border: '#30363d',
        },
        brand: {
          DEFAULT: '#f97316',
          hover: '#ea6c0a',
          dim: '#1a0d00',
        },
        leave: {
          DEFAULT: '#f59e0b',
          dim: '#1a1200',
        },
        other: {
          DEFAULT: '#8b5cf6',
          dim: '#14082a',
        },
        pool: {
          DEFAULT: '#22c55e',
          dim: '#052e16',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
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

