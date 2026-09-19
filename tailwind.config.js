/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rich Champagne Gold palette (matching the reference image)
        ivory: {
          DEFAULT: '#FAF6EF',
          light: '#FEFCF8',
          dark: '#F2EAD8',
        },
        champagne: {
          DEFAULT: '#E8D5A8',
          light: '#F0E3C0',
          dark: '#D4B87A',
          border: '#CBB06A',
        },
        taupe: {
          DEFAULT: '#A8927A',
          light: '#C4AE96',
          dark: '#8A7260',
        },
        blush: {
          DEFAULT: '#E8D5C0',
          light: '#F5EDE0',
          dark: '#D4B898',
        },
        terracotta: {
          DEFAULT: '#A87855',
          light: '#C4986E',
          dark: '#8A5E3F',
        },
        weddingBrown: {
          DEFAULT: '#3D2B1A',
          light: '#5C4228',
          dark: '#2A1D10',
        },
        weddingText: {
          DEFAULT: '#2A1D10',
          muted: '#6B5840',
          subtle: '#8C7460',
        },
        gold: {
          DEFAULT: '#C8A84B',
          light: '#DDBE6E',
          dark: '#A88830',
          accent: '#D4AF37',
          bright: '#F0D060',
          deep: '#8B6914',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'wedding': '0 10px 30px -10px rgba(61, 43, 26, 0.10)',
        'wedding-lg': '0 20px 40px -15px rgba(61, 43, 26, 0.16)',
        'gold-glow': '0 0 30px rgba(200, 168, 75, 0.45)',
        'gold-inner': 'inset 0 1px 3px rgba(200, 168, 75, 0.3)',
        'envelope': '0 25px 60px -15px rgba(61, 43, 26, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'gold-shimmer': 'shimmer 2.5s infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
        'spin-slow': 'spin 35s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '1' },
          '25%, 75%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
