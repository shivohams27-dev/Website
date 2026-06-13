import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        card: "var(--card)",
        border: "var(--border)",
        accent: "var(--accent)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        syne: ["var(--font-syne)"],
        jetbrains: ["var(--font-jetbrains-mono)"],
        dm: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
