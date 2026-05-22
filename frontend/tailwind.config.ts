import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2874F0",
        secondary: "#FB641B",
        success: "#388E3C",
        background: "#F1F3F6",
      },
    },
  },
  plugins: [],
};

export default config;