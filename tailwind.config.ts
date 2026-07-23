import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0D13",
        surface: {
          DEFAULT: "#10141D",
          raised: "#141926",
          hover: "#1A2030",
        },
        border: {
          DEFAULT: "#1E2532",
          strong: "#2A3244",
        },
        ink: {
          primary: "#EDEFF3",
          secondary: "#9098AB",
          muted: "#5B6478",
        },
        accent: {
          DEFAULT: "#7C6CF2",
          hover: "#8E80F5",
          dim: "#2B2748",
        },
        profit: "#2FD68A",
        loss: "#F5566B",
        warn: "#F2AA4C",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.02) inset",
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
