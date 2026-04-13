import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B2E83', // Royal Violet
          light: '#6B4A9D',
          dark: '#3A1F6B',
        },
        secondary: {
          DEFAULT: '#800020', // Burgundy
          light: '#A01040',
          dark: '#600018',
        },
        accent: {
          DEFAULT: '#722F37', // Wine
          light: '#8A3F47',
          dark: '#5A1F27',
        },
        support: {
          DEFAULT: '#5A0F1C', // Maroon
          light: '#7A1F2C',
          dark: '#4A0F14',
        },
        soft: {
          DEFAULT: '#C9A0DC', // Mauve
          light: '#D9B0EC',
          dark: '#B990CC',
        },
        pro: {
          DEFAULT: '#7A1E1E', // Deep Burgundy
          light: '#9A2E2E',
          dark: '#5A1414',
        },
        con: {
          DEFAULT: '#C9A227', // Antique Gold
          light: '#D9B237',
          dark: '#A98217',
        },
        background: {
          DEFAULT: '#F7F3E9',
          light: '#FFF9F0',
          dark: '#1F102A',
        },
        foreground: {
          DEFAULT: '#2B2B2B',
          dark: '#F5EDE6',
        },
        text: {
          DEFAULT: '#2B2B2B',
          light: '#4B4B4B',
          muted: '#6B6B6B',
          dark: '#F5EDE6',
        },
        debate: {
          stage: '#F7F3E9',
          podium: '#E7E3D9',
          highlight: '#C9A0DC',
        },
        border: {
          DEFAULT: '#E0D6C8',
          dark: '#3A2A4A',
        },
        ring: {
          DEFAULT: '#C9A0DC',
        },
        success: {
          DEFAULT: '#7A9E7E',
          light: '#8ABE8E',
          dark: '#5A7E5E',
        },
        warning: {
          DEFAULT: '#D4A017',
          light: '#E4B027',
          dark: '#B48007',
        },
        error: {
          DEFAULT: '#9B1B30',
          light: '#BB2B40',
          dark: '#7B0B20',
        },
      },
      fontFamily: {
        heading: ['var(--font-cinzel)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'stage-gradient': 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        'podium-gradient': 'linear-gradient(135deg, #1e3a5f 0%, #0f2942 100%)',
        glass:
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;