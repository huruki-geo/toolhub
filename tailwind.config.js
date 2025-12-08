/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use system fonts stack for best performance and native feel
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Meiryo"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}