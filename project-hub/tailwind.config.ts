import type { Config } from "tailwindcss";

/**
 * Design system — Modern Minimalist (.claude/skills/themes/modern-minimalisti.md).
 * Grayscale: charcoal #36454F, slate gray #708090, light gray #D3D3D3, white.
 *
 * Rules encoded here so components can't drift:
 * - Monochrome: the "accent" IS charcoal. Interactive text needs a second
 *   affordance (underline, border, fill) — color alone can't signal it here.
 * - Slate gray #708090 is 4.05:1 on white — below the 4.5:1 text floor, so
 *   it's reserved for non-text roles (status dots); muted TEXT uses the
 *   darker #5C6B78 (5.5:1) from the same hue.
 * - ONE border radius (`md` = 10px). Pills use `rounded-full` — a different
 *   primitive (dots/tags), not a competing radius.
 * - ONE shadow (`card`), used on hover only; resting state relies on `border`.
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
          DEFAULT: "#FFFFFF", // page background (theme: White)
          raised: "#F5F6F7", // cards, inputs — a whisper of slate
        },
        border: {
          DEFAULT: "#D3D3D3", // hairlines, dividers (theme: Light Gray)
          strong: "#B8BFC5", // input outlines, needs a touch more presence
        },
        ink: {
          DEFAULT: "#36454F", // headings + primary text (theme: Charcoal, 9.7:1)
          muted: "#5C6B78", // secondary text — darkened slate (5.5:1)
        },
        // Monochrome accent = charcoal. Interactive text also carries an
        // underline/border/fill so state never rides on color alone.
        accent: {
          DEFAULT: "#36454F", // = charcoal
          hover: "#24313B", // hover state only — a step darker
          soft: "#ECEFF1", // faint slate tint for active chip backgrounds
        },
        // Status is meaning: dot + text label, never the dot alone.
        status: {
          shipped: "#36454F", // charcoal — done, solid
          progress: "#708090", // slate (theme: Slate Gray) — mid-tone, non-text
          archived: "#B8BFC5", // faded — matches border-strong
        },
        danger: "#DC2626", // destructive actions + validation errors only
      },
      borderRadius: {
        md: "10px", // the one radius
      },
      boxShadow: {
        card: "0 1px 2px rgba(54,69,79,0.05), 0 4px 12px rgba(54,69,79,0.06)", // the one shadow
      },
      fontFamily: {
        // Theme: DejaVu Sans Bold for headers, DejaVu Sans for body.
        // Same family in both roles — hierarchy comes from weight + size.
        display: ["var(--font-dejavu-sans)", "DejaVu Sans", "Verdana", "sans-serif"],
        body: ["var(--font-dejavu-sans)", "DejaVu Sans", "Verdana", "sans-serif"],
        mono: ["var(--font-dejavu-mono)", "DejaVu Sans Mono", "monospace"],
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
