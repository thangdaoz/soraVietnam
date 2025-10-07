---

### **Comprehensive Technical Documentation: Sora Vietnam Gateway**

**Version:** 1.0
**Date:** October 7, 2025

**Objective:** This document provides a detailed technical blueprint for the Sora Vietnam Gateway platform. It is intended for the development team and covers system architecture, API contracts, database design with security policies, and key development practices.

---

### **1. Detailed System Architecture**

The system is a modern web application built on a Next.js frontend (hosted on Vercel) and a Supabase backend. Supabase provides the database, authentication, storage, and serverless functions, which in turn connect to a third-party AI video generation service.

#### **1.1. Component Diagram**

```
[User's Browser] <--> [Next.js Frontend on Vercel]
       |                      |
       | (Supabase JS Client) |
       |                      |
       +---------------------> [Supabase Backend]
                                 |
                                 +--> [Auth]
                                 +--> [PostgreSQL Database]
                                 +--> [Storage]
                                 +--> [Edge Functions] --------> [Third-Party Video API]
                                 |
[Casso Platform] --(Webhook)--> [Next.js Webhook Handler on Vercel]
```

#### **1.2. Critical Workflows**

**Workflow A: User Authentication & Profile Creation**

1.  **[Client]:** User clicks "Login with Google" or signs up with email/password. The Supabase client library (`@supabase/supabase-js`) handles the OAuth flow or sign-up process.
2.  **[Supabase Auth]:** Upon successful authentication, Supabase `auth.users` creates a new user record.
3.  **[Database Trigger]:** A PostgreSQL trigger on the `auth.users` table automatically calls a function to create a corresponding public profile in our `profiles` table, initializing their `credits` to 0.
4.  **[Client]:** The Supabase client library receives a session JWT. This JWT is stored securely and sent with every subsequent request to our Supabase Edge Functions.

**Workflow B: Purchasing Credits via Casso**

1.  **[Client]:** User navigates to the "Purchase Credits" page. The frontend displays the project's bank account details and a unique memo/code for the user to include in their transfer.
2.  **[User Action]:** The user performs a bank transfer to the specified account.
3.  **[Casso Platform]:** Casso detects the new transaction, matches it, and sends a **webhook** event to a dedicated endpoint on our Next.js backend: `POST /api/webhooks/casso-handler`.
4.  **[Next.js Backend -> Supabase]:** The webhook handler verifies the event's authenticity using Casso's signing secret. Upon verification, it uses the Supabase Admin client to securely update the user's balance in the `profiles` table. **This is the only trusted way credits are added.**

**Workflow C: Video Generation (Asynchronous)**

1.  **[Client]:** The authenticated user submits a prompt in the frontend.
2.  **[Client -> Supabase Edge Function]:** The client calls the `generate-video` Edge Function, passing the prompt and the user's JWT for authentication.
3.  **[Edge Function -> Supabase DB]:** The function first calls the `decrement_user_credits` RPC in the database. If the user has insufficient credits, the function fails and returns a `402 Payment Required` error.
4.  **[Edge Function -> Third-Party API]:** If credits are successfully debited, the function calls the external video generation API with the user's prompt and our secret API key.
5.  **[Edge Function -> Client]:** The video API will likely start a long-running job. The Edge Function immediately receives a job ID and returns it to the client with a "processing" status (e.g., `{"generationId": "uuid", "status": "processing"}`).
6.  **[Client]:** The client stores this `generationId` and can poll a status-checking endpoint or use Supabase Realtime to listen for updates on their video's status in the `generations` table.

---

### **2. API & Function Specification**

#### **Authentication**

All secure Supabase Edge Functions require an `Authorization: Bearer <SUPABASE_JWT>` header. The function will use this JWT to identify and authorize the user.

#### **Supabase Edge Functions**

- `POST /functions/v1/generate-video`
  - **Description:** The core function for creating an AI video.
  - **Request Body:** `{"prompt": "string", "type": "text-to-video" | "image-to-video", "sourceImageUrl"?: "url"}`
  - **Response (200 OK):** `{"generationId": "uuid", "status": "processing"}`
  - **Error Codes:**
    - `401 Unauthorized`: Invalid/missing JWT.
    - `402 Payment Required`: User's credit balance is insufficient.
    - `500 Internal Server Error`: Failed to communicate with the third-party video API.

#### **Next.js API Routes (Route Handlers)**

- `POST /api/webhooks/casso-handler`
  - **Description:** A private endpoint for receiving payment success notifications from the Casso platform. This endpoint is not called by the client.
  - **Security:** Must be protected by verifying the signature provided in the webhook's header against our `CASSO_WEBHOOK_SIGNING_SECRET`.
  - **Action:** On valid event, securely updates the corresponding user's credit balance in the Supabase `profiles` table.
  - **Response (200 OK):** An empty response to acknowledge receipt.

---

### **3. Database Schema & Security**

#### **3.1. Tables**

- **`profiles`**
  - `id`: `uuid`, primary key, foreign key to `auth.users.id`.
  - `updated_at`: `timestamp`.
  - `credits`: `integer`, `default 0`, `CHECK (credits >= 0)`.
  - ... (other profile data like `username`, `avatar_url`)

- **`generations`**
  - `id`: `uuid`, primary key, `default gen_random_uuid()`.
  - `user_id`: `uuid`, foreign key to `auth.users.id`.
  - `created_at`: `timestamp`.
  - `prompt`: `text`.
  - `status`: `text` (e.g., "processing", "completed", "failed").
  - `result_video_url`: `text`, nullable.

#### **3.2. Row Level Security (RLS)**

RLS is **enabled on all tables** to enforce data access rules at the database level.

- **Policy on `profiles` table:**
  - **`SELECT`:** A user can only see their own profile (`auth.uid() = id`).
  - **`UPDATE`:** A user can only update their own profile (e.g., their username). **Crucially, an RLS policy will prevent them from updating the `credits` column directly.**

- **Policy on `generations` table:**
  - **`SELECT`:** A user can only see their own generation history (`auth.uid() = user_id`).
  - **`INSERT`:** A user can insert a record if `auth.uid() = user_id`.

#### **3.3. Database Functions (RPC)**

To prevent race conditions and securely manage credits, all credit deductions are handled by a database function.

- **Function:** `decrement_user_credits(user_id_to_update uuid, amount integer)`
- **Logic:**
  1.  Starts a transaction.
  2.  Selects the current credits for the given `user_id` with `FOR UPDATE` to lock the row.
  3.  If `current_credits >= amount`, it performs the update: `SET credits = credits - amount`.
  4.  Commits the transaction.
  5.  Returns a success or failure status.
- **Usage:** Our `generate-video` Edge Function will call this RPC function instead of performing a direct `UPDATE`.

#### **3.4. Supabase Storage**

- **Bucket:** `generated-videos`
- **Policies:** This bucket will be configured with strict RLS policies.
  - **`SELECT`:** A user can only view videos where the file path matches their `user_id` (e.g., `/<user_id>/video.mp4`).
  - **`INSERT`:** Only our backend (using the service role key) can write to this bucket. Client-side uploads are disabled.

---

### **4. Development & Deployment (DevOps)**

#### **4.1. Environment Variables**

A `.env.local` file is required for local development with the following keys:

```
# Public Supabase keys (safe for the browser)
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Secret keys (for backend use in Next.js or Supabase Functions)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" # For server-side admin tasks
THIRD_PARTY_VIDEO_API_KEY="your-secret-video-api-key"
CASSO_API_KEY="your-casso-api-key"
CASSO_WEBHOOK_SIGNING_SECRET="your-casso-webhook-secret"
```

---
