// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(avatar|breadcrumbs|button|card|checkbox|chip|date-picker|divider|drawer|dropdown|input|link|modal|navbar|pagination|progress|select|table|ripple|spinner|form|calendar|date-input|popover|menu|listbox|scroll-shadow|spacer).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};