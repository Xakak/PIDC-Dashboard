# PIDC Statistics Dashboard

Pakistan Industrial Development Corporation — Industrial Statistics Portal

---

## Quick Start

### Frontend (Next.js)

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Mac/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Copy env file and add your Supabase keys
cp .env.example .env

# Run server
uvicorn main:app --reload --port 8000
# Open http://localhost:8000/ping
```

---

## Project Structure

```
pidc-dashboard/
├── src/
│   ├── app/                  # Next.js pages
│   │   ├── login/            # Login page
│   │   ├── dashboard/        # Dashboard overview
│   │   ├── upload/          # Excel upload page
│   │   └── admin/           # Admin panel
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.tsx   # Navigation sidebar
│   └── lib/
│       └── supabase.ts       # Supabase client
├── public/
│   └── PIDC-Logo.png        # Logo image
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt     # Python dependencies
└── supabase/
    └── schema.sql           # Database schema
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Excel Processing | xlsx (client), pandas (server) |
| Auth + DB + Storage | Supabase |
| Backend | FastAPI (Python) |

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (backend/.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:3000
```

---

## Features

- **Login** - Supabase authentication with role-based redirects
- **Upload** - Drag-and-drop Excel file upload with data preview
- **Admin Panel** - Review, approve/reject entity submissions
- **Dashboard** - Overview statistics with KPI cards

---

## Getting Help

See [STUDENT-GUIDE.md](./STUDENT-GUIDE.md) for detailed setup instructions and task breakdown.

---

## License

This project is for educational purposes.
