import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette - EEMB Style Guide v3.0
        'ocean-deep': '#003660',    // Headers, primary CTAs, footer, navigation
        'ocean-blue': '#047AB5',    // Links, secondary buttons, interactive elements
        'ocean-teal': '#20B2AA',    // Accents, gradients, success states, highlights
        'ucsb-navy': '#003660',     // Text headings, formal elements (same as ocean-deep)
        'ucsb-gold': '#FEBC11',     // Primary CTAs, important callouts, highlights
        'ucsb-coral': '#EF5645',    // Alerts, badges, urgent notices, error states

        // NEW: Warm neutrals - gives the site personality and warmth
        'warm': {
          '50': '#FDFCFB',    // Warmest white - subtle cream
          '100': '#FAF9F7',   // Primary warm background (replaces gray-50)
          '200': '#F5F3F0',   // Secondary warm background
          '300': '#E8E4DE',   // Warm border light
          '400': '#D4CEC4',   // Warm border medium
          '500': '#A8A196',   // Warm text muted
          '600': '#7A746A',   // Warm text secondary
          '700': '#5C574F',   // Warm text primary
          '800': '#3D3A35',   // Warm text dark
          '900': '#1F1D1A',   // Warm text darkest
        },

        // NEW: Nature-inspired accent colors
        'sand': '#E8E0D4',          // Beach sand - warm neutral accent
        'kelp': {
          '400': '#2D7D5F',         // Kelp green light
          '500': '#1B5E45',         // Kelp green - nature connection
          '600': '#1B4D3E',         // Kelp green deep
        },
        'sunset': '#E07B4C',        // Santa Barbara sunset (use sparingly)

        // Legacy aliases (for backward compatibility)
        'ocean-coral': '#EF5645',
        'ocean-light': '#b8e5f1',
        'ocean-mid': '#047AB5',
        'ocean-sunset': '#F97316',

        // Ocean palette for gradients and variations
        'ocean': {
          '50': '#f0f9fb',
          '100': '#e0f2f7',
          '200': '#b8e5f1',
          '300': '#7acfe6',
          '400': '#3eb8d9',
          '500': '#20B2AA',   // ocean-teal
          '600': '#047AB5',   // ocean-blue
          '700': '#036a9e',
          '800': '#003660',   // ocean-deep
          '900': '#002847',
        },
      },
      fontFamily: {
        // Sans-serif for body text
        'sans': ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Serif for headings - academic with warmth
        'serif': ['var(--font-literata)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Alias for easy heading usage
        'heading': ['var(--font-literata)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      // Custom animations for personality
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'wave': 'wave 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
      },
      // Extended spacing for more generous layouts
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      // Border radius for softer feel
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      // Box shadows with warmth
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(31, 29, 26, 0.05)',
        'warm': '0 1px 3px 0 rgba(31, 29, 26, 0.1), 0 1px 2px 0 rgba(31, 29, 26, 0.06)',
        'warm-md': '0 4px 6px -1px rgba(31, 29, 26, 0.1), 0 2px 4px -1px rgba(31, 29, 26, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(31, 29, 26, 0.1), 0 4px 6px -2px rgba(31, 29, 26, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(31, 29, 26, 0.1), 0 10px 10px -5px rgba(31, 29, 26, 0.04)',
        'inner-warm': 'inset 0 2px 4px 0 rgba(31, 29, 26, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config