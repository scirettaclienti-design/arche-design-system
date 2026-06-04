// src/tailwind/preset.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "var(--color-ink)", 2: "var(--color-ink-2)", 3: "var(--color-ink-3)" },
        oxblood: "var(--color-oxblood)",
        bone: { DEFAULT: "var(--color-bone)", dim: "var(--color-bone-dim)", faint: "var(--color-bone-faint)" },
        gold: { DEFAULT: "var(--color-gold)", bright: "var(--color-gold-bright)", deep: "var(--color-gold-deep)" },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-serif)"],
        secret: ["var(--font-secret)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        xs: "var(--fs-xs)", sm: "var(--fs-sm)", base: "var(--fs-base)",
        lg: "var(--fs-lg)", xl: "var(--fs-xl)", "2xl": "var(--fs-2xl)",
        "3xl": "var(--fs-3xl)", "4xl": "var(--fs-4xl)",
      },
      lineHeight: {
        tight: "var(--leading-tight)", snug: "var(--leading-snug)",
        normal: "var(--leading-normal)", loose: "var(--leading-loose)",
      },
      letterSpacing: {
        tight: "var(--tracking-tight)", base: "var(--tracking-base)", eyebrow: "var(--tracking-eyebrow)",
      },
      maxWidth: { text: "var(--col-text)", wide: "var(--col-wide)", narrow: "var(--col-narrow)" },
      transitionTimingFunction: { greek: "var(--ease-greek)", "out-quart": "var(--ease-out-quart)" },
      transitionDuration: {
        quick: "var(--dur-quick)", medium: "var(--dur-medium)",
        slow: "var(--dur-slow)", curtain: "var(--dur-curtain)",
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;
