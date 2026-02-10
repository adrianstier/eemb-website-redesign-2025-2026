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
        // ================================================
        // EEMB Design System v4.0 - "Pacific Naturalism"
        // ================================================

        // Primary Ocean Palette - richer, more dramatic
        'ocean-deep': '#002244',      // Deep sea navy - headers, footer
        'ocean-midnight': '#001a33',  // Midnight blue - dark sections
        'ocean-blue': '#0369a1',      // Pacific blue - primary actions
        'ocean-teal': '#0d9488',      // Kelp forest teal - accents
        'ocean-light': '#7dd3fc',     // Shallow water - highlights

        // UCSB Brand Colors
        'ucsb-navy': '#003660',       // Official UCSB navy
        'ucsb-gold': '#FEBC11',       // Iconic UCSB gold
        'ucsb-coral': '#ef4444',      // Coral accent

        // Bioluminescent Accents - magical, distinctive
        'bioluminescent': '#22d3ee',  // Cyan glow - special highlights
        'bioluminescent-soft': '#a5f3fc', // Softer glow

        // Warm Neutrals - sophisticated warmth
        'warm': {
          '50': '#FEFDFB',     // Cream white
          '100': '#FAF8F5',    // Warm background
          '200': '#F4F1EC',    // Card backgrounds
          '300': '#E8E3DB',    // Light borders
          '400': '#D1C9BC',    // Medium borders
          '500': '#9C9284',    // Muted text
          '600': '#6B6156',    // Secondary text
          '700': '#4A433B',    // Primary body text
          '800': '#2D2924',    // Dark text
          '900': '#1A1714',    // Near black
        },

        // Nature-Inspired Accents
        'sand': '#E8DFD1',           // Beach sand
        'driftwood': '#8B7355',      // Driftwood brown
        'kelp': {
          '50': '#ecfdf5',           // Kelp green lightest
          '400': '#34d399',          // Kelp green light
          '500': '#10b981',          // Kelp green
          '600': '#059669',          // Kelp deep
        },
        'sunset': {
          '400': '#fb923c',          // Santa Barbara sunset light
          '500': '#f97316',          // Sunset orange
          '600': '#ea580c',          // Sunset deep
        },
        'tide-pool': {
          '400': '#a78bfa',          // Sea anemone purple
          '500': '#8b5cf6',          // Purple accent
        },

        // Ocean gradient stops
        'ocean': {
          '50': '#f0fdff',
          '100': '#ccfbff',
          '200': '#99f6ff',
          '300': '#5eead4',
          '400': '#2dd4bf',
          '500': '#14b8a6',
          '600': '#0369a1',
          '700': '#0c4a6e',
          '800': '#002244',
          '900': '#001a33',
          '950': '#000d1a',
        },
      },

      fontFamily: {
        // Body font - DM Sans: warm, friendly, highly readable
        'sans': ['var(--font-dm-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        // Heading font - Fraunces: characterful, academic, distinctive
        'heading': ['var(--font-fraunces)', 'Georgia', 'serif'],
        'display': ['var(--font-fraunces)', 'Georgia', 'serif'],
        'serif': ['var(--font-fraunces)', 'Georgia', 'serif'],
      },

      fontSize: {
        // Custom fluid type scale
        'display-xl': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
      },

      // Enhanced animations for organic movement
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',

        // Organic/nature animations
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'floatSlow 12s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'sway': 'sway 6s ease-in-out infinite',
        'wave': 'wave 10s ease-in-out infinite',
        'ripple': 'ripple 2s ease-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',

        // Scroll-triggered
        'reveal': 'reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',

        // Bioluminescent glow
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(-1deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-10px) scaleY(1.02)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.2), 0 0 40px rgba(34, 211, 238, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(34, 211, 238, 0.2)' },
        },
      },

      // Extended spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      // Softer border radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Rich, layered shadows
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(26, 23, 20, 0.05)',
        'warm': '0 2px 8px -2px rgba(26, 23, 20, 0.1), 0 1px 2px 0 rgba(26, 23, 20, 0.06)',
        'warm-md': '0 8px 24px -8px rgba(26, 23, 20, 0.12), 0 4px 8px -4px rgba(26, 23, 20, 0.08)',
        'warm-lg': '0 16px 48px -12px rgba(26, 23, 20, 0.15), 0 8px 16px -8px rgba(26, 23, 20, 0.08)',
        'warm-xl': '0 24px 64px -16px rgba(26, 23, 20, 0.18), 0 12px 24px -8px rgba(26, 23, 20, 0.1)',
        'inner-warm': 'inset 0 2px 4px 0 rgba(26, 23, 20, 0.06)',

        // Ocean depth shadows
        'ocean': '0 8px 32px -8px rgba(0, 34, 68, 0.25)',
        'ocean-lg': '0 20px 60px -15px rgba(0, 34, 68, 0.3)',

        // Glow effects
        'glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-gold': '0 0 30px rgba(254, 188, 17, 0.4)',
        'glow-teal': '0 0 25px rgba(13, 148, 136, 0.35)',
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Custom gradients via backgroundImage
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #002244 0%, #0369a1 50%, #0d9488 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)',
        'gradient-bioluminescent': 'linear-gradient(135deg, #0d9488 0%, #22d3ee 50%, #a5f3fc 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FEFDFB 0%, #FAF8F5 100%)',
        'gradient-dark-fade': 'linear-gradient(180deg, transparent 0%, #002244 100%)',
        'gradient-radial-glow': 'radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
      },

      // Transitions
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}

export default config
