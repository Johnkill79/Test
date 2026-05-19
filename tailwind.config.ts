import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070B",
          900: "#0A0E16",
          850: "#0C121C",
          800: "#0F1724",
          700: "#152236"
        },
        gold: {
          500: "#D6B15E",
          600: "#B9933F"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(214,177,94,0.14), 0 18px 40px rgba(0,0,0,0.65)"
      }
    }
  },
  plugins: []
};

export default config;

