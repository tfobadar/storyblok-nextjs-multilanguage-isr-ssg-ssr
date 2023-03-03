module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      screens: {
        xs: '500px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        lgx: '1140px',
        xl: '1280px',
        mob: {'max': '767px'},
      },
      fontFamily: {
        display: ['Gilroy', 'sans-serif'],
        body: ['Graphik', 'sans-serif'],
      },
      fontSize: {
        xs: ['10px', '20px'],
        sm: ['12px', '18px'],
        smm: ['13px', '18px'],
        base: ['14px', '22px'],
        high: ['16px', '22px'],
        lead: ['18px', '28px'],
        md: ['20px', '30px'],
        lgx: ['24px', '28px'],
        lg: ['26px', '32px'],
        xl: ['38px', '42px'],
        xls: ['38px', '42px'],
        xxl: ['40px', '44px'],
      },
      borderWidth: {
        default: '1px',
        '0': '0', 
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '5': '5px',
      },
      extend: {
        colors: {
          'bodybackground': '#1a1a1a',
          'secondary': '#222222',
          'primary': '#b99855',
          'gray': '#AAAAAA',
          'light': '#C7C7C7'
        },
   
      }
    },
  plugins: [],
}