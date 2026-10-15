// BitShift Theme & Design Tokens
// Sole source of truth: bitshift_architectural_learning/DESIGN.md

export const COLORS = {
  // Canvases & Surfaces
  pageBg: '#E6D5B7',           // Warm sand canvas evoking vintage technical bond paper
  parchment: '#E6D5B7',
  cardCream: '#FAF3E8',        // Elevated card surface
  cardCreamAlt: '#F7EFE1',     // Soft secondary card tone
  cardBorder: '#D8C4A0',       // Crisp drafting keyline border
  cardBorderSubtle: 'rgba(30, 34, 61, 0.12)',
  surfaceHigh: '#ECD9BC',      // Deep sand grouping tier
  surfaceHighest: '#E2CEAF',

  // Ink Colors
  obsidian: '#1E223D',         // Midnight obsidian / primary deep navy ink
  primary: '#1E223D',
  primaryContainer: '#151934',
  onPrimary: '#FFFFFF',
  textMuted: '#6E695F',        // Soft charcoal secondary text
  onSurfaceVariant: '#5A5043',

  // Terracotta Flame Accents
  terracotta: '#F54F1B',       // Assertive burnt-orange pop for active states & triggers
  terracottaDark: '#D83F0F',   // Pressed button & high-intensity state
  terracottaSoft: '#FFECE5',   // Highlight wash & pill backgrounds
  flame: '#F54F1B',
  flameLight: '#FDECE7',

  // Functional Accents
  success: '#1B7F4B',
  successLight: '#E8F5E9',
  warning: '#D97706',
  white: '#FFFFFF',
};

export const FONTS = {
  mono: 'Courier, monospace',
  sans: 'System, -apple-system, sans-serif',
};

export const SHADOWS = {
  hardInk: {
    shadowColor: '#1E223D',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 3,
  },
  hardFlame: {
    shadowColor: '#F54F1B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 3,
  },
  subtleCard: {
    shadowColor: '#1E223D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};
