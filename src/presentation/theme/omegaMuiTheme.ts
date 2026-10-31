import { createTheme, alpha } from '@mui/material/styles';

/**
 * OMEGA Stationery — Warm Tactile Minimal Design System
 * Specification from public/uploads/DESIGN.md
 *
 * Charcoal Ink: #111113
 * Soft Paper Base: #F9F8F6
 * Pure Paper Surface: #FFFFFF
 * Wax Seal Vermilion: #DC2626
 * Raw Leather & Ochre: #8C7355
 * Ink Muted: #6E6B66
 * Border Hairline: #E7E5E0
 * Vellum Highlight: #F2EFEB
 */
export const DESIGN_TOKENS = {
  charcoalInk: '#111113',
  paperBase: '#F9F8F6',
  paperPure: '#FFFFFF',
  waxSeal: '#DC2626',
  leatherWarm: '#8C7355',
  inkMuted: '#6E6B66',
  borderHairline: '#E7E5E0',
  vellumHighlight: '#F2EFEB',
  emeraldSuccess: '#16a34a',
};

export const omegaMuiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: DESIGN_TOKENS.charcoalInk,
      light: '#262524',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: DESIGN_TOKENS.waxSeal,
      light: '#EF4444',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: DESIGN_TOKENS.paperBase,
      paper: DESIGN_TOKENS.paperPure,
    },
    text: {
      primary: DESIGN_TOKENS.charcoalInk,
      secondary: DESIGN_TOKENS.inkMuted,
    },
    success: {
      main: DESIGN_TOKENS.emeraldSuccess,
    },
    divider: DESIGN_TOKENS.borderHairline,
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      'Bodoni Moda',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Bodoni Moda, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'Bodoni Moda, serif',
      fontWeight: 500,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontFamily: 'Bodoni Moda, serif',
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'Bodoni Moda, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    button: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: 8, // DESIGN.md: rounded-lg (8px) for cards, soft 4-6px for controls
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px -2px rgba(17, 17, 19, 0.08)',
          },
        },
        contained: {
          backgroundColor: DESIGN_TOKENS.charcoalInk,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#262524',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.04em',
          transition: 'all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
        },
        filled: {
          backgroundColor: DESIGN_TOKENS.vellumHighlight,
          color: DESIGN_TOKENS.inkMuted,
          border: `1px solid ${DESIGN_TOKENS.borderHairline}`,
          '&:hover': {
            backgroundColor: DESIGN_TOKENS.borderHairline,
            color: DESIGN_TOKENS.charcoalInk,
          },
        },
        outlined: {
          borderColor: DESIGN_TOKENS.borderHairline,
          backgroundColor: DESIGN_TOKENS.paperPure,
          color: DESIGN_TOKENS.charcoalInk,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${DESIGN_TOKENS.borderHairline}`,
          boxShadow: '0 2px 8px -2px rgba(17, 17, 19, 0.04), 0 1px 3px 0 rgba(17, 17, 19, 0.02)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 12px 28px -6px rgba(35, 27, 18, 0.08), 0 4px 12px -2px rgba(35, 27, 18, 0.03)',
            borderColor: DESIGN_TOKENS.leatherWarm,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: DESIGN_TOKENS.charcoalInk,
          color: '#FFFFFF',
          fontSize: '0.72rem',
          borderRadius: 4,
          padding: '6px 10px',
        },
        arrow: {
          color: DESIGN_TOKENS.charcoalInk,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.65rem',
          borderRadius: 9999,
        },
      },
    },
  },
});
