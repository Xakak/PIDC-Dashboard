# PIDC Statistics Dashboard

Pakistan Industrial Development Corporation — Industrial Statistics Portal

---

## Week 1 Goal

By end of this week every student should be able to:
- Run the frontend locally at `http://localhost:3000`
- See the login page and dashboard shell
- Have Supabase connected (even if auth isn't wired yet)
- Have the FastAPI backend responding at `http://localhost:8000/ping`

---

## Project Structure

```
pidc-dashboard/
├── src/
│   ├── app/
│   │   ├── login/          → S1: Login page (Week 1 ✓)
│   │   ├── dashboard/      → S1+S2: Main dashboard (Week 1 shell ✓)
│   │   ├── upload/         → S2: Upload page (Week 3)
│   │   ├── statistics/     → S2: Stats page (Week 5)
│   │   └── reports/        → S1: Reports page (Week 6)
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx → Navigation (Week 1 ✓)
│   │       └── Topbar.tsx  → Page header (Week 1 ✓)
│   └── lib/
│       ├── supabase.ts     → S3: Supabase client (Week 1)
│       └── utils.ts        → Shared helpers
├── backend/
│   ├── main.py             → S4: FastAPI app (Week 1 shell ✓)
│   └── requirements.txt
└── supabase/
    └── schema.sql          → S3: Run this in Supabase SQL Editor
```

---

## Setup Instructions

### Everyone: Clone & install

```bash
git clone <your-repo-url>
cd pidc-dashboard

# Install frontend dependencies
npm install

# Copy the env template
cp .env.local.example .env.local
```

### S3 (Supabase): Create project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Copy your **Project URL** and **anon key** from Settings → API
3. Paste them into `.env.local`
4. Go to SQL Editor → New Query → paste contents of `supabase/schema.sql` → Run
5. Go to Storage → Create two buckets: `uploads` and `reports` (both private)

### S1 (Frontend): Run Next.js

```bash
npm run dev
# Open http://localhost:3000
```

### S4 (Backend): Run FastAPI

```bash
cd backend

# Create a Python virtual environment (one-time)
python -m venv venv
source venv/bin/activate        # Mac/Linux
# OR: venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Copy env template
cp .env.example .env
# (add your Supabase service key to .env)

# Run the server
uvicorn main:app --reload --port 8000
# Open http://localhost:8000/ping → should return {"status":"ok"}
# Docs at http://localhost:8000/docs
```

### S5 (Integration): Verify the ping works from frontend

Open your browser console on `http://localhost:3000` and run:
```js
fetch('http://localhost:8000/ping').then(r => r.json()).then(console.log)
// Should print: {status: 'ok', service: 'pidc-statistics-api'}
```

If you get a CORS error, make sure `uvicorn` is running and check the `allow_origins` in `backend/main.py`.

---

## Week-by-Week Task Map

| Week | S1 (Frontend) | S2 (UI/Charts) | S3 (Supabase) | S4 (FastAPI) | S5 (Integration) |
|------|---------------|----------------|---------------|--------------|------------------|
| 1    | Pages + routing | Layout shell | Schema + auth setup | /ping endpoint | Connect all 3 layers |
| 2    | Login/signup forms | Style auth pages | RLS + roles | Auth middleware | Test login flow E2E |
| 3    | Upload page | SheetJS preview grid | Storage bucket | Receive file endpoint | Upload → storage test |
| 4    | Status page | Column selection UI | DB writes | Pandas processing | Full upload → DB test |
| 5    | Dashboard data fetch | Recharts (4 charts) | Aggregation queries | Stats endpoint | Charts show real data |
| 6    | Download button | Report preview UI | Report query | openpyxl export | Download works E2E |
| 7    | Error pages | Toast notifications | Edge case handling | Input validation | Break-test everything |
| 8    | Responsive fixes | UI polish | Seed demo data | Logging | Demo prep |

---

## Asking Claude for Help

When you hit a problem, paste this context:

```
I'm working on the PIDC Statistics Dashboard (Next.js 14 + Supabase + FastAPI).

My task this week: [your specific task]
File I'm working in: [e.g. src/app/upload/page.tsx]
What I'm trying to do: [one sentence]
Error / problem: [paste the full error message]
Relevant code: [paste the function or component]
```

The more specific you are, the faster the fix.

---

## Deployment

- **Frontend**: Push to GitHub → connect repo to [Vercel](https://vercel.com) → add env vars in Vercel dashboard
- **Backend**: Push `backend/` to GitHub → deploy to [Render](https://render.com) as a Web Service with `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Update `NEXT_PUBLIC_API_URL` in Vercel to your Render URL once deployed

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | UI, routing, client-side Excel parsing |
| Styling | Tailwind CSS | Utility-first styling |
| Charts | Recharts | Data visualisations |
| Excel (client) | SheetJS (xlsx) | In-browser preview |
| Auth + DB + Storage | Supabase | Auth, PostgreSQL, file storage |
| Backend | FastAPI (Python) | Excel processing, report generation |
| Data processing | pandas + openpyxl | Server-side Excel manipulation |
