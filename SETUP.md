# Setup Guide

## Step-by-Step Setup (15 minutes)

### 1. Supabase Project Setup

1. **Go to** [supabase.com](https://supabase.com) and sign in
2. **Click** "New Project"
3. **Enter**:
   - Project name: `gdg-oau-leaderboard`
   - Database password: (generate strong password)
   - Region: Choose closest to your location
4. **Wait** 2 minutes for project to initialize

### 2. Get Supabase Credentials

1. **Click** Project Settings (gear icon)
2. **Go to** API section
3. **Copy** these values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure Environment

1. **Copy** `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. **Edit** `.env.local` with your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ADMIN_PASSWORD=your-secure-password-123
   SCRAPER_API_KEY=random-key-456
   ```

### 4. Create Database Tables

1. **Open** Supabase Dashboard
2. **Click** SQL Editor (left sidebar)
3. **Click** "New Query"
4. **Paste** contents from `database/schema.sql`
5. **Click** "Run" (or press F5)
6. **Verify** tables created in Table Editor

### 5. Add Sample Data (Optional)

1. **In SQL Editor**, paste contents from `database/seed.sql`
2. **Click** "Run"
3. **Check** Table Editor → `participants` and `scores`

### 6. Test the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

You should see the leaderboard with sample data!

## Troubleshooting

### Error: "Invalid Supabase URL"

- Check `.env.local` file exists in root directory
- Verify URL starts with `https://` and ends with `.supabase.co`
- Restart dev server after changing env variables

### Error: "relation does not exist"

- Run `database/schema.sql` in Supabase SQL Editor
- Check table names match exactly (lowercase)

### No data showing

- Run `database/seed.sql` to add sample data
- Check Supabase Table Editor to verify data exists

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Setup complete
2. 📄 Build leaderboard page (`app/page.tsx`)
3. 🔧 Create admin panel (`app/admin/page.tsx`)
4. 🔌 Add API routes (`app/api/`)
5. 🚀 Deploy to Vercel

## Quick Reference

| Task            | Command                             |
| --------------- | ----------------------------------- |
| Start dev       | `npm run dev`                       |
| Install package | `npm install package-name`          |
| Run SQL         | Supabase Dashboard → SQL Editor     |
| View logs       | Terminal or Vercel Dashboard        |
| Deploy          | `git push` (if connected to Vercel) |
