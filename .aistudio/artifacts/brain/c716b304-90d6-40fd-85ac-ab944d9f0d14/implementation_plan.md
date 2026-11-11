# Seamless Full-Card Studio Banner & Collection Card Visual Refinement

This update eliminates the inner rectangular image box on the **Counter Book Q3, Hardcover** light-red banner so the studio scene flows seamlessly across the entire card on both mobile and desktop, and fixes the **Shop by Collection** cards so each card renders a single, properly scaled studio book with zero duplicate background edges.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both visual decisions below incorporate your confirmed preferences from our clarification step, alongside the Box pricing (`TSh 57,000 / Box`) update.

- **Confirmed Decision 1 (Counter Book Q3 Light-Red Banner)**: Render a **full-card studio photo background across both mobile and desktop** with no separate inner rectangle frame around the book, paired with the official Box price (`TSh 57,000 / Box`).
- **Confirmed Decision 2 (Shop by Collection Cards)**: Render a **single clean studio background with a smaller, zoomed-out book and zero double edges**, replacing the two-image stack that caused the top of the book to appear twice.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. Unifies the **Counter Book Q3, Hardcover** featured banner into a single continuous soft light-red studio surface across mobile, tablet, and desktop—removing the nested rectangular image frame on mobile so the hardcover book and 180° lay-flat spread sit naturally inside the card.
  2. Fixes all 4 **Shop by Collection** cards (`Counter Books`, `Exercise Books`, `Kraft Bahasha`, `Office Registers`) so each card displays a single, zoomed-out product on its white pedestal and wooden desk without any duplicate book edge peeking behind it.
  3. Ensures all displayed prices reflect official **Box / Carton TSh pricing** (`TSh 57,000 / Box`).
- **Target Audience / Persona**: Wholesale stationery buyers, school procurement officers, and retail customers browsing on mobile phones and desktop screens across Tanzania.
- **Key Value**: Delivers a clean, studio-grade editorial presentation where typography never collides with product photography and no nested image boxes or doubled edges distract the buyer.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Browsing Collections (Mobile & Desktop)**: Users swipe or view the 2-column *Shop by Collection* grid. Each card shows crisp typography on the left 55% and a single, uncropped book on a white pedestal with pen holder and plant on the right 45%. Clicking a card opens the slide-over specification drawer showing Box prices (`TSh 56,000 / Box`, `TSh 57,000 / Box`, `TSh 60,000 / Box`).
  - **Featured Banner Purchase Flow**: Users view the *Counter Book Q3, Hardcover* banner in a soft pastel crimson-rose studio palette (`#F2C4C0` to `#F5CCC8`), see the official Box rate (`TSh 57,000 / Box · 36 Pcs`), and tap `BUY NOW` to add to cart and open the cart drawer.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm archival stationery catalog with tactile studio photography and generous negative space.
  - *Color Palette & Mood*:
    - Collection Cards: Warm studio cream wall (`#EBE1D1` / `#EFE6D8`) meeting a natural oak desk surface (`#DFC8A9` / `#D5B995`) with a subtle left-edge warm shadow.
    - Featured Q3 Banner: Soft light-red / pastel rose-coral studio surface (`#ECC0BC` to `#F4CAC6`) with high-contrast charcoal-ink typography (`#09090B`) and crimson primary CTA (`#C92A2A`).
  - *Typography & Hierarchy*: High-contrast serif display headings (`Playfair Display`), structured sans-serif body copy (`Plus Jakarta Sans`), and tabular monospace pricing (`JetBrains Mono`).
  - *Component Styling & Layout*: 24px rounded card containers (`rounded-[24px]`), single-layer studio image positioning with smooth CSS gradient masking into matching studio wall/desk surfaces, and responsive container queries.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Single-Layer Studio Composition on Collection Cards (Eliminating the Double Book Edge)**
  - *Chosen Approach*: Remove the secondary `object-cover` background `<img>` tag (which contained the book and caused its top edge to peek out above the scaled-down foreground book). Instead, pair a pure CSS studio wall-and-desk backdrop gradient with a **single** right-aligned studio `<img>` (`object-contain object-right-bottom`) blended smoothly on its left edge via a horizontal alpha mask.
  - *Why*: Guarantees that only **one** book ever appears on the card, while allowing the book, pedestal, pen holder, and plant to be zoomed out (`84%–90%` height) so they fit inside the frame on both mobile and desktop without touching the title text.
  - *Alternatives Considered*: Stacking two copies of the same photo at different scales (rejected because the background copy's book top edge remains visible behind the smaller foreground copy).

- **Decision 2: Seamless Full-Card Light-Red Banner on Mobile & Desktop**
  - *Chosen Approach*: Remove the separate boxed `<div className="rounded-xl">` image wrapper on mobile and instead extend the soft light-red studio surface across the entire card, blending the book and 180° lay-flat spread seamlessly into the lower-right / bottom studio space with a soft radial/linear mask so there are no visible inner photo borders.
  - *Why*: Matches the cohesive full-card look of the Collection cards and satisfies the requirement that the book inside the frame looks like a clean cutout/studio placement rather than a pasted rectangular screenshot.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Homepage Storefront View                         │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────────┐ ┌──────────────────────────────────┐
│     Shop by Collection Cards (4)    │ │   Signature Featured Banner (Q3) │
│ ─────────────────────────────────── │ │ ──────────────────────────────── │
│ • Base: CSS Studio Wall + Oak Desk  │ │ • Base: Soft Light-Red Studio    │
│ • Single Studio Img (Right-Bottom,  │ │   Canvas (#ECC0BC → #F5CCC8)     │
│   86% height, left gradient mask)   │ │ • Seamless Full-Bleed Studio Img │
│ • Left 55%: Badges, Title, Bullets  │ │   (Mobile bottom / Desktop right)│
│ • Click -> Slide-Over Drawer with   │ │   with soft edge alpha blend     │
│   Official TSh Box Prices           │ │ • Price: TSh 57,000 / Box        │
└─────────────────────────────────────┘ └──────────────────────────────────┘
```

- **Data Model & State**:
  - Collection variants and featured banner pricing use official carton/box rates (`TSh 56,000 / Box` for Q2 48 Pcs, `TSh 57,000 / Box` for Q3 36 Pcs, `TSh 60,000 / Box` for Q4 24 Pcs).
- **Interactive Component & State Mapping**:
  - Clicking any of the 4 Collection cards sets `selectedCollection` and opens the slide-over specification drawer with gallery thumbnails and Box pricing.
  - Clicking `BUY NOW` on the Counter Book Q3 banner invokes `handleBannerBuyNow()`, adding `prod-omega-cb-q3` (`TSh 57,000 / Box`) to the cart and opening `CartDrawer`.
