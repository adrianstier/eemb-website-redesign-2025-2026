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
        // Primary Palette - EEMB Style Guide v2.0
        'ocean-deep': '#003660',    // Headers, primary CTAs, footer, navigation
        'ocean-blue': '#047AB5',    // Links, secondary buttons, interactive elements
        'ocean-teal': '#20B2AA',    // Accents, gradients, success states, highlights
        'ucsb-navy': '#003660',     // Text headings, formal elements (same as ocean-deep)
        'ucsb-gold': '#FEBC11',     // Primary CTAs, important callouts, highlights
        'ucsb-coral': '#EF5645',    // Alerts, badges, urgent notices, error states

        // Legacy aliases (for backward compatibility during migration)
        'ocean-coral': '#EF5645',   // Use ucsb-coral instead
        'ocean-light': '#b8e5f1',   // Use ocean-200 instead
        'ocean-mid': '#047AB5',     // Use ocean-blue instead
        'ocean-sunset': '#F97316',  // Use orange-500 instead

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
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config