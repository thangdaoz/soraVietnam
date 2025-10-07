# UI Design Kit: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This document defines the core visual components and design principles for the Sora Vietnam Gateway application. Its purpose is to ensure a consistent and high-quality user interface across the entire platform.

## 1. Logo

- **Primary Logo:** [Link to Primary Logo SVG/PNG file]
- **Favicon:** [Link to Favicon ICO/SVG file]
- **Usage:** The primary logo will be used in the navigation bar. The favicon will be used in the browser tab.

## 2. Color Palette

The color palette is designed to be modern, energetic, and trustworthy. It emphasizes creativity while maintaining a professional look.

| Role          | Color   | Hex Code   | Usage Notes                                                                                  |
| :------------ | :------ | :--------- | :------------------------------------------------------------------------------------------- |
| **Primary**   | Indigo  | `#4F46E5`  | Main brand color. Used for primary buttons, active links, and focused input fields.          |
| **Secondary** | Emerald | `#10B981`  | Accent color. Used for success states, confirmation messages, and secondary calls-to-action. |
| **Neutral**   | Slate   | See shades | Used for text, backgrounds, and borders to create a clean and readable interface.            |
| **Feedback**  | Red     | `#EF4444`  | Used for error messages, deletion confirmation, and alerts.                                  |
| **Feedback**  | Amber   | `#F59E0B`  | Used for warnings, pending states, and informational callouts.                               |

### Neutral Shades (Slate)

- **Text (Dark):** `#0F172A` (For headings and primary text)
- **Text (Medium):** `#475569` (For subheadings and body text)
- **Text (Light):** `#64748B` (For helper text and disabled states)
- **Border:** `#E2E8F0` (For input fields and card borders)
- **Background (Subtle):** `#F8FAFC` (For page backgrounds to create subtle contrast with white)
- **Background (White):** `#FFFFFF` (For main content cards and containers)

## 3. Typography

The typography is chosen for its excellent readability on screens and its modern, clean aesthetic. We will use fonts from Google Fonts.

- **Heading Font:** **Poppins**
  - **Why:** A geometric sans-serif that is friendly, modern, and works well for strong headlines.
  - **Weights:** `600` (Semi-Bold) for main headings, `500` (Medium) for subheadings.

- **Body Font:** **Inter**
  - **Why:** A highly versatile and readable sans-serif font specifically designed for user interfaces.
  - **Weights:** `400` (Regular) for all body text, `500` (Medium) for bolded text within paragraphs.

### Typographic Scale

- **h1:** 36px, Poppins, Semi-Bold
- **h2:** 24px, Poppins, Semi-Bold
- **h3:** 20px, Poppins, Medium
- **Body (p):** 16px, Inter, Regular
- **Small Text:** 14px, Inter, Regular

## 4. Core UI Components (Style Definition)

This section defines the appearance and states of our most common UI elements.

### Buttons

- **Primary Button:**
  - **Default:** Solid Indigo (`#4F46E5`) background, white text.
  - **Hover:** Darker Indigo background.
  - **Disabled:** Light gray background, medium gray text, no interaction.
- **Secondary Button:**
  - **Default:** White background, Indigo (`#4F46E5`) border and text.
  - **Hover:** Light Indigo background.
- **Tertiary/Text Button:**
  - **Default:** No background or border, Indigo (`#4F46E5`) text.
  - **Hover:** Text is underlined.

### Input Fields (Text, Text Area)

- **Default:** White background, light Slate (`#E2E8F0`) border, 1px, rounded corners.
- **Focus:** Border color changes to primary Indigo (`#4F46E5`).
- **Error:** Border color changes to feedback Red (`#EF4444`).
- **Placeholder Text:** Light Slate (`#64748B`) text.

### Cards & Containers

- **Default:** White (`#FFFFFF`) background, subtle box-shadow, rounded corners (8px radius).
- **Border:** A light Slate (`#E2E8F0`) border can be used for cards that need more definition.

## 5. Iconography

- **Library:** **Lucide Icons** (`lucide-react`)
  - **Why:** A clean, modern, and highly consistent open-source icon set. It's tree-shakeable, meaning only the icons we use will be included in the final application bundle, which is great for performance.
  - **Usage:** Icons should be used sparingly to support text and improve usability, not for decoration. Common use cases include buttons, navigation items, and feature lists.
