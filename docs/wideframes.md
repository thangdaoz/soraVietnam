# Wireframes: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This document describes the structural layout and key elements for each main page of the application. These are blueprints for the UI/UX designer.

### 1. The Homepage

- **Navigation Bar:** Logo | Features | Pricing | Login | Sign Up (CTA Button)
- **Hero Section:**
  - **Headline:** Large, compelling headline (e.g., "AI Video Creation for Vietnam").
  - **Sub-headline:** Brief explanation of the service.
  - **CTA Button:** Prominent "Start Creating Now" button.
  - **Visual:** An example of a high-quality, AI-generated video playing silently in the background.
- **"How It Works" Section:**
  - A simple 3-step graphic: 1. Write Your Idea -> 2. Generate Video -> 3. Download & Share.
- **Features Section:** Icon and short text for key features (e.g., "Text-to-Video," "Image-to-Video," "HD Quality").
- **Pricing Section:**
  - Clear, simple display of the pay-as-you-go credit packages.
- **Footer:** About Us | Terms of Service | Privacy Policy | Contact Us | Social Media Links.

### 2. The Creation Dashboard (Main User Interface after Login)

- **Layout:** Full-width video gallery at top with floating chat input at bottom (similar to Sora/OpenAI interface).
- **Top Navigation Bar:**
  - Left: Logo and "Drafts" title/breadcrumb.
  - Right: User credits display with top-up button, profile menu.
- **Main Content Area (Full Width):**
  - **Video Gallery Section:**
    - Horizontal scrollable gallery of all generated videos.
    - Each video card shows: Thumbnail preview, aspect ratio indicator, duration badge, status icon.
    - Videos are displayed in a row with smooth horizontal scroll.
    - Hover on video shows overlay with actions: Play, Download, Delete, Copy prompt.
    - Empty state: Placeholder cards with "Generate your first video" message.
    - Background is dark/neutral to make videos stand out.
  - **Floating Chat Input (Fixed at bottom, elevated with high z-index):**
    - **Container:** Centered, max-width ~800px, elevated with shadow, rounded corners.
    - **Input Area:** 
      - Large textarea that expands as user types (single line by default, expands up to 5 lines).
      - Placeholder: "Describe your video..."
      - Left side: "+" button for image upload and additional options.
      - Right side: Settings icon and Send/Generate button.
    - **Quick Settings Row (Above input):**
      - Aspect ratio pills/buttons: 16:9, 1:1, 9:16 (selected state highlighted).
      - Duration selector: 5s, 10s toggle.
      - Credit cost indicator showing real-time cost based on selections.
    - **Styling:** 
      - Semi-transparent dark background with backdrop blur.
      - White/light text for contrast.
      - Fixed position at bottom with margin from edges.
      - High z-index (z-50 or higher) to float above all content.

### 3. The Billing/Account Page

- **Tabs:** Profile | Billing History | Purchase Credits
- **Profile Tab:** Fields to change user name and password.
- **Billing History Tab:** A table showing all transactions: Date | Description (e.g., "Video Generation - 5000 credits," "Credit Purchase - 25000 credits") | Amount | Status.
- **Purchase Credits Tab:** Displays the available credit packages with clear pricing and a "Buy Now" button for each.
