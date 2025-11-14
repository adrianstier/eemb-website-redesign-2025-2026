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
        // Ocean-inspired palette
        'ocean': {
          '50': '#f0f9fb',
          '100': '#e0f2f7',
          '200': '#b8e5f1',
          '300': '#7acfe6',
          '400': '#3eb8d9',
          '500': '#1fa3ca',
          '600': '#157fa8',
          '700': '#1a6b94',
          '800': '#0d3d52',
          '900': '#0a2433',
        },
        'ocean-deep': '#0a1f2e',
        'ocean-blue': '#1a6b94',
        'ocean-teal': '#1fa3ca',
        'ocean-light': '#b8e5f1',
        'ocean-coral': '#ff6b5a',
        'ocean-sunset': '#ff9d6e',
        'ocean-sand': '#f5e6d3',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config