module.exports = {
  content: [
    './index.html',                 // If you're using an index.html at the root
    './src/**/*.{js,jsx,ts,tsx}',   // Include all JS, JSX, TS, and TSX files in the src folder
  ],
  theme: {
    extend: {
        colors: {
            primary: "#FFFAF7",
            secondary: "#ffb6ff",
            action: "#ff28a9",
            craft_grey: "#0b042c",
            craft_black: "#0f0423",
            craft_blue: "#0d00a8",
            craft_pink: "#dc0084",
            craft_gradient_blue: "#003baa",
            craft_gradient_pink: "#70008c",
            craft_gradient_purple: "#400c9a",

        },

        fontSize: {
            'sm': '0.66rem',
            'base': '1rem',
            'lg' : '1.5rem',
            'xl': '3.375rem',
            '2xl': '5.0625rem',
            '3xl': '7.59375rem'
        },

        fontFamily: {
            default: 'SpaceGrotesk-Variable',
        },

        keyframes: {
            blink: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0 },
            }
        },
        animation: {
            blink: 'blink 0.5s step-end infinite',
        }
    },
  },
  plugins: [],
};

