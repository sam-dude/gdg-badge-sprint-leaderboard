# Deployment Guide

## Setup Supabase Database

1. **Create a Supabase Project**:
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**:
   - In Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Click "Run" to create tables

3. **Seed Initial Data** (Optional):
   - Copy contents of `database/seed.sql`
   - Run in SQL Editor to add sample participants

## Configure Environment Variables

### Local Development

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. **Push to GitHub** (already done):

   ```bash
   git add .
   git commit -m "Add backend API"
   git push origin main
   ```

2. **Configure Vercel**:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Redeploy**:
   - Vercel will automatically redeploy when you push to GitHub
   - Or manually trigger a redeployment in the Vercel dashboard

4. **Configure Root Directory** (if needed):
   - In Vercel project settings
   - Set Root Directory to: `gdg-leaderboard`

## Testing the API

Once deployed, test endpoints:

```bash
# Get all participants
curl https://your-app.vercel.app/api/participants

# Create participant
curl -X POST https://your-app.vercel.app/api/participants \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","badges":5,"posts":3}'
```

## Database Schema

The backend uses two main tables:

- `participants`: Stores participant info (name, email, profile URLs)
- `scores`: Stores badge counts and calculated points

Points are calculated as: **(badges × 25) + (posts × 10)**

## Admin Access

- URL: `/admin`
- Password: `gdgoau2026` (change in production!)

## Next Steps

1. Set up Supabase project
2. Add environment variables to Vercel
3. Test API endpoints
4. Update admin panel to use API
5. Enable real-time updates (optional)
