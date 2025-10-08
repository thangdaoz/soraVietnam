# Apply Supabase Migrations

This guide will help you apply all database migrations to your Supabase project.

## Option 1: Using Supabase Dashboard (Recommended for Manual Setup)

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `sora-vietnam-gateway`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Apply migrations in order:**

   Copy and paste each migration file content into the SQL Editor and run them **in this exact order**:

   #### 1️⃣ Initial Schema (Tables, Enums, Indexes)
   ```
   File: supabase/migrations/20251007_initial_schema.sql
   ```
   - Creates all base tables (profiles, videos, transactions, etc.)
   - Creates enums for status types
   - Creates indexes for performance

   #### 2️⃣ RLS Policies (Row Level Security)
   ```
   File: supabase/migrations/20251007_rls_policies.sql
   ```
   - Enables RLS on all tables
   - Creates security policies for data access
   - Ensures users can only access their own data

   #### 3️⃣ Security Functions
   ```
   File: supabase/migrations/20251007_security_functions.sql
   ```
   - Creates helper functions for secure operations
   - Adds validation functions
   - Creates trigger functions

   #### 4️⃣ Enhanced Security
   ```
   File: supabase/migrations/20251007_enhanced_security.sql
   ```
   - Adds additional security constraints
   - Creates audit triggers
   - Implements rate limiting

   #### 5️⃣ Security Hardening
   ```
   File: supabase/migrations/20251007_security_hardening.sql
   ```
   - Final security layer
   - Adds content moderation hooks
   - Implements anti-abuse measures

4. **Verify migrations**
   - Go to "Table Editor" in left sidebar
   - You should see these tables:
     - `profiles`
     - `videos`
     - `transactions`
     - `credit_packages`
     - `video_pricing`

## Option 2: Using Supabase CLI (Advanced)

### Prerequisites:
```powershell
# Install Supabase CLI
npm install -g supabase
```

### Steps:

1. **Login to Supabase**
```powershell
supabase login
```

2. **Link to your project**
```powershell
supabase link --project-ref pjgwpksoqubtzfsetjbu
```

3. **Apply all migrations**
```powershell
supabase db push
```

## Verification Checklist

After applying migrations, verify:

- [ ] All tables are created (check Table Editor)
- [ ] RLS is enabled on all tables (look for 🔒 icon)
- [ ] You can see the custom types/enums in Database → Types
- [ ] Functions are created in Database → Functions
- [ ] No errors in the SQL logs

## Troubleshooting

### Error: "relation already exists"
- This means a table was already created
- Solution: Either skip that migration or drop the table first

### Error: "permission denied"
- Make sure you're logged in as the project owner
- Verify you're using the correct project

### Error: "syntax error"
- Copy the entire SQL file content carefully
- Make sure no characters are missing

## Next Steps

After migrations are complete:
1. ✅ Configure authentication providers
2. ✅ Set up email templates
3. ✅ Test database connectivity
