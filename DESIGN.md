# OMEGA Stationery — Stitch Design System (`DESIGN.md`)

## 1. Design Philosophy
- **Clean & High-Contrast**: Prioritize bold visuals, product imagery, and decisive pricing over cluttered paragraphs.
- **Uncluttered E-Commerce Hierarchy**: Strip away extraneous technical specs from primary cards; show only essential purchase decision drivers (Product Name, Price, Rating, Fast Action).
- **Stitch Color Harmony**: Bold crimson red accents grounded by deep charcoal obsidian and clean white/soft-gray canvases.

---

## 2. Color Palette & Semantic Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--color-canvas` | `#f8f9fa` | Subtle, clean off-white background |
| `--color-surface` | `#ffffff` | Pure white card surfaces and elevated containers |
| `--color-surface-hover`| `#f3f4f6` | Soft hover states for pills and secondary buttons |
| `--color-border` | `#e5e7eb` | Crisp hairline 1px borders |
| `--color-border-subtle`| `#f1f5f9` | Ultra-soft internal dividers |
| `--color-primary` | `#0f172a` | Deep obsidian slate for headings and dark contrast |
| `--color-accent` | `#dc2626` | Vivid OMEGA crimson red for badges, CTAs, and deals |
| `--color-accent-dark` | `#b91c1c` | Deep rich red for gradients and pressed button states |
| `--color-text-main` | `#111827` | High-contrast dark charcoal text |
| `--color-text-muted`| `#64748b` | Clean slate text for secondary metadata |
| `--color-success` | `#16a34a` | Ratings, in-stock badges, and confirmed savings |

---

## 3. Typography & Micro-Hierarchy
- **Primary Headings**: Modern geometric font (`Outfit`, `Plus Jakarta Sans`), font-weight 800/900, tracking `-0.025em`.
- **Labels & Numbers**: Monospace / numeric styling (`font-mono`, `font-bold`) for prices (`TSh 1,500`), carton volumes, and countdown clocks.
- **Micro-Badges**: `text-[10px]` uppercase tracking-wider pills with `rounded-md` or `rounded-full`.
- **Clutter Elimination Rule**: Limit product card titles to 1 crisp line (`line-clamp-1`), remove long descriptions, keep specifications limited to essential tags (e.g. `192p`, `48/ctn`).

---

## 4. Component Layout Guidelines
1. **Top Category Nav**: Rounded circular icons (44px–52px) with 1-word or 2-word labels; no bloated descriptions.
2. **Hero Carousel**: High-impact product showcase, strong single headline, 1-2 punchy CTA buttons, bold discount badge.
3. **Product Rails & Cards**:
   - Aspect-square image container with clean white background.
   - Clean star rating badge (`★ 4.9`).
   - Price in bold prominent red / dark charcoal.
   - One-tap "Add" or "WhatsApp" button.
4. **Anatomy Teardown**: Interactive 4-point visual breakdown with clear hotspot pins and concise benefits, avoiding heavy walls of text.

