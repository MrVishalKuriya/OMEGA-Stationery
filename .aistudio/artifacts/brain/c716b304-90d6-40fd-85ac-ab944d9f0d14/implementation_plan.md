# OMEGA Stationery — Swiss Editorial Storefront Redesign

Transform the OMEGA Stationery & Books web experience into a clean, modern Swiss editorial storefront featuring disciplined typography, crisp hairline boundaries, signature crimson red and deep charcoal palette, and seamless commercial browsing.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and will anchor the redesign:

- **Confirmed Aesthetic**: Clean modern Swiss editorial with crisp typography, restrained ornamentation, and subtle 1px hairline dividers.
- **Confirmed Palette**: Signature OMEGA crimson red (`#B91C1C` / `#991B1B`) accent with deep charcoal ink (`#0F1115` / `#1A1D23`), soft off-white canvas (`#F8F9FA`), pure white surfaces (`#FFFFFF`), and muted borders (`#E5E7EB`).
- **Confirmed UX Priority**: Cleaner card hierarchy with 65–70% image presence, aligned price baselines, balanced section rhythm, and streamlined navigation with instant WhatsApp ordering.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an authentic, high-trust direct factory storefront for OMEGA's hallmark Counter Books (Q1–Q4), Exercise Books, Kraft Bahasha envelopes, and school stationery across Tanzania.
- **Target Audience / Persona**: School administrators, institutional tender procurement officers, retail stationery shop owners, and Tanzanian students looking for genuine factory-grade books.
- **Key Value**: Elevates brand credibility from a cluttered discount store look to an authoritative, institutional-grade manufacturer portal with transparent retail and wholesale carton pricing.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Browse & Discovery**: The user arrives at a clean 1440px-baseline storefront featuring a calm hero statement, factory hallmark badges, and a curated 3-column featured collection grid.
2. **Filtering & Search**: Category tabs (Counter Books, Exercise Books, Kraft Bahasha, All) switch views instantly without jarring layout shifts.
3. **Cart & WhatsApp Quick Checkout**: Adding products updates the persistent top navigation counter with smooth micro-feedback; the cart drawer presents an itemized manifest with one-click direct WhatsApp proforma generation.
4. **Wholesale Carton Estimation**: Transparent volume tier tables with instant EFD tax invoice badges and nationwide bus terminal dispatch notes.

### Visual Identity & Theme
- **Aesthetic Direction**: Modern Swiss Editorial — spacious white space, high-contrast headline geometry, razor-sharp 1px borders, and zero clutter.
- **Color Palette (60-30-10 Rule)**:
  - *60% Dominant Neutral Canvas*: Crisp off-white (`#F8F9FA` / `#FFFFFF`) providing high legibility.
  - *30% Structural Surfaces*: Deep charcoal text (`#0F1115`), muted slate subtitles (`#64748B`), and subtle hairline borders (`#E5E7EB`).
  - *10% Action Accent Budget*: OMEGA Crimson Red (`#B91C1C`) reserved strictly for primary purchase CTAs, active filters, and essential badges.
- **Typography & Scale**:
  - *Display / Headings*: `Outfit` / `Plus Jakarta Sans` with balanced tracking and `text-wrap: balance`.
  - *Body Prose*: `Plus Jakarta Sans` (14px–16px, 1.55 line height, 65ch measure).
  - *Prices & Specifications*: Monospace tabular numerals (`font-mono tabular-nums`) for perfect numeric alignment.
- **Card Hierarchy & Zero-Pill Discipline**:
  - No static candy-colored pills. Metadata (pages, ruling, pack sizes) renders as clean unboxed text separated by quiet middle dots (`·`).
  - Product imagery takes 65–70% of card height on a neutral, solid white background with uniform padding.
  - Aligned baseline prices with clear regular and wholesale carton markers.

### Section Architecture (Max 4 Sections on Homepage)
1. **Hero**: Editorial split-screen showcasing the hallmark OMEGA Counter Book with factory origins (Soweto SIDO Mbeya) and direct catalog CTA.
2. **Featured Collection Grid**: Clean 4-column desktop grid with instant category filter buttons and smooth hover lift.
3. **Wholesale & Institutional Trust Strip**: Transparent carton volume discounts, TRA EFD invoice guarantee, and bus cargo dispatch points.
4. **How It Works (3 Steps)**: Clean, unboxed numbered sequence (`01. Select`, `02. Confirm via WhatsApp`, `03. Same-Day Bus Waybill`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of Competing Flash Banners & Candy Badges**
  - *Chosen Approach*: Strip nested pill badges, pulsing dots, and redundant promo banners, replacing them with subtle hairline cards and single-accent focal points.
  - *Why*: Reduces cognitive load and aligns the storefront with professional Swiss editorial standards.
  - *Alternatives Considered*: Retaining multi-colored badges was rejected as it produced visual clutter and cheapened the brand perception.

- **Decision 2: Top Bar Contract & Header Simplification**
  - *Chosen Approach*: Strict 3-zone header: single-line Brand Wordmark (`OMEGA`), 4–5 single-line navigation links (`Catalog`, `Wholesale`, `Tenders`, `About`), and a primary Action cluster (Search, Wishlist, Cart Drawer).
  - *Why*: Ensures zero horizontal wrapping or header crowding on viewports from 320px to 1440px.

- **Decision 3: Preservation of Complete Backend & Cart State Engine**
  - *Chosen Approach*: Maintain all existing MongoDB/in-memory fallbacks, Zustand stores, and WhatsApp URL builders while completely refreshing the presentation layout.
  - *Why*: Preserves full functional capability without breaking any order tracking, login, or admin features.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Global Layout & Nav                  │
│       TopBar (Wordmark ── NavLinks ── Cart/Search)      │
└──────────────────────────┬─────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌───────────────────────────────┐   ┌────────────────────────────┐
│      HomePage / Catalog       │   │    PDP & Wholesale View    │
│  - Hero Editorial Split       │   │  - Contiguous Buy Module   │
│  - Filter Segmented Buttons   │   │  - Dynamic Carton Tiers    │
│  - 4-Col Product Cards Grid   │   │  - Verified Specs Table    │
└───────────────┬───────────────┘   └─────────────┬──────────────┘
                │                                 │
                └────────────────┬────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────┐
│                Domain Application Stores               │
│  - useProductsQuery (TanStack Query + Deduplication)   │
│  - useCartStore (Zustand: Cart, Wishlist, Drawer)      │
│  - useConfigStore (Store metadata, phone desks)        │
└────────────────────────────────────────────────────────┘
```

### Component & State Mapping
- **`Navbar.tsx` & `AnnouncementBar.tsx`**: Streamlined to the 3-zone contract with clean hover states and responsive drawer triggers.
- **`ProductCard.tsx`**: Standardized 65% image container, clean unboxed metadata (`70 GSM · Smyth-Sewn · 36/ctn`), and consistent baseline pricing.
- **`Hero.tsx`**: Replaced textured dark banners with a high-contrast editorial composition, balanced headline scale, and authentic product showcase.
- **`index.css` & Global Theme**: Updated color tokens to the signature crimson and charcoal palette with clean light mode foundations.
