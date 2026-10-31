import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf-8');
const startIdx = css.indexOf(':root {');
const endIdx = css.indexOf('--navy: #111113;');

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `:root {
  /* ==================== USER CUSTOM ARTISANAL PALETTE ==================== */
  /* 1. DARK RED:    #6B140B (Deep Burgundy / Roasted Wine) */
  /* 2. LIGHT BEIGE: #D8C3A5 (Warm Sand / Paper Linen) */
  /* 3. SOFT ORANGE: #E9A858 (Warm Amber Apricot) */
  /* 4. RED-ORANGE:  #9E3618 (Terracotta Rust / Burnt Sienna) */
  /* 5. CANVAS:      #FAF6F0 (Warm Parchment Cream) */
  /* 6. TEXT DARK:   #26130F (Deep Roasted Espresso) */
  /* 7. BORDER:      #E5D8C8 (Warm Hairline Sand) */

  --clr-dark-red: #6B140B;
  --clr-light-beige: #D8C3A5;
  --clr-soft-orange: #E9A858;
  --clr-red-orange: #9E3618;
  --clr-canvas: #FAF6F0;
  --clr-text-dark: #26130F;
  --clr-text-muted: #7D685E;
  --clr-border: #E5D8C8;

  --clr-main: #6B140B;
  --clr-gold: #E9A858;
  --clr-gold-light: #FBF4E8;
  --clr-main-50: #FAF6F0;
  --clr-main-100: #F3EDE2;
  --clr-main-200: #E5D8C8;
  --clr-main-300: #D8C3A5;
  --clr-main-400: #A89584;
  --clr-main-500: #7D685E;
  --clr-main-600: #52423A;
  --clr-main-700: #3B2822;
  --clr-main-900: #26130F;
  --clr-copper: #9E3618;
  --clr-amber: #E9A858;
  --clr-copper-gradient: linear-gradient(90deg, #6B140B, #9E3618, #E9A858);
  --clr-white: #FFFFFF;
  --clr-bg: #FAF6F0;
  --clr-black: #26130F;

  /* Canonical Tokens */
  --primary: #9E3618;               /* Red-Orange Primary Accent */
  --primary-dark: #6B140B;          /* Dark Red Primary Header */
  --primary-light: #B84725;
  --accent: #E9A858;                /* Soft Orange Warm Foil */
  --accent-light: #F4C486;
  --bg: #FAF6F0;                    /* Warm Linen Canvas */
  --surface: #FFFFFF;
  --surface-alt: #F3EDE2;
  --surface-dark: #E5D8C8;
  --text: #26130F;                  /* Roasted Espresso Text */
  --text-light: #52423A;
  --muted: #7D685E;
  --border: #E5D8C8;
  --success: #16a329ff;
  --danger: #9E3618;

  `;

  css = css.substring(0, startIdx) + newBlock + css.substring(endIdx);
  fs.writeFileSync('src/index.css', css, 'utf-8');
  console.log('✓ Updated root tokens in src/index.css with User Palette');
}
