/*
 * FreshCart Design Direction
 * ─────────────────────────
 * Brand Feeling: Premium neighborhood market, focused on organic, high-quality, local produce and curation.
 * Primary Color: #13382B — Deep forest grove green, representing freshness, sustainability, and quality.
 * Accent Color: #E05E2B — Warm citrus orange, CTA pop, warmth and energy, not alarm.
 * Neutral Base: #FAF9F6 — Warm stone off-white, soft paper feel, elegant and high-end.
 * Type Pairing: Playfair Display (headings) + DM Sans (body)
 * Motion Feeling: Springy and refined — 150-300ms transitions with subtle overshoot physics for active interactions.
 * Key Differentiator from Instacart: Editorial design with structured asymmetric grids, high-quality typography, warm palette, and an integrated immersive cart experience.
 */

export const colors = {
  brand: {
    primary: '#13382B',
    primaryHover: '#0E2C22',
    primaryForeground: '#FAF9F6',
    accent: '#E05E2B',
    accentHover: '#C64F20',
    accentForeground: '#FAF9F6',
  },
  neutral: {
    50: '#FAF9F6',
    100: '#F4F1EA',
    200: '#E8E4DA',
    300: '#D6D0C2',
    400: '#BDB5A4',
    500: '#9E9582',
    600: '#807766',
    700: '#635C4E',
    800: '#464137',
    900: '#1C1E1B',
  },
  bg: {
    page: '#FAF9F6',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(28, 30, 27, 0.4)',
  },
  semantic: {
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
  },
  labels: {
    organic: '#13382B',
    sale: '#E05E2B',
    new: '#2563EB',
    local: '#D97706',
    outOfStock: '#6B7280',
  }
};

export const typography = {
  fonts: {
    display: 'Playfair Display, Georgia, serif',
    body: 'var(--font-dm-sans), sans-serif',
    mono: 'monospace',
  },
  scale: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const motion = {
  duration: {
    instant: 0.075,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.7,
  },
  easing: {
    smooth: [0.4, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
  },
};
