# PIDC Dashboard — Complete Student Guide
## From Zero to Working App in ~50 Hours

---

## WHAT ARE WE BUILDING?

**The core workflow (everything else is extra):**

```
Entity User logs in
       ↓
Uploads an Excel file + selects entity + period
       ↓
File saved to Supabase Storage
Record saved to database with status = "pending"
       ↓
Admin logs in → sees the pending submission
Admin clicks Approve or Reject
       ↓
FastAPI processes the file in the background
Data rows extracted → saved to statistics table
Status updated to "approved"
```

That's it. That's the whole app. Everything else is polish.

---

## THE 5-PERSON TEAM

| Person | Role | What they own |
|--------|------|---------------|
| **S1** | Frontend — Pages & Routing | Login page, page structure, navigation |
| **S2** | Frontend — Upload Feature | Upload page, file preview, submit button |
| **S3** | Backend — Supabase | Database setup, auth, storage buckets |
| **S4** | Backend — FastAPI | Python server, Excel processing |
| **S5** | Integration & Admin Panel | Admin panel, connecting all pieces, testing |

---

## FILE MAP — WHAT EACH PERSON TOUCHES

```
pidc-dashboard/
│
├── src/app/
│   ├── layout.tsx          ← S1 owns this
│   ├── page.tsx            ← S1 (just a redirect, already done)
│   ├── login/page.tsx      ← S1 owns this
│   ├── dashboard/page.tsx  ← S1 owns this
│   ├── upload/page.tsx     ← S2 owns this (CORE FEATURE)
│   └── admin/page.tsx      ← S5 owns this
│
├── src/components/layout/
│   ├── Sidebar.tsx         ← S1 owns this
│   └── Topbar.tsx          ← S1 (optional, add later)
│
├── src/lib/
│   └── supabase.ts         ← S3 owns this
│
├── supabase/
│   └── schema.sql          ← S3 runs this in Supabase dashboard
│
├── backend/
│   ├── main.py             ← S4 owns this
│   ├── requirements.txt    ← S4 owns this
│   └── .env.example        ← S4 fills in their copy
│
├── .env.local.example      ← S3 fills in for everyone
├── tailwind.config.js      ← Already configured
├── package.json            ← Already configured
└── tsconfig.json           ← Already configured
```

---

## DAY 1 — EVERYONE DOES THIS FIRST

### Step 0: Install the tools you need
Before anything, make sure you have these installed on your computer.

**Node.js** (for the frontend):
- Go to https://nodejs.org → download the LTS version → install it
- Open a terminal and type: `node --version` — should show v18 or higher

**Python** (for the backend):
- Go to https://python.org → download 3.11 or higher → install it
- Type: `python --version` — should show 3.11+

**Git** (to share code):
- Go to https://git-scm.com → download → install

**VS Code** (code editor):
- Go to https://code.visualstudio.com → download → install
- Install these extensions inside VS Code:
  - "Tailwind CSS IntelliSense" (autocomplete for CSS classes)
  - "ES7+ React/Redux/React-Native snippets" (shortcuts for React code)
  - "Prettier" (auto-formats your code)

---

### Step 1: One person creates the GitHub repo (S1 does this)

```bash
# S1 does this on their computer:
git init pidc-dashboard
cd pidc-dashboard

# Copy all the starter files into this folder
# (the files we gave you)

git add .
git commit -m "Initial starter code"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pidc-dashboard.git
git push -u origin main
```

**Everyone else clones it:**
```bash
git clone https://github.com/YOUR_USERNAME/pidc-dashboard.git
cd pidc-dashboard
npm install          # installs all frontend packages (takes 1-2 min)
```

---

### Step 2: S3 sets up Supabase (do this before anything else)

Everyone needs the Supabase keys to run the app. S3 does this and shares the keys.

1. Go to **https://supabase.com** → Sign up (free)
2. Click **"New Project"** → give it a name like "pidc-dashboard" → choose a password → click Create
3. Wait ~2 minutes for it to set up
4. Go to **Settings → API** (left sidebar)
5. Copy:
   - **Project URL** (looks like: https://abcdefgh.supabase.co)
   - **anon public key** (long string starting with "eyJ...")
6. In the **SQL Editor** → **New Query** → paste the entire contents of `supabase/schema.sql` → click **Run**
   - You should see "Success. No rows returned" — that means it worked
7. Go to **Storage** → click **"New bucket"** → name it `uploads` → make it **Private** → Save
8. Copy `.env.local.example` to `.env.local` and fill in the values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
9. **Share .env.local with the whole team** (via WhatsApp/email — NOT via git)

**Create your first user:**
1. Supabase Dashboard → **Authentication** → **Users** → **Add User**
2. Create: `admin@pidc.gov.pk` / any password → this will be your admin account
3. Create: `entity@pidc.gov.pk` / any password → this will be your entity user account
4. Then in **SQL Editor** run:
   ```sql
   update profiles set role = 'admin' where email = 'admin@pidc.gov.pk';
   ```

---

### Step 3: Verify the frontend runs

After S3 shares the `.env.local` file:

```bash
npm run dev
```

Open http://localhost:3000 → you should see the login page.

**If you see a white screen or error:** Check the terminal. Most likely:
- Missing `.env.local` file → create it from the example
- `npm install` wasn't run → run it

---

### Step 4: S4 sets up the FastAPI backend

```bash
cd backend

# Create a virtual environment (a private Python folder for this project)
python -m venv venv

# Activate it:
source venv/bin/activate        # Mac / Linux
venv\Scripts\activate           # Windows (use backslash)

# Install packages
pip install -r requirements.txt

# Copy the env file
cp .env.example .env
```

Open `backend/.env` and fill in:
```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-SERVICE-ROLE-key...   ← NOT the anon key
FRONTEND_URL=http://localhost:3000
```

The SERVICE ROLE key is in Supabase → Settings → API → **service_role** (reveal it).

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

Go to http://localhost:8000/ping → should return `{"status":"ok","service":"pidc-statistics-api"}`

Go to http://localhost:8000/docs → interactive API documentation (automatic!)

---

## WEEK-BY-WEEK TASK PLAN

### WEEK 1 — Get everything running (Goal: see the login page, ping FastAPI)

| Person | Task | Done when... |
|--------|------|-------------|
| S1 | Clone repo, run `npm run dev`, see login page at :3000 | ✅ Login page visible |
| S2 | Clone repo, explore `upload/page.tsx`, understand the code | ✅ Can explain what `handleDrop` does |
| S3 | Set up Supabase, run schema.sql, create storage bucket, share .env.local | ✅ Team can run `npm run dev` |
| S4 | Set up Python venv, run FastAPI, see ping response at :8000 | ✅ `/ping` returns `{"status":"ok"}` |
| S5 | Clone repo, try logging in with admin@pidc.gov.pk | ✅ Login works, redirected to /admin |

**Week 1 milestone: Everyone can run the app locally.**

---

### WEEK 2 — Login works end-to-end

| Person | Task |
|--------|------|
| S1 | Make login page submit to Supabase (the code is already written — just test it) |
| S2 | Read `upload/page.tsx` line by line, understand every `useState` |
| S3 | Test that login/signup works in Supabase Auth. Fix RLS if queries return empty |
| S4 | Add a test endpoint `/echo` that accepts POST body and returns it back |
| S5 | Test full login flow: login as admin → see admin page, login as entity → see upload page |

**Tip for S3:** If queries return empty arrays after login, your RLS policies might be blocking reads. Check them in Supabase → Authentication → Policies.

---

### WEEK 3 — Upload flow works end-to-end

| Person | Task |
|--------|------|
| S1 | Nothing new — polish the sidebar, make sure active states work |
| S2 | Test the upload page: drop a real .xlsx file, see the preview table |
| S3 | Make sure the `uploads` storage bucket exists and is set to private |
| S4 | Test `/process-upload` endpoint manually using the `/docs` page |
| S5 | Test full upload flow: drop file → submit → check Supabase Table Editor → see the row |

**How to create a test Excel file:**
- Open Excel or Google Sheets
- Add columns: `Metric Name`, `Category`, `Value`, `Unit`
- Add 3 rows of fake data
- Download as .xlsx

**Checking it worked:** Go to Supabase → Table Editor → `uploads` table → you should see a new row with `status = pending`.

---

### WEEK 4 — Admin panel works

| Person | Task |
|--------|------|
| S1 | Nothing new |
| S2 | Nothing new |
| S3 | Verify RLS allows admins to see all uploads (entity users should only see their own) |
| S4 | Connect FastAPI processing: when an upload record is created, FastAPI parses it |
| S5 | Test full admin flow: upload as entity user → login as admin → approve → check status changes |

---

### WEEK 5 — Dashboard shows real data

| Person | Task |
|--------|------|
| S1 | Fetch real counts from Supabase in `dashboard/page.tsx` (already scaffolded) |
| S2 | Add a "My Submissions" table to the upload page showing past uploads |
| S3 | Write a Supabase query to count uploads by status |
| S4 | Add a `/statistics/{entity_id}` endpoint that returns processed data |
| S5 | Add a simple Recharts bar chart to the dashboard |

---

### WEEK 6 — Polish, test, and present

- Fix any broken flows
- Add loading states where missing
- Test with all 5 entity users uploading simultaneously
- Make sure the admin panel shows correct data
- Add error messages everywhere (currently basic)
- Prepare a 10-minute demo

---

## COMMON ERRORS AND HOW TO FIX THEM

### "Cannot find module '@/lib/supabase'"
Your `.env.local` file is missing or the path alias isn't set up.
- Check that `.env.local` exists at the root (not inside `src/`)
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Invalid API key" from Supabase
You copy-pasted the wrong key or there's a space at the start/end.
- Go back to Supabase → Settings → API
- Copy the anon key again (triple-click to select all, then copy)
- Paste fresh into `.env.local`

### "CORS error" when frontend calls FastAPI
The FastAPI server isn't running, or it's on a different port.
- Make sure `uvicorn main:app --reload --port 8000` is running in a terminal
- Check `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`

### "Row not found" or empty table after upload
RLS is blocking the read. Entity users can only see their own uploads.
- Make sure `uploaded_by` is being set correctly when inserting
- In Supabase → Authentication → Policies, check the `uploads` policies exist

### Excel preview shows nothing / wrong columns
The Excel file structure doesn't match what the code expects.
- The preview reads the FIRST sheet, first 10 rows
- Make sure your test .xlsx has data starting from Row 1 (no merged header rows)

### FastAPI: "Module not found: supabase"
Your virtual environment isn't activated.
```bash
cd backend
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

### Login redirects to wrong page
The `profiles` table doesn't have a row for your user, or the `role` is wrong.
```sql
-- Run in Supabase SQL Editor:
select * from profiles;
-- If your user isn't there, insert manually:
insert into profiles (id, email, full_name, role)
values ('your-user-uuid', 'admin@pidc.gov.pk', 'Admin User', 'admin');
```

---

## HOW TO USE GIT AS A TEAM

### The golden rule: never push directly to `main`

```bash
# Start a new feature:
git checkout -b feat/your-name-feature-name
# e.g.: git checkout -b feat/s2-upload-preview

# Do your work, then save it:
git add .
git commit -m "Add: file preview table in upload page"
git push origin feat/s2-upload-preview

# On GitHub, open a Pull Request → ask one teammate to review → merge to main
```

### Pull the latest code before starting work each day:
```bash
git checkout main
git pull origin main
git checkout -b feat/your-new-feature
```

### If you get a merge conflict:
Open VS Code → it shows conflicts in green/red → keep the parts you want → save → commit.

---

## UNDERSTANDING THE CODE (FOR BEGINNERS)

### What is `'use client'`?
React has two kinds of components:
- **Server components** (default): run on the server, can fetch data directly, no useState
- **Client components** (`'use client'` at top): run in the browser, can use useState, useEffect, handle clicks

Rule of thumb: **If the page needs button clicks, forms, or state → add `'use client'`**

### What is `useState`?
It's how you store changing values in a component.
```tsx
const [name, setName] = useState('')
// name = current value (starts as '')
// setName = function to change it
// When you call setName('Ali'), React re-renders the component showing 'Ali'
```

### What is `async/await`?
It's how you wait for slow operations (like fetching from a server) without freezing the page.
```tsx
async function handleLogin() {
  const result = await supabase.auth.signIn(...)  // wait for this
  // then do something with result
}
```

### What is Tailwind CSS?
Instead of writing separate CSS files, you put styles directly in the className:
```tsx
<div className="bg-bg-surface border border-border-default rounded-xl p-6">
```
- `bg-bg-surface` → background color (from our color palette)
- `border border-border-default` → adds a border
- `rounded-xl` → rounded corners
- `p-6` → padding of 24px on all sides

### What is Supabase?
It's a managed backend — think of it as your database + file storage + authentication, all in one place, with a web dashboard. You don't need to set up any servers yourself.

### What is FastAPI?
It's a Python web server. You write Python functions, and FastAPI turns them into HTTP endpoints that the frontend can call. The `/docs` URL it auto-generates is extremely helpful for testing.

---

## EXCEL TEMPLATE (share this with testers)

When testing uploads, the Excel file must have these column names in Row 1:

| Metric Name | Category | Value | Unit | Notes |
|-------------|----------|-------|------|-------|
| Revenue | Financial | 5000000 | PKR | Q1 revenue |
| Staff Count | HR | 142 | Count | Full-time only |
| Production Volume | Operational | 8500 | Tonnes | |

- **Metric Name** — required, text
- **Category** — required, text (Financial / HR / Operational)
- **Value** — required, must be a number
- **Unit** — required, text (PKR / Count / % / Tonnes)
- **Notes** — optional

Rows missing Metric Name or Value will be skipped automatically.

---

## DESIGN RULES (keep the app looking consistent)

All colors are already in `tailwind.config.js` — use these class names:

| Use case | Class |
|----------|-------|
| Page background | `bg-bg-base` |
| Card / panel background | `bg-bg-surface` |
| Input / elevated element | `bg-bg-elevated` |
| Main text | `text-text-primary` |
| Subtle text | `text-text-secondary` |
| Disabled / placeholder | `text-text-muted` |
| Primary button | `bg-primary text-bg-base` |
| Success badge | `bg-success/10 text-success` |
| Warning badge | `bg-warning/10 text-warning` |
| Error badge | `bg-error/10 text-error` |
| Card border | `border border-border-default` |

**Rules:**
1. No gradients — use solid colors with opacity (e.g. `bg-primary/10`)
2. No shadows or glow effects — keep it flat
3. Buttons always have `cursor-pointer`
4. Inputs always have `focus:outline-none focus:border-primary`

---

## WEEK 1 CHECKLIST (paste this into your group chat)

```
WEEK 1 CHECKLIST

S1 - Frontend:
[ ] Cloned the repo
[ ] Ran `npm install`
[ ] Created .env.local from the example
[ ] Ran `npm run dev` and saw the login page at localhost:3000

S2 - Upload Feature:
[ ] Cloned the repo
[ ] Read upload/page.tsx and can explain what handleDrop does
[ ] Created a test .xlsx file with the correct columns

S3 - Supabase:
[ ] Created Supabase project
[ ] Ran schema.sql in SQL Editor (no errors)
[ ] Created `uploads` storage bucket (private)
[ ] Created admin@pidc.gov.pk and entity@pidc.gov.pk users
[ ] Made admin user's role = 'admin' in profiles table
[ ] Shared .env.local values with the team

S4 - FastAPI:
[ ] Created Python virtual environment
[ ] Ran `pip install -r requirements.txt`
[ ] Copied .env.example to .env and filled in keys
[ ] Ran `uvicorn main:app --reload --port 8000`
[ ] Visited /ping and saw {"status":"ok"}
[ ] Visited /docs and saw the API documentation

S5 - Integration:
[ ] Logged in as admin@pidc.gov.pk → redirected to /admin
[ ] Logged in as entity@pidc.gov.pk → redirected to /upload
[ ] Tested ping from browser console:
    fetch('http://localhost:8000/ping').then(r=>r.json()).then(console.log)
```
