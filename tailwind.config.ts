import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        dark: {
          background: "#1F2937",
          text: "#F9FAFB",
          card: "#374151",
        },
      },
    },
  },
  plugins: [],
};

export default config;
