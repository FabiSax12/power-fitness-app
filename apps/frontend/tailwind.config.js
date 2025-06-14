// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(avatar|button|card|checkbox|chip|date-picker|divider|dropdown|input|link|navbar|pagination|progress|select|ripple|spinner|form|calendar|date-input|popover|menu|listbox|scroll-shadow).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};