export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        suit: ['"SUIT"', 'sans-serif'],  // SUIT 폰트 등록
      },
      colors: {
        brand: {
          background: '#091104', 
        },
      },
    },
  },
  plugins: [],
}
