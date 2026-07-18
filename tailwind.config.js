/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#141420',
        'surface-2': '#1c1c2b',
        border: '#26263a',
        'f1-red': '#e10600',
        'f1-red-dim': '#b00500',
        text: '#f5f5f7',
        'text-dim': '#9a9aa8',
      },
      fontFamily: {
        display: ['Titillium Web', 'Orbitron', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        900: '900',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgba(10,10,15,0.9)), radial-gradient(circle at 50% 0%, rgba(225,6,0,0.08), transparent 55%)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        goldShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceCue: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        goldShimmer: 'goldShimmer 3s ease infinite',
        bounceCue: 'bounceCue 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
