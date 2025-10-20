/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,css}',
    './components/**/*.{js,ts,jsx,tsx,css}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './app/globals.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#242629',
        background: '#ffffff',
        foreground: '#131615',
        border: '#c1c1c2',
        accent: '#1351AE',
        secondary: '#d46a2f',
        muted: '#6b7280',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FFC107',
        error: '#F44336',
        neutral: '#F3F4F6',
      },
    },
  },
  plugins: [],
}
