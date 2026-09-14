/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexgen: {
          bg: '#070a13',
          surface: '#0d1322',
          card: '#121a2f',
          cardHover: '#16223d',
          border: '#1e2b45',
          borderSubtle: '#172238',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          indigo: '#6366f1',
          emerald: '#10b981',
          textMuted: '#94a3b8',
          textSubtle: '#64748b'
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        display: [
          'Orbitron',
          'Plus Jakarta Sans',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace'
        ]
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        'cyan-indigo-gradient': 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(18, 26, 47, 0.8) 0%, rgba(13, 19, 34, 0.95) 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
