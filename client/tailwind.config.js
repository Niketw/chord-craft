module.exports = {
  content: [
    './index.html',                 // If you're using an index.html at the root
    './src/**/*.{js,jsx,ts,tsx}',   // Include all JS, JSX, TS, and TSX files in the src folder
  ],
  theme: {
    extend: {
        colors: {
            primary: "#FFFAF7",
            secondary: "#585656",
            action: "#ff28a9",
            craft_grey: "#262626",
            craft_black: "#222222"
            
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
        }

    },
  },
  plugins: [],
};

