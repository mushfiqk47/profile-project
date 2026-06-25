---
name: FreshCart BD
description: Premium neighborhood grocery delivery — editorial design with curated local Bangladeshi produce
colors:
  primary: "#13382B"
  primary-hover: "#0E2C22"
  primary-fg: "#FAF9F6"
  accent: "#E05E2B"
  accent-hover: "#C64F20"
  accent-fg: "#FAF9F6"
  neutral-50: "#FAF9F6"
  neutral-100: "#F4F1EA"
  neutral-200: "#E8E4DA"
  neutral-300: "#D6D0C2"
  neutral-400: "#BDB5A4"
  neutral-500: "#9E9582"
  neutral-600: "#807766"
  neutral-700: "#635C4E"
  neutral-800: "#464137"
  neutral-900: "#1C1E1B"
  bg-page: "#FAF9F6"
  bg-card: "#FFFFFF"
  bg-elevated: "#FFFFFF"
  bg-overlay: "rgba(28, 30, 27, 0.4)"
  semantic-success: "#10B981"
  semantic-warning: "#F59E0B"
  semantic-error: "#EF4444"
  semantic-info: "#3B82F6"
  label-organic: "#13382B"
  label-sale: "#E05E2B"
  label-new: "#2563EB"
  label-local: "#D97706"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-fg}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
  card:
    backgroundColor: "{colors.bg-card}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input:
    backgroundColor: "{colors.neutral-50}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: FreshCart BD

## 1. Overview

**Creative North Star: "The Neighborhood Market"**

FreshCart's design language is a premium neighborhood grocery market translated into digital form. The system balances editorial confidence — bold Playfair Display headings, generous whitespace, asymmetric compositions — with the warmth and trust of a local curators who hand-pick every item. The deep forest green (#13382B) carries the brand's connection to farms and sustainability; the citrus orange (#E05E2B) provides energetic CTA moments without shouting. The warm off-white background (#FAF9F6) reads as premium paper, not generic cream.

This system explicitly rejects the Instacart/Chaldal utilitarian grocery aesthetic (dense grids, no personality, warehouse-catalog feel) and the generic AI e-commerce look (identical card grids, tiny uppercase eyebrows on every section, gradient text, glassmorphism as default). Every section earns its place through visual variety — carousels, split layouts, persona ads, floating product showcases — not through repeating the same card pattern.

**Key Characteristics:**
- Editorial typography with high weight contrast (extrabold display + regular body)
- Warm, farm-inspired palette with deep green + citrus orange on off-white
- Generous spacing with rhythmic variation between sections
- Framer Motion spring animations for interactive delight
- Product imagery as design hero — floating cards, carousels, gallery views
- Mobile-first with bottom tab navigation on small screens

## 2. Colors

The palette draws from Bangladeshi agriculture: deep forest canopy green, sun-ripened citrus orange, warm stone off-white, and a neutral ramp inspired by jute and earth.

### Primary
- **Forest Grove Green** (#13382B): The brand anchor. Used for headers, primary buttons, navigation, badges, and the dominant hero backgrounds. Represents freshness, sustainability, and the deep green of Rajshahi mango orchards.
- **Deep Canopy** (#0E2C22): Hover state for primary elements. Darker variant for interactive feedback.

### Accent
- **Citrus Orange** (#E05E2B): The CTA pulse. Used for sale badges, price highlights, promotional banners, hero accents, and the "Check Coverage" button. Warm and energetic, not alarm-red.
- **Ripe Citrus** (#C64F20): Hover state for accent elements.

### Neutral
- **Stone Off-White** (#FAF9F6): Page background. Premium paper feel, not generic cream. Warm without being yellow.
- **Jute 100** (#F4F1EA): Card hover backgrounds, input backgrounds, subtle surface distinction.
- **Jute 200** (#E8E4DA): Borders, dividers, subtle structural lines.
- **Jute 300** (#D6D0C2): Scrollbar thumbs, disabled states.
- **Jute 400** (#BDB5A4): Placeholder text, muted labels.
- **Jute 500** (#9E9582): Secondary text, descriptions.
- **Jute 600** (#807766): Body text on light backgrounds.
- **Jute 700** (#635C4E): Strong body text, form labels.
- **Jute 800** (#464137): Headings, emphasis text.
- **Charcoal** (#1C1E1B): Darkest neutral. Footer background, primary text on light surfaces.

### Named Rules

**The Accent Rarity Rule.** Citrus orange appears on ≤15% of any given screen. Its scarcity creates visual urgency — when it appears, it means something (CTA, sale, price, promotion). Overuse dilutes the brand signal.

**The Warm Neutrals Rule.** All neutrals are tinted warm (hue 40-100 range) to maintain the agricultural paper feel. Pure gray (#808080) is never used; it breaks the warm material palette.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** The serif+sans pairing creates editorial contrast — Playfair Display's high-contrast thick-thin strokes feel like a premium food magazine masthead, while DM Sans's clean geometry provides readable body copy. The combination signals "curated market" rather than "discount warehouse."

### Hierarchy
- **Display** (800 weight, clamp(2.25rem, 5vw, 4.2rem), line-height 1.08): Hero headlines, section titles. Always extrabold. Letter-spacing: -0.02em.
- **Headline** (700 weight, 1.5rem–2.25rem, line-height 1.2): Sub-section titles, card headings.
- **Title** (700 weight, 1.125rem–1.25rem, line-height 1.375): Component titles, form labels in context.
- **Body** (400 weight, 1rem, line-height 1.5): Descriptions, paragraphs, form inputs. Max line length: 65–75ch.
- **Label** (700 weight, 0.6875rem, letter-spacing 0.05em, uppercase): Category names, eyebrow badges, navigation labels, filter headers. Used sparingly.

### Named Rules

**The Headline Weight Rule.** Display and headline text is always 700–800 weight. Medium-weight headlines (500–600) feel uncommitted; the brand's editorial confidence requires bold typographic presence.

**The Body Size Floor Rule.** Body text is never smaller than 0.875rem (14px). The brand is premium; cramped text signals discount. Input fields use 16px minimum to prevent iOS zoom.

## 4. Elevation

The system uses a hybrid approach: subtle ambient shadows for cards and elevated surfaces, with tonal layering (background color shifts) for depth on dark backgrounds. Shadows are structural — they separate cards from the page — not decorative.

### Shadow Vocabulary
- **xs** (`0 1px 2px 0 rgb(28 30 27 / 0.05)`): Default card shadow. Barely visible structural lift.
- **sm** (`0 1px 3px 0 rgb(28 30 27 / 0.08), 0 1px 2px -1px rgb(28 30 27 / 0.06)`): Hover state for cards, dropdown menus.
- **md** (`0 4px 6px -1px rgb(28 30 27 / 0.08), 0 2px 4px -2px rgb(28 30 27 / 0.05)`): Elevated panels, modals.
- **lg** (`0 10px 15px -3px rgb(28 30 27 / 0.08), 0 4px 6px -4px rgb(28 30 27 / 0.05)`): Product card hover, floating elements.
- **xl** (`0 20px 25px -5px rgb(28 30 27 / 0.08), 0 8px 10px -6px rgb(28 30 27 / 0.04)`): Cart drawer, modal overlays.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest with xs shadow. Shadows deepen only on interaction (hover, focus, open state). The shadow progression maps directly to elevation intent: rest → hover → active → overlay.

## 5. Components

### Buttons
- **Shape:** Fully rounded (24px radius for large, full pill for CTAs)
- **Primary:** Forest green (#13382B) background, off-white (#FAF9F6) text, 12px 24px padding. Used for primary actions (Add to Bag, Proceed to Checkout).
- **Accent:** Citrus orange (#E05E2B) background, off-white text, pill-shaped. Used for hero CTAs, promotional buttons, "Check Coverage."
- **Hover:** Darken by 2-step on the neutral ramp (primary → #0E2C22, accent → #C64F20). Add scale(1.02) for accent CTAs.
- **Secondary/Ghost:** White background, neutral-200 border, neutral-700 text. Used for secondary actions (Continue Shopping, Back).
- **Disabled:** Neutral-200 background, neutral-400 text. No pointer cursor.

### Cards
- **Corner Style:** 24px radius (xl)
- **Background:** White (#FFFFFF)
- **Shadow Strategy:** xs at rest, lg on hover (product cards), sm on hover (static cards)
- **Border:** 1px solid neutral-200, darkens to neutral-300 on hover
- **Internal Padding:** 20px (5 in Tailwind scale)
- **Product Cards:** Include aspect-[4/3] image container, brand label, product name (line-clamp-2), weight, price display, and add-to-cart stepper

### Inputs / Fields
- **Style:** Neutral-50 background, neutral-200 border, 8px radius, 12px horizontal padding
- **Focus:** Border shifts to primary (#13382B), background becomes white, 2px ring in primary/10
- **Error:** Border shifts to red-300, ring becomes red-100
- **Label:** 11px uppercase, bold, neutral-700, 5px letter-spacing

### Navigation
- **Desktop Header:** Sticky top-0, scrolls from transparent to white/95 with backdrop-blur. Logo left, address chip center, search + cart + user right. Category nav below as horizontal links.
- **Mobile Bottom Nav:** Fixed bottom-0, 5 tabs (Home, Browse, Search, Cart, Account). Active tab shows label + brand-primary color. Cart tab shows badge count.

### Product Card (Signature)
The product card is FreshCart's signature component — it appears in carousels, grids, floating showcases, and persona ads. It features a 4:3 image with overlay badges (Organic/Sale/Local/Out of Stock), favorite heart toggle, brand label, product name with line-clamp, weight indicator, price display with original/savings, and an animated add-to-cart button that transforms into a quantity stepper.

### Quantity Input (Signature)
A pill-shaped stepper with minus/count/plus buttons. Spring animations on tap (scale 0.9). Three sizes: sm (32px height), md (40px), lg (48px). Used in product cards, cart rows, and product detail pages.

## 6. Do's and Don'ts

### Do:
- **Do** use Playfair Display extrabold for all display headlines. The serif's high contrast is the brand's editorial signature.
- **Do** use the citrus orange accent sparingly — CTAs, sale badges, price highlights, promotional elements. Its rarity creates visual urgency.
- **Do** give every section a unique visual treatment — carousels, split layouts, persona ads, floating cards, dark panels. Visual variety signals curation.
- **Do** use generous whitespace between sections. The brand is premium; cramped layouts signal discount.
- **Do** format all prices in BDT (৳) with the `en-IN` locale. Currency is part of the brand's local identity.
- **Do** use Framer Motion spring animations for interactive elements (add-to-cart, quantity steppers, drawer open/close). Motion should feel fast and tactile.
- **Do** show product imagery as the design hero — floating cards with bob animations, gallery views, carousel showcases.
- **Do** use the warm neutral ramp (#FAF9F6 through #1C1E1B) for all text and backgrounds. Never pure gray.

### Don't:
- **Don't** make it look like Instacart or Chaldal — utilitarian grids, dense product lists, no personality, warehouse-catalog feel. FreshCart is curated, not exhaustive.
- **Don't** use identical card grids repeated across sections. Every section should have a distinct visual treatment.
- **Don't** add tiny uppercase tracked eyebrows above every section heading. One or two deliberate kickers is voice; every section is AI scaffolding.
- **Don't** use gradient text (background-clip: text). Solid colors only; emphasis through weight and size.
- **Don't** use glassmorphism as a default treatment. Backdrop-blur appears only on specific overlays (header, floating product cards on dark backgrounds).
- **Don't** use pure gray (#808080) anywhere. All neutrals are warm-tinted (hue 40-100) to maintain the agricultural paper feel.
- **Don't** use border-left or border-right greater than 1px as a colored accent. Use full borders, background tints, or nothing.
- **Don't** animate CSS layout properties (width, height). Use transform and opacity for 60fps animations.
- **Don't** use Playfair Display for body text. It's display-only; body text is always DM Sans.
