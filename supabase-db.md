# Supabase Database Documentation

This document describes the database schema, RLS policies, indexing, and triggers designed and implemented in Supabase for **Vivaha Studio** (`wed-pro`).

## Architectural Strategy: JSONB Document Store

Instead of breaking the complex, highly-nested wedding invitation data into 15+ relational tables (e.g., `events`, `milestones`, `gallery_images`, `rsvp_answers`), the database uses a **JSONB Document Store Strategy**. All dynamic, nested content is housed in the `content` column of the `invitations` table, which maps 1:1 to the frontend `WeddingData` TypeScript interface.

### Benefits
1. **Frictionless Real-time Autosave:** Saving is a simple, single-row `UPDATE` statement that persists the entire state instantly, avoiding complex, multi-table transactions.
2. **Maximum Render Performance:** When a guest opens a public invitation link, a single database read with an index lookup retrieves all data required to render the entire cinematic experience in one network round trip.
3. **Template Agnostic:** Adding new sections (e.g., live stream links, guestbooks) to templates only requires expanding the JSONB payload structure and does not require complex database migrations.

---

## SQL Schema Definition

Below is the exact SQL script executed on Supabase to set up the tables, Row Level Security (RLS) policies, indexes, and triggers.

```sql
-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    template_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    published_at TIMESTAMPTZ
);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Profiles
CREATE POLICY "Allow public read of profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Allow users to update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5. RLS Policies for Invitations
CREATE POLICY "Allow public read of published invitations"
    ON public.invitations FOR SELECT
    USING (status = 'published');

CREATE POLICY "Allow owners full access to invitations"
    ON public.invitations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Performance Indexes
CREATE UNIQUE INDEX IF NOT EXISTS invitations_slug_idx ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS invitations_user_id_idx ON public.invitations(user_id);

-- 7. Trigger to Sync updated_at Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_invitations_updated_at
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Automatic Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Schema Details

### 1. `profiles` Table
| Column Name | Data Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `REFERENCES auth.users(id)` | Identifies the profile. Cascade deletes when user account is deleted. |
| `email` | `text` | `UNIQUE`, `NOT NULL` | User email address. |
| `full_name` | `text` | Nullable | User display name. |
| `created_at` | `timestamptz` | `DEFAULT now()`, `NOT NULL` | Time profile was created. |

### 2. `invitations` Table
| Column Name | Data Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique invitation ID. |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES profiles(id)` | Invitation owner. |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | Dynamic URL path for invitation sharing (e.g., `/w/rahul-weds-ananya`). |
| `template_id` | `text` | `NOT NULL` | Template stylesheet / rendering variant. |
| `status` | `text` | `NOT NULL`, `DEFAULT 'draft'`, `CHECK (draft, published)` | Publication status. |
| `content` | `jsonb` | `NOT NULL`, `DEFAULT '{}'::jsonb` | Nested Document matching the `WeddingData` type definition. |
| `created_at` | `timestamptz` | `DEFAULT now()`, `NOT NULL` | Creation timestamp. |
| `updated_at` | `timestamptz` | `DEFAULT now()`, `NOT NULL` | Auto-updating modification timestamp. |
| `published_at` | `timestamptz` | Nullable | Time the invitation was published. |

---

## Verification & Administration

You can visually view and query these tables, RLS policies, and triggers via the Supabase Dashboard:
1. **Tables & Rows:** [Supabase Dashboard > Table Editor](https://supabase.com/dashboard/project/kbwkvbwdxstwsfgkpwbp/editor)
2. **RLS Policies:** [Supabase Dashboard > Authentication > Policies](https://supabase.com/dashboard/project/kbwkvbwdxstwsfgkpwbp/auth/policies)
3. **Triggers:** [Supabase Dashboard > Database > Triggers](https://supabase.com/dashboard/project/kbwkvbwdxstwsfgkpwbp/database/triggers)
