/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PIDC Design System — match the HTML prototypes exactly
        'bg-base':      '#0A0A0A',   // True black background
        'bg-surface':   '#111111',   // Card / sidebar background
        'bg-elevated':  '#1A1A1A',   // Elevated elements
        'bg-overlay':   '#222222',   // Overlays / modals
        'primary':      '#2C3879',   // Navy blue - matching PIDC logo
        'primary-hover':'#3A4A9A',
        'primary-muted':'#1E2A5E',
        'text-primary': '#FFFFFF',
        'text-secondary':'#888888',
        'text-muted':   '#555555',
        'border-default':'#1A1A1A',
        'border-hover': '#2A2A2A',
        'success':      '#22C55E',
        'warning':      '#EAB308',
        'error':        '#EF4444',
        'info':         '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
