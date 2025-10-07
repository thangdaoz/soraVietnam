---
| Technology | Recommended Version (Latest & Stable) | Compatibility & Selection Rationale |
| :--- | :--- | :--- |
| **Next.js** | **15.1+* | **Main Framework.** The latest version brings many performance improvements, supports React 19, and uses Turbopack to speed up the build process. It requires a minimum of Node.js 18.17+, making it fully compatible with Node.js 22.x. |
| **React** | **19+** (Managed by Next.js) | **UI Library.** Next.js 15 has integrated React 19 features. You do not need to install it separately; Next.js will manage this version for you. |
| **Tailwind CSS** | **4.x** | **Styling.** Version 4.0 is a major upgrade with a new "Oxide" engine that significantly speeds up build times and allows configuration directly in the CSS file, simplifying the setup process. |
| **Supabase (Client)** | `@supabase/supabase-js` **v2.58.0+** | **SDK for Database/Storage.** The latest version works well on currently supported Node.js LTS versions. |
| **Payment Gateway** | **Casso (via Webhooks)** | **Payment Integration.** Casso integrates via webhooks, which are technology-agnostic. Our Supabase Edge Function (running on Deno, which supports Node.js modules) will act as the endpoint, ensuring full compatibility. |
| **Third-Party Video SDK**| *Dependent on Provider* |
 |
---
