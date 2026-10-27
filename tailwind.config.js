/** @type {import('tailwindcss').Config} */

// =========================================================================
// PLATFORM THEME CONFIGURATION
// To change platform colors across the whole application, update this palette:
// =========================================================================
const themeColors = {
  // Primary: Main platform brand color (Deep Cricket Navy)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#0B132B',
    DEFAULT: '#1E3A8A',
    hover: '#1D4ED8',
    active: '#1E40AF',
    foreground: '#FFFFFF',
  },

  // Secondary: Highlight & CTA brand color (Vibrant Cricket Orange)
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
    DEFAULT: '#F97316',
    hover: '#EA580C',
    active: '#C2410C',
    foreground: '#FFFFFF',
  },

  // Surface: Cards, panels, modals and layout surfaces
  surface: {
    DEFAULT: '#FFFFFF',
    muted: '#F8FAFC',
    card: '#FFFFFF',
    dark: '#0B132B',
  },

  // Border: Standard border keywords
  border: {
    DEFAULT: '#E2E8F0',
    muted: '#F1F5F9',
    dark: '#1E293B',
  },

  // Muted: Subdued text and backgrounds
  muted: {
    DEFAULT: '#64748B',
    foreground: '#94A3B8',
    background: '#F1F5F9',
  },
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        accent: themeColors.secondary, // Aliased for seamless compatibility
        surface: themeColors.surface,
        border: themeColors.border,
        muted: themeColors.muted,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.08)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
