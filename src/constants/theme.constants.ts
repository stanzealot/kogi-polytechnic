/**
 * ─── Typography Tokens ─────────────────────────────────────────
 * Single source of truth for fonts across the application.
 *
 * To change the app font:
 *   1. Install the new @fontsource package
 *   2. Update the @import in src/styles/index.css
 *   3. Update FONT.family here
 *   4. Update --font-primary in :root (index.css)
 *
 * Everything else inherits automatically.
 * ──────────────────────────────────────────────────────────────
 */
export const FONT = {
  family: {
    primary: "'Urbanist', 'Segoe UI', sans-serif",
    mono: "'Courier New', Courier, monospace",
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

/**
 * ─── Color Tokens ──────────────────────────────────────────────
 * All brand and UI colors in one place.
 * Also reflected as CSS variables in src/styles/index.css.
 * Use these in inline styles or when Tailwind classes aren't enough.
 * ──────────────────────────────────────────────────────────────
 */
export const COLORS = {
  primary: '#20A8D8',
  primaryHover: '#1A91BB',
  primaryLight: '#E8F7FC',

  portal: {
    edu: '#20A8D8',
    ful: '#F86C6B',
    payments: '#4DBD74',
    apply: '#272C33',
  },

  text: {
    title: '#171A1F',
    subtitle: '#1F2329',
    muted: '#6B7280',
    white: '#FFFFFF',
  },

  sidebar: {
    bg: '#272C33',
    active: '#20A8D8',
    hover: '#343A40',
    text: '#FFFFFF',
    textMuted: '#9DA5B1',
    border: '#343A40',
  },

  lecturer: {
    bioBg: '#F3FAFD',
  },

  feedback: {
    success: '#4DBD74',
    danger: '#F86C6B',
    warning: '#F0AD4E',
  },

  border: '#E5E7EB',
  surface: '#F8F9FA',
  white: '#FFFFFF',
} as const;

/**
 * ─── App Metadata ───────────────────────────────────────────────
 */
export const APP = {
  name: 'Kogi State Polytechnic',
  tagline: 'School Portal Home.',
  subtitle: 'Welcome! Choose an option below to continue.',
  poweredBy: 'Powered by Dthriz',
} as const;
