import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',    // Extra small devices (larger phones)
        'sm': '640px',    // Small devices (tablets, large phones)
        'md': '768px',    // Medium devices (tablets)
        'lg': '1024px',   // Large devices (laptops/desktops)
        'xl': '1280px',   // Extra large devices (large desktops)
        '2xl': '1536px',  // 2X large devices (larger desktops)
      },
      minWidth: {
        '320': '320px',   // Industry standard minimum width
        '360': '360px',   // Common small phone width
        '375': '375px',   // iPhone SE/13 mini width
        'screen': '100vw', // Full viewport width
      },
      maxWidth: {
        '8xl': '90rem',   // 1440px - optimal for large displays
        '9xl': '100rem',  // 1600px - ultra-wide displays
        'screen-2xl': '1536px', // Max content width for readability
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)', // Safe area for notched devices
        'safe-top': 'env(safe-area-inset-top)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;


