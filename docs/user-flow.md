# User Flow: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This document outlines the primary paths users will take through the web application. Each flow represents a key user objective.

### Flow 1: New User Registration & First Video Generation

**Objective:** To guide a first-time user from discovery to their first successfully generated video as smoothly as possible.

1.  **Landing Page:** User arrives at the homepage. The page clearly communicates the value proposition ("Create amazing videos from text, right here in Vietnam") with a prominent "Start Creating for Free" Call-to-Action (CTA).
2.  **Registration:**
    - User clicks the CTA.
    - A simple sign-up modal appears, asking for an email and password, or offering social login (Google, Facebook/Meta).
    - Upon submission, the user receives a verification email.
3.  **Email Verification:** User clicks the link in the verification email and is logged into the application.
4.  **Welcome & Onboarding:**
    - User is directed to the main "Creation Dashboard."
    - A brief, dismissible pop-up tour highlights the three main areas: the prompt input field, the user's remaining credit balance, and the gallery of their past creations.
5.  **Prompt Submission:**
    - User types a text prompt (e.g., "An astronaut riding a horse on Mars") into the main text area.
    - User clicks "Generate Video."
6.  **Payment Prompt:**
    - Since the user has no credits, a modal appears: "You're out of credits! Purchase credits to continue."
    - The modal displays simple credit packages (e.g., "100,000 credits for 100,000 VND").
    - User clicks "Purchase."
7.  **Payment & Generation:**
    - User is redirected to a secure payment page (integrated with a local Vietnamese payment gateway).
    - User completes the purchase.
    - User is returned to the Creation Dashboard. A confirmation message appears: "Payment successful! Your video is now being generated." The video appears in the gallery with a "Processing..." status.
8.  **Completion:**
    - Once the video is ready, its status changes to "Complete."
    - The user receives an email notification.
    - The user can now click on the video to watch, download, or share it.

### Flow 2: Existing User - Generating a Video with Existing Credits

**Objective:** To provide a fast and efficient path for returning users to create content.

1.  **Login:** User lands on the homepage and clicks "Login." They enter their credentials and are taken to their Creation Dashboard.
2.  **Dashboard:** The user can see their existing credit balance and their gallery of previously generated videos.
3.  **Prompt Submission:**
    - User enters a new text or image prompt.
    - User clicks "Generate Video."
4.  **Credit Deduction & Generation:**
    - The system checks if the user has sufficient credits.
    - The cost of the video is deducted from their balance.
    - The new video appears in their gallery with a "Processing..." status.
5.  **Completion:** User is notified via email and on the dashboard when the video is ready for viewing and download.
