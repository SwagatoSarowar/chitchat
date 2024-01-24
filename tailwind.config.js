/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "primary-color-400": "#11175D",
        "primary-color-500": "#03014C",
        "primary-accent": "#5F35F5",
        "secondary-accent": "#EA6C00",
      },
      backgroundImage: {
        "registration-page": "url('./assets/registration-page-img.png')",
        "login-page": "url('./assets/login-page-img.png')",
      },
    },
  },
  plugins: [],
};
