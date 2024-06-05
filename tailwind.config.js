/** @type {import('tailwindcss').Config} */
const { join } = require('path');
module.exports = {
  content: [
    
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  
    extend: {
      screens: {
        '3xl': '1980px',
        '4xl': '2400px',

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 60% 50%, var(--tw-gradient-stops))",
        "gradient":
          "linear-gradient(to right, #453400 , #FFbf00)",
      },
    },
  },
  plugins: [],
};
