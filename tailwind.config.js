/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05060a',
        hud: '#7ef0ff',
        violet: '#b48cff',
        rose: '#ff8fab',
        cream: '#fff6ea',
        gold: '#ffd6a5',
      },
      fontFamily: {
        hud: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
        story: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
