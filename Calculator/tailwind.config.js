/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'calculator-bg': '#2d3748',
        'key-bg': {
          number: 'rgba(255, 255, 255, 0.1)',
          operation: '#f59e0b',
          special: 'rgba(156, 163, 175, 0.3)',
          equals: '#3b82f6'
        }
      },
      animation: {
        'button-press': 'buttonPress 0.2s ease-out',
        'error-shake': 'errorShake 0.5s ease-in-out'
      },
      boxShadow: {
        'calculator': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -12px rgba(0, 0, 0, 0.3)',
        'key': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
} 