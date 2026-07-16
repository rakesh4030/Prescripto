export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5F7DF2',
        secondary: '#F37C5B',
        lightGray: '#F5F7FF',
      },
      gridTemplateColumns: {
        auto: 'repeat(auto-fit, minmax(220px, 1fr))',
      },

    },
  },
}