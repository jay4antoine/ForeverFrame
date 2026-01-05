# Supabase Setup Guide for ForeverFrame

This guide walks you through setting up Supabase as the backend for ForeverFrame.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in:
   - **Name**: ForeverFrame
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup (~2 minutes)

## 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. Add them to your `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run Database Migrations

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy and paste the entire contents into the SQL editor
4. Click "Run" to execute
5. Repeat for `supabase/migrations/002_storage_setup.sql`

## 4. Configure Storage

The storage bucket should be created by the migration. To verify:

1. Go to **Storage** in your Supabase dashboard
2. You should see an "images" bucket
3. If not, create it:
   - Click "New bucket"
   - Name: `images`
   - Check "Public bucket"
   - Click "Create bucket"

## 5. Deploy Edge Function

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
cd ForeverFrame
supabase link --project-ref your-project-id
```

4. Set the Nano Banana Pro API key secret:
```bash
supabase secrets set NANO_BANANA_PRO_API_KEY=your-api-key
```

5. Deploy the Edge Function:
```bash
supabase functions deploy enhance-image
```

### Option B: Manual Deployment

1. Go to **Edge Functions** in your Supabase dashboard
2. Click "Create a new function"
3. Name: `enhance-image`
4. Copy the code from `supabase/functions/enhance-image/index.ts`
5. Add the secret:
   - Go to **Settings** → **Edge Functions**
   - Add secret: `NANO_BANANA_PRO_API_KEY` with your API key

## 6. Configure Authentication Providers

### Email/Password (Enabled by default)

No additional setup needed.

### Google Sign-In (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
5. In Supabase, go to **Authentication** → **Providers** → **Google**
6. Enable and add your Client ID and Secret

### Apple Sign-In (Optional)

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create an App ID with Sign In with Apple capability
3. Create a Services ID for web authentication
4. In Supabase, go to **Authentication** → **Providers** → **Apple**
5. Enable and configure with your Apple credentials

## 7. Verify Setup

1. Build and run your app:
```bash
npm run dev
```

2. Try signing up with email
3. Try creating and enhancing an image
4. Check that the image appears in your gallery

## Environment Variables Summary

### Client-side (.env)
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Edge Function Secrets (Supabase Dashboard)
```bash
NANO_BANANA_PRO_API_KEY=your-nano-banana-pro-api-key
```

## Troubleshooting

### "Row Level Security" errors
Make sure all RLS policies are created. Re-run the migration SQL if needed.

### Images not uploading
Check that the storage bucket exists and has the correct policies.

### Edge Function not working
1. Check the function logs in Supabase dashboard
2. Verify the `NANO_BANANA_PRO_API_KEY` secret is set
3. Make sure the function is deployed

### Authentication not working
1. Check that your redirect URLs are configured correctly
2. For OAuth providers, verify client IDs and secrets
3. Check the auth logs in Supabase dashboard

