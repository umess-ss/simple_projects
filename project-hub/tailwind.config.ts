import type { Config } from "tailwindcss";

/**
 * Design system — light SaaS theme (Linear/Vercel/Stripe register).
 *
 * Rules encoded here so components can't drift:
 * - ONE accent (`accent`), reserved for live/interactive states (<10% of UI).
 * - ONE border radius (`md` = 10px). Pills use `rounded-full` — a different
 *   primitive (dots/tags), not a competing radius.
 * - ONE shadow (`card`), used on hover only; resting state relies on `border`.
 * - Neutral ink-on-white surfaces; every text color ≥ 4.5:1 on white.
 * Components must use these tokens, never raw hex.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FFFFFF", // page background
          raised: "#FAFAFA", // cards, inputs — a barely-there lift
        },
        border: {
          DEFAULT: "#E6E6E9", // hairlines, card edges, dividers
          strong: "#D4D4D8", // input outlines, needs a touch more presence
        },
        ink: {
          DEFAULT: "#18181B", // headings + primary text  (16.9:1 on white)
          muted: "#5B5B66", // secondary text, labels     (6.9:1 on white)
        },
        // The single accent. Live/active/interactive only.
        accent: {
          DEFAULT: "#4F46E5", // indigo 600 (7.0:1 on white)
          hover: "#4338CA", // hover state only
          soft: "#EEF0FE", // faint tint for active chip backgrounds
        },
        // Status is meaning, not a second accent: expressed as dots/text.
        // Only `in-progress` (the live one) borrows the accent.
        status: {
          shipped: "#5B5B66", // = ink-muted
          progress: "#4F46E5", // = accent
          archived: "#A1A1AA", // = a muted gray
        },
        danger: "#DC2626", // destructive actions + validation errors only
      },
      borderRadius: {
        md: "10px", // the one radius
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,24,27,0.04), 0 4px 12px rgba(24,24,27,0.05)", // the one shadow
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      fontSize: {
        // Type scale — sizes paired with their intended line-height.
        display: ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.05" }],
        h2: ["1.5rem", { lineHeight: "1.25" }],
        h3: ["1.0625rem", { lineHeight: "1.4" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        mono: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.2em" }],
      },
    },
  },
  plugins: [],
};

export default config;
