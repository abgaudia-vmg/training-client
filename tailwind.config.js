/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    // Ionic ships its own normalize/structure; Tailwind preflight fights it.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
