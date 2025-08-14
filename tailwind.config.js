/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        suit: ['"SUIT"', 'sans-serif'],
        geist: ['"Geist"','sans-serif'],
      },
      colors: {
        brand: {
          background: '#091104', // 배경 색상
        },
      },
      animation: {
        'slide-fade': 'slideFade 3s ease-out',     // 부드러운 슬라이드 + 페이드
        'pop-fade': 'popFade 3s ease-out',         // 위로 살짝 튀는 느낌
        'shrink-fade': 'shrinkFade 3s ease-out',   // 작아지면서 사라짐
      },
      keyframes: {
        slideFade: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '10%': { opacity: 1, transform: 'translateY(0)' },
          '70%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-8px)' },
        },
        popFade: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '10%': { opacity: 1, transform: 'scale(1)' },
          '80%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
        shrinkFade: {
          '0%': { opacity: 0, transform: 'scale(1)' },
          '10%': { opacity: 1, transform: 'scale(1)' },
          '80%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
};
