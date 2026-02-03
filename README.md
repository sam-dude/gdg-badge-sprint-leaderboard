# GDG OAU 30-Day Learning Challenge Leaderboard

Track participant progress in the GDG OAU 30-day learning challenge with Google Developer Platform and Google Skills badges.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API to get your credentials
4. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` (choose a secure password)

### 3. Create Database Tables

1. Open Supabase SQL Editor
2. Run the SQL from `database/schema.sql`
3. (Optional) Run `database/seed.sql` for sample data

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Scoring System

- **Google Developer Badge**: 5 points
- **Google Skills Badge**: 5 points
- **Social Media Post**: 2 points
- **Formula**: `(dev_badges + skills_badges) × 5 + social_posts × 2`

## 🗂️ Project Structure

```
gdg-leaderboard/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main leaderboard (/)
│   ├── admin/             # Admin panel (/admin)
│   └── api/               # API routes
├── lib/                   # Utilities
│   └── supabase.ts        # Supabase client & types
├── database/              # SQL scripts
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
└── components/            # React components
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=      # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY= # From Supabase project settings
ADMIN_PASSWORD=                # Set your admin password
SCRAPER_API_KEY=               # For Python scraper (optional)
```

## 📝 API Endpoints

- `GET /` - Public leaderboard
- `GET /admin` - Admin panel (password protected)
- `POST /api/update-scores` - Update badge counts (API key required)
- `POST /api/admin/update-posts` - Update social media posts

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

Vercel auto-deploys on every push to main branch.

## 🛠️ Development Tasks

- [ ] Complete leaderboard UI
- [ ] Build admin panel
- [ ] Add API routes
- [ ] Implement authentication
- [ ] Create Python scraper
- [ ] Add loading states
- [ ] Mobile responsive design
- [ ] Deploy to production

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript

## 🔧 Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- See [SETUP.md](./SETUP.md) for detailed setup instructions

## 🤝 Contributing

1. Update participant data in Supabase
2. Run scraper to update badge counts
3. Manually update social media posts via admin panel

## 📧 Support

For issues or questions, contact the GDG OAU team.

---

Built with ❤️ for GDG OAU

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
