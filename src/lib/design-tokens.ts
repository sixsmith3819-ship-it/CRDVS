/**
 * Design Tokens — centralized design system constants for the Aurora UI.
 * These mirror the CSS custom properties defined in globals.css @theme.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
export const colors = {
  // Background layers
  primary: "#0a0e27",
  primaryDark: "#1a1f3a",
  surface: "#252d48",
  elevation: "#3a4254",

  // Aurora accent palette
  auroraPurple: "#7c3aed",
  auroraTeal: "#14b8a6",
  auroraGreen: "#10b981",

  // Status
  statusSuccess: "#10b981",
  statusWarning: "#f59e0b",
  statusDanger: "#dc2626",
  statusInfo: "#3b82f6",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#a0a9c9",
  textTertiary: "#6b7280",

  // Glass / translucent surfaces
  glass: "rgba(255, 255, 255, 0.08)",
  glassHover: "rgba(255, 255, 255, 0.12)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
} as const;

// ---------------------------------------------------------------------------
// Spacing  (4 px base unit)
// ---------------------------------------------------------------------------
export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
  24: "96px",
  32: "128px",
  48: "192px",
  64: "256px",
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
export const shadows = {
  /** Subtle depth for flat surfaces */
  base: "0 1px 3px rgba(0, 0, 0, 0.4)",
  sm: "0 2px 6px rgba(0, 0, 0, 0.4)",
  md: "0 4px 12px rgba(0, 0, 0, 0.5)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.6)",
  xl: "0 16px 48px rgba(0, 0, 0, 0.7)",

  // Aurora-tinted glow shadows
  teal: "0 0 12px rgba(20, 184, 166, 0.35)",
  tealLg: "0 0 24px rgba(20, 184, 166, 0.45)",
  purple: "0 0 12px rgba(124, 58, 237, 0.35)",
  purpleLg: "0 0 24px rgba(124, 58, 237, 0.45)",

  // Glass-morphic card shadow
  glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
} as const;

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------
export const animations = {
  durations: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    verySlow: "500ms",
  },
  easing: {
    default: "ease-in-out",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------
export const borderRadius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  full: "9999px",
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export const typography = {
  fontFamilies: {
    sans: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    mono: "var(--font-geist-mono), 'Courier New', monospace",
  },
  fontSizes: {
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    base: "1rem",    // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
    "2xl": "1.5rem", // 24px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;
