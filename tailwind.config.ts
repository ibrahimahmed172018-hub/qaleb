import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-bg": "rgb(9, 13, 22)",
        "brand-surface": "rgba(15, 23, 42, 0.6)",
        "brand-accent-1": "rgb(16, 185, 129)",
        "brand-accent-2": "rgb(0, 245, 160)",
        "brand-text-primary": "rgb(255, 255, 255)",
        "brand-text-secondary": "rgb(148, 163, 184)",
        "brand-border": "rgba(30, 41, 59, 0.8)",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
