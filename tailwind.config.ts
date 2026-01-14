import type { Config } from "tailwindcss";

const config: Config| any = {
  // IMPORTANT: Ensure these paths match your folder structure exactly
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding Hi-Care Brand Colors
        teal: {
          50: '#f0fdfa',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
        },
        slate: {
          900: '#0f172a',
        }
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;