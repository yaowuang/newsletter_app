import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", ...defaultTheme.fontFamily.sans],
        heading: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
        merriweather: ["var(--font-merriweather)"],
        "playfair-display": ["var(--font-playfair-display)"],
        raleway: ["var(--font-raleway)"],
        creepster: ["var(--font-creepster)"],
        "mountains-of-christmas": ["var(--font-mountains-of-christmas)"],
        pacifico: ["var(--font-pacifico)"],
        ultra: ["var(--font-ultra)"],
        "roboto-condensed": ["var(--font-roboto-condensed)"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
