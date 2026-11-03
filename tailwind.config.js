/** @type {import('tailwindcss').Config} */
const tok = (n) => `rgb(var(--c-${n}) / <alpha-value>)`;
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: tok("base"), fg: tok("fg"), soft: tok("soft"), muted: tok("muted"), faint: tok("faint"), accent: tok("accent"), panel: tok("panel"), cy: tok("cy") },
      fontFamily: { mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"] },
    },
  },
  plugins: [],
};
