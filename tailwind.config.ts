import type { Config } from "tailwindcss";
import {PluginAPI} from "tailwindcss/types/config";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
      },
      colors: {
        white: "#EDEDED",
        gray: "#888888",
        contrast: "#0A0A0A",
        blue: "#3b88e9",
        "blue-light": "#3b88e925",
      }
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.gradient-text': {
          backgroundImage: 'linear-gradient(180deg, #fff, #adadad)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      });
      addUtilities({
        '.transition-3': {
          transition: 'all 0.3s',
        },
      });
    },
  ],
} satisfies Config;
