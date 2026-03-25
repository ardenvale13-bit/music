# Arden Vale Music Dashboard — Setup Guide

## Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up PostgreSQL
Option A — **Railway** (recommended for deployment):
1. Go to https://railway.app and create a new project
2. Add a PostgreSQL service
3. Copy the `DATABASE_URL` from the service variables
4. Paste it in your `.env` file

Option B — **Local Postgres**:
```bash
# If you have Docker:
docker run -d --name music-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=music_app -p 5432:5432 postgres:16

# Then use this in .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/music_app?schema=public"
```

Option C — **Prisma Dev** (zero-config):
```bash
npx prisma dev
```

### 3. Push the database schema
```bash
npx prisma db push
```

### 4. Run the dev server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repo in Vercel (https://vercel.com/new)
3. Add your `DATABASE_URL` environment variable (from Railway)
4. Deploy!

The `vercel.json` and `postinstall` script handle Prisma generation automatically.

---

## Mobile App (Capacitor)

### Setup
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android  # or ios
```

### Build for mobile
```bash
npm run build
npx next export      # generates /out directory
npx cap sync
npx cap open android # opens in Android Studio
```

---

## MCP API Endpoints

The app exposes an MCP-compatible JSON API at `/api/mcp`:

| Action | URL | Description |
|--------|-----|-------------|
| List all | `/api/mcp?action=list` | All songs with tags |
| Get one | `/api/mcp?action=get&id=XXX` | Single song detail |
| Search | `/api/mcp?action=search&q=XXX` | Search by title/lyrics/about |
| Lyrics | `/api/mcp?action=lyrics&id=XXX` | Just lyrics for a song |
| Stats | `/api/mcp?action=stats` | Dashboard statistics |
| Tags | `/api/mcp?action=tags` | All tags with counts |
| WIPs | `/api/mcp?action=wips` | All works in progress |
| Completed | `/api/mcp?action=completed` | All completed songs |

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── songs/       # CRUD endpoints
│   │   ├── tags/        # Tag management
│   │   ├── upload/      # File upload handler
│   │   └── mcp/         # MCP-compatible API
│   ├── components/
│   │   ├── AudioPlayer  # Custom audio player
│   │   ├── Sidebar      # Navigation sidebar
│   │   ├── SongCard     # Song grid card
│   │   └── SongForm     # Create/edit form
│   ├── songs/           # Song pages (list, detail, edit, new)
│   ├── wips/            # Works in progress page
│   └── tags/            # Tag management page
├── lib/
│   ├── prisma.ts        # Prisma client singleton
│   └── types.ts         # TypeScript types
prisma/
└── schema.prisma        # Database schema
```
