/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* transparent-black-12 */
        input: "var(--color-input)", /* subtle-off-white */
        ring: "var(--color-ring)", /* forest-green */
        background: "var(--color-background)", /* warm-white */
        foreground: "var(--color-foreground)", /* soft-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep-charcoal */
          foreground: "var(--color-primary-foreground)", /* warm-white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* rich-earth-brown */
          foreground: "var(--color-secondary-foreground)", /* warm-white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* deep-red */
          foreground: "var(--color-destructive-foreground)", /* warm-white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* subtle-off-white */
          foreground: "var(--color-muted-foreground)", /* medium-gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* forest-green */
          foreground: "var(--color-accent-foreground)", /* warm-white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* warm-white */
          foreground: "var(--color-popover-foreground)", /* soft-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* subtle-off-white */
          foreground: "var(--color-card-foreground)", /* soft-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* natural-green */
          foreground: "var(--color-success-foreground)", /* warm-white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* goldenrod */
          foreground: "var(--color-warning-foreground)", /* deep-charcoal */
        },
        error: {
          DEFAULT: "var(--color-error)", /* deep-red */
          foreground: "var(--color-error-foreground)", /* warm-white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Source Sans Pro', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '150': '150',
        '200': '200',
        '300': '300',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}