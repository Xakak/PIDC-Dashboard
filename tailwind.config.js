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
        // Light Mode — White/PIDG Design System
        'bg-base':      '#FFFFFF',   // White background
        'bg-surface':  '#F9FAFB',   // Light gray - cards, sidebar
        'bg-elevated': '#FFFFFF',   // White - elevated elements
        'bg-overlay': '#F3F4F6',   // Overlays / modals
        'primary':     '#2563EB',   // Blue - matching login page
        'primary-hover':'#1D4ED8',
        'primary-muted':'#DBEAFE',
        'text-primary':'#111827',
        'text-secondary':'#4B5563',
        'text-muted': '#9CA3AF',
        'border-default':'#E5E7EB',
        'border-hover': '#D1D5E3',
        'success':     '#22C55E',
        'warning':     '#EAB308',
        'error':       '#EF4444',
        'info':        '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
