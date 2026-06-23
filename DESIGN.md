---
name: FreshCart
description: Premium neighborhood market design system.
colors:
  primary: "#13382B"
  primary-hover: "#0E2C22"
  accent: "#E05E2B"
  accent-hover: "#C64F20"
  neutral-bg: "#FAF9F6"
  neutral-card: "#FFFFFF"
  neutral-ink: "#1C1E1B"
  neutral-border: "#E8E4DA"
  neutral-muted: "#9E9582"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 800
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontWeight: 400
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
---

# Design System: FreshCart

## 1. Overview

**Creative North Star: "The Artisanal Guild Market"**

FreshCart fuses the warm authenticity of a physical neighborhood farmers' market with the high-efficiency expectations of modern web delivery. Rather than using sterile, tech-first layouts or overused SaaS aesthetics, the design system focuses on raw organic textures, warm-toned typography contrast, and high-density, legible data surfaces.

The system explicitly rejects SaaS generic patterns, neon gradients, glassmorphism, side-stripe borders, and all forms of artificial scaffolding. Content is prioritized through natural editorial hierarchy and tactile, high-contrast layouts.

**Key Characteristics:**
- **Warm Contrast**: Deep organic green text and backgrounds resting on soft, natural off-white papers.
- **Typographic Axis**: Bold display serif headers paired with clean, geometric body type.
- **Flat at Rest**: Surfaces are flat and layered. Elevation is used sparingly, primarily as an active state response to user hover or focus.
- **Tactile Inputs**: Inputs and buttons feature generously rounded corners, solid borders, and clear micro-interactions.

## 2. Colors

The color palette is derived from organic flora, terra-cotta soil, and natural paper stocks to evoke artisanal freshness.

### Primary
- **Forest Ink** (#13382B): Deep, organic forest green. Used for major structural headings, brand markings, and primary button backgrounds.

### Secondary
- **Terracotta Sunrise** (#E05E2B): Vibrant, warm orange-terracotta. Used for accents, promotions, interactive highlights, active state badges, and sale prices.

### Neutral
- **Cream Parchment** (#FAF9F6): Warm off-white. The base background for the entire application, offering a soft, low-strain backdrop.
- **White Linen** (#FFFFFF): Pure white. Used for card backgrounds, modal wrappers, and floating dropdown surfaces to contrast with the base background.
- **Charcoal Ink** (#1C1E1B): High-contrast dark charcoal. Used for all primary body copy to ensure readability and compliance with high-contrast rules.
- **Sandstone Border** (#E8E4DA): Warm gray-sand. Used for structural dividers, input borders, and card outlines to define boundaries without visual noise.

### Named Rules
**The 10% Accent Rule.** The primary accent, Terracotta Sunrise (#E05E2B), must occupy ≤10% of any given screen. Its role is strictly to guide the user's attention to critical status updates, active selections, or promotional alerts.

**The Tinted Ink Rule.** Text must never use a generic pure black (#000000) or high-contrast cool grey. Body copy must always use Charcoal Ink (#1C1E1B) to preserve the organic visual warmth of the design.

## 3. Typography

The typographic pairing represents an editorial axis: a classical display serif paired with a crisp, geometric sans-serif.

**Display Font:** Playfair Display (fallback: Georgia, serif)
**Body Font:** DM Sans (fallback: sans-serif)

**Character:** Warm, authoritative, and editorial. Display titles are bold and heavy, while body text is highly legible, dense, and clean.

### Hierarchy
- **Display** (Bold (800), clamp(1.875rem, 5vw, 3rem), 1.1): Used for page titles, hero headers, and major checkout steps.
- **Headline** (Bold (700), 1.5rem, 1.2): Used for sections, primary card titles, and card headers.
- **Title** (Bold (600), 1.125rem, 1.35): Used for subsection headers and primary item lists.
- **Body** (Regular (400), 0.875rem (14px) or 1rem (16px), 1.5): Used for general paragraphs, descriptions, and descriptive text. Maximum line length capped at 65–75ch.
- **Label** (Bold (700) / Semi-Bold (600), 0.75rem (12px), tracking-wider): Used for buttons, status badges, price details, and small eyebrows.

### Named Rules
**The Widow Prevention Rule.** All Display and Headline headings must use `text-wrap: balance` to prevent awkward single-word lines. Body elements must use `text-wrap: pretty` for clean margins.

## 4. Elevation

FreshCart utilizes a flat-by-default visual strategy. We avoid artificial depth, heavy floating card shadows, and frosted-glass overlays. Depth is expressed using clean borders (#E8E4DA) and flat, colored fills.

### Shadow Vocabulary
- **Interactive Rise** (`box-shadow: 0 4px 6px -1px rgb(28 30 27 / 0.08), 0 2px 4px -2px rgb(28 30 27 / 0.05)`): A subtle, warm shadow applied only during active hover or focus states on cards, buttons, or drawers.

### Named Rules
**The Flat-By-Default Rule.** All surfaces (cards, buttons, inputs) must rest flat at their default state. Shadows are prohibited at rest and must only appear as a micro-interaction feedback response to user hover or focus.

## 5. Components

Components are styled to look tactile, robust, and highly functional.

### Buttons
- **Shape:** Rounded-xl (12px radius) or Full (rounded-full).
- **Primary:** Forest Ink background with Cream Parchment text. Built with generous vertical padding (12px) and horizontal padding (24px).
- **Hover / Focus:** Transition to `primary-hover` (#0E2C22) with a visible ring focus outline.
- **Secondary / Accent:** Terracotta Sunrise background with Cream Parchment text. Transitions to `accent-hover` (#C64F20) on hover.

### Chips
- **Style:** Flat backgrounds matching status types (e.g. Organic, Sale, Local) with matching text colors.
- **State:** Active pills feature a solid border of primary accent or text.

### Cards / Containers
- **Corner Style:** Rounded-2xl (16px radius).
- **Background:** White Linen (#FFFFFF) with a thin Sandstone Border (#E8E4DA) border (1px).
- **Shadow Strategy:** Flat at rest; transitions to Interactive Rise shadow on hover.
- **Internal Padding:** Generous padding matching the layout grid (typically 16px to 24px).

### Inputs / Fields
- **Style:** Flat Cream Parchment background with a Sandstone Border (1px). Rounded-lg (8px radius) or rounded-xl (12px).
- **Focus:** Ring transition to `focus-visible:ring-2 focus-visible:ring-brand-primary` with outline removal.
- **Error:** Accentuated with a soft red border and supporting inline message.

### Navigation
- **Style:** Sticky top navigation with a soft backdrop blur (95% Cream Parchment with backdrop-blur-md) to blend with content during scroll. Mobile nav handles are flat and slide from screen edges.

## 6. Do's and Don'ts

### Do:
- **Do** check contrast ratios for body text and placeholders against tinted backgrounds (target >= 4.5:1).
- **Do** wrap SVGs and set `aria-hidden="true"` on decorative icons inside buttons and navigation.
- **Do** assign explicit HTML width and height dimensions to all images to prevent layout shift (CLS).
- **Do** use native buttons and links (`<button>`, `<a>`, `<Link>`) with focus-ring styles rather than generic divs.
- **Do** specify descriptive autocompletes (`autocomplete="cc-name"`, `autocomplete="cc-number"`, etc.) for payment and checkout form inputs.
- **Do** format Taka currency utilizing the `৳` symbol with integer rounding (e.g. `৳1,200` instead of `৳1200.00`).
- **Do** structures local addresses using Bangladeshi naming patterns: Holding, Road, Block/Sector, Area, City, and 4-digit Postal Codes.

### Don't:
- **Don't** use border-left or border-right side-stripes greater than 1px as color accents on alert cards.
- **Don't** use gradient text or background-clip text configurations.
- **Don't** apply frosted-glassmorphism or blurs decoratively as standard card backgrounds.
- **Don't** use tiny, uppercase wide-tracked Kickers/Eyebrows above every section.
- **Don't** use numbered section markers unless they denote a strict sequence.
- **Don't** use double-nested cards or containers.
- **Don't** use 5-digit zip code formatting or US state inputs for Bangladeshi client forms.
