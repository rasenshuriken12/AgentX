/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        agentx: {
          bg:       "#f7f8fa",
          card:     "#ffffff",
          border:   "#e5e7eb",
          text:     "#111827",
          muted:    "#6b7280",
          teal:     "#0d9488",
          tealSoft: "#ccfbf1",
          green:    "#16a34a",
          greenSoft:"#dcfce7",
          yellow:   "#f59e0b",
          yellowSoft:"#fef3c7",
          red:      "#dc2626",
          redSoft:  "#fee2e2",
          purple:   "#7c3aed",
          purpleSoft:"#ede9fe",
          blue:     "#2563eb",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}