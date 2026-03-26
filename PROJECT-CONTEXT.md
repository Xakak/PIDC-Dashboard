# PIDC Statistics Dashboard - Project Context

> **Last Updated:** March 12, 2026  
> **Status:** HTML/CSS Prototypes Complete → Next Phase: Next.js + Supabase + FastAPI Implementation  
> **Next Phase:** Implementing Next.js frontend, Supabase backend, FastAPI processing microservice

---

## Project Overview

**PIDC Statistics Dashboard** is a centralized web application for the Pakistan Industrial Development Corporation where government entities upload annual/bi-annual statistics in Excel format. The system consolidates data into a master Excel file with visualizations.

### Current Phase
Building **HTML/CSS prototypes** using Tailwind CSS before implementing in **Next.js (App Router)** with **Supabase** for backend services (Auth, Storage, PostgreSQL) and a **FastAPI** microservice for Excel processing.

### Interactive Preview & Visualization
To avoid performance bottlenecks, the architecture shifts initial file reading to the client side:
1. The Next.js frontend uses a library like `xlsx` (SheetJS) to read the Excel file in the browser upon drop.
2. Parsed JSON data is rendered in an interactive data grid (using shadcn/ui or react-data-grid).
3. Users select columns/rows via state (useState/Zustand); selections dynamically update Recharts visualizations.
4. On final submit, the original file is uploaded to Supabase Storage and the selection payload is sent to FastAPI for validation, consolidation, and storage.

---

---

## File Structure

```
 /home/rayan/Documents/Dashboard-Frontend-design/
 │
 ├── landing.html              # Public landing page (entry point) → to be converted to Next.js page
 ├── login.html                # Authentication page → to be converted to Next.js page (Supabase Auth)
 ├── dashboard-dark.html       # Main dashboard with KPIs and charts → reference for Next.js dashboard
 ├── upload-dark.html          # File upload interface → reference for Next.js upload page
 ├── entities-dark.html        # Entity management with table → reference for Next.js entities page
 ├── analytics-dark.html       # Analytics & data visualizations → reference for Next.js analytics page
 ├── reports-dark.html         # Report generation & management → reference for Next.js reports page
 │
 ├── PRD-PIDC-Statistics-Dashboard.md   # Product Requirements Document
 └── PROJECT-CONTEXT.md        # This file - Project context for AI agents

## Upcoming File Structure (Post-Prototype)

When converting to the Next.js/Supabase/FastAPI stack, the project will adopt the following structure:

 /home/rayan/Documents/Dashboard-Frontend-design/
 │
 ├── /app                  # Next.js App Router (pages: dashboard, upload, entities, analytics, reports, etc.)
 ├── /components           # shadcn/ui and custom React components
 ├── /lib                  # Supabase client, utilities
 ├── /public               # Static assets
 │
 ├── /fastapi              # Python microservice for Excel processing
 │   ├── /app              # FastAPI application
 │   ├── /workers          # Background tasks (if using Celery)
 │   └── requirements.txt
 │
 ├── landing.html          # To be converted to Next.js page
 ├── login.html            # To be converted to Next.js page (Supabase Auth)
 ├── dashboard-dark.html   # Reference for Next.js dashboard
 ├── upload-dark.html      # Reference for Next.js upload page
 ├── entities-dark.html    # Reference for Next.js entities page
 ├── analytics-dark.html   # Reference for Next.js analytics page
 ├── reports-dark.html     # Reference for Next.js reports page
 │
 ├── PRD-PIDC-Statistics-Dashboard.md
 └── PROJECT-CONTEXT.md
```

---

## Page Navigation Flow

```
landing.html
    │
    ├── "Sign In" ──────────► login.html
    └── "Get Started" ──────► login.html
                                   │
                                   ▼
                          dashboard-dark.html (authenticated)
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
            ▼                      ▼                      ▼
    upload-dark.html      entities-dark.html      analytics-dark.html
                                                          │
                                                          ▼
                                                  reports-dark.html
```

### Sidebar Navigation (All Dashboard Pages)
- Dashboard → `dashboard-dark.html`
- Upload → `upload-dark.html`
- Entities → `entities-dark.html`
- Analytics → `analytics-dark.html`
- Reports → `reports-dark.html`
- Users → `#` (not implemented)
- Settings → `#` (not implemented)

---

## Design System

### Color Palette (Tailwind Config)

The same Tailwind color palette from the prototypes will be used in the Next.js project:

```javascript
colors: {
  'bg-base': '#0A0A0A',        // True black background
  'bg-surface': '#111111',      // Card/sidebar background
  'bg-elevated': '#1A1A1A',     // Elevated elements
  'bg-overlay': '#222222',      // Overlays/modals
  'primary': '#A3B018',         // Olive/lime green CTA
  'primary-hover': '#B8C41E',   // Primary hover state
  'primary-muted': '#7D8A12',   // Muted primary
  'text-primary': '#FFFFFF',    // Main text
  'text-secondary': '#888888',  // Secondary text
  'text-muted': '#555555',      // Muted/disabled text
  'border-default': '#1A1A1A',  // Default borders
  'border-hover': '#2A2A2A',    // Hover borders
  'success': '#22C55E',         // Success states
  'warning': '#EAB308',         // Warning states
  'error': '#EF4444',           // Error states
  'info': '#3B82F6',            // Info states
}
```

### Typography

```javascript
fontFamily: {
  sans: ['Inter', 'sans-serif'],    // Body text
  mono: ['Fira Code', 'monospace'], // Numbers, data, code
}
```

### Design Principles

1. **Dark mode primary** - Professional monochrome theme
2. **No gradients** - Use solid colors with opacity (e.g., `bg-primary/10`)
3. **No glow effects** - Clean, corporate aesthetic
4. **Subtle hover states** - Border color change, slight opacity shifts
5. **Monochrome avatars** - Gray background with border, not colorful
6. **Chart colors**: `#A3B018` (olive), `#555555` (gray), `#3B82F6` (blue)
7. **Rounded corners**: `rounded-lg` for small elements, `rounded-xl` for cards

### Component Patterns

All component patterns from the HTML prototypes (sidebar active state, status badges, entity type badges, monochrome avatars, primary/secondary buttons) can be implemented using **shadcn/ui** components or custom React components that follow the same styling.

The shadcn/ui library provides accessible, customizable components that match the dark mode requirements and can be styled with the above Tailwind config.

---

## Dependencies

When converting to the Next.js/Supabase/FastAPI stack, the following npm packages will be used:

### Frontend (Next.js)
- `next`, `react`, `react-dom` – React framework
- `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer` – Styling
- `@shadcn/ui` – Accessible UI components (modals, tables, dropdowns, etc.)
- `recharts` – Data visualization (line, bar, pie charts)
- `@supabase/supabase-js` – Supabase client for Auth, Storage, and PostgreSQL
- `xlsx` (SheetJS) or `papaparse` – Client-side Excel/CSV parsing for interactive preview
- `zustand` or `react` `useState`/`useContext` – State management (optional)
- `lucide-react` – Icons (consistent with Lucide used in prototypes)

### Backend (FastAPI)
- `fastapi` – Web framework
- `uvicorn` – ASGI server
- `pandas`, `openpyxl` – Excel processing and data manipulation
- `supabase-py` – Python client for Supabase (PostgreSQL and Storage)
- `python-dotenv` – Environment variable management
- (Optional) `celery` and `redis` – For background task scaling beyond FastAPI BackgroundTasks

### Lucide Icons
In the Next.js app, icons will be imported from `lucide-react` (e.g., `import { LucideIcon } from 'lucide-react'`), providing the same icon set as used in the HTML prototypes.

Note: The CDN scripts from the prototype phase are replaced by the above npm packages in the final implementation.

---

## Page-by-Page Details

### 1. landing.html
- **Purpose:** Public-facing landing page
- **Features:**
  - Hero section with CTA
  - Features overview
  - How it works section
  - Entity showcase
  - Contact information
- **Links to:** `login.html`

### 2. login.html
- **Purpose:** User authentication
- **Features:**
  - Email/password form
  - "Remember me" option
  - Forgot password link
- **Links to:** `dashboard-dark.html` (after login)

### 3. dashboard-dark.html
- **Purpose:** Main dashboard overview
- **Features:**
  - KPI cards (Total Entities, Pending, Completion Rate, Overdue)
  - Line chart (submissions over time)
  - Doughnut chart (entity distribution)
  - Recent submissions table
  - Period progress bar
- **Charts:** Uses Chart.js

### 4. upload-dark.html
- **Purpose:** File upload interface
- **Features:**
  - Drag-and-drop dropzone
  - File preview with remove option
  - Entity & period selectors
  - Previous uploads list
  - Upload guidelines card
- **User context:** Entity user (Hassan Malik)

### 5. entities-dark.html
- **Purpose:** Entity management
- **Features:**
  - Summary stats cards
  - Filter toggles (All, Industrial, Commercial, Services)
  - Searchable entity table
  - Add Entity modal
  - Pagination
- **User context:** Admin (Fatima Ahmed)

### 6. analytics-dark.html
- **Purpose:** Data analytics & visualizations
- **Features:**
  - Date range picker
  - Filter tabs by entity type
  - Summary stats (submissions, on-time rate, processing time, quality score)
  - Submissions trend chart (line, year-over-year comparison)
  - Entity performance chart (bar)
  - Submission status breakdown (doughnut)
  - Top performing entities list
  - Regional distribution chart (horizontal bar)
- **Charts:** Uses Chart.js

### 7. reports-dark.html
- **Purpose:** Report generation & download
- **Features:**
  - Quick generate cards (Master Excel, Compliance, Overdue, Analytics PDF)
  - Tabs (All Reports, Generated, Scheduled, Templates)
  - Reports table with filters
  - Report type badges
  - Download actions
  - Scheduled reports section
  - Pagination

---

## What's NOT Implemented (Placeholders)

These sidebar links point to `#` and need implementation:
- **Users** - User management page
- **Settings** - Application settings page

---

## Development Notes

### Extending the Dashboard

When creating new pages:

1. **Copy the sidebar structure** from any existing `-dark.html` file
2. **Update the `active` class** on the appropriate nav link
3. **Use the same Tailwind config** (colors, fonts)
4. **Follow component patterns** documented above
5. **Initialize Lucide icons** at the bottom of the page

### Responsive Breakpoints

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

Sidebar collapses to icon-only on mobile (`w-20` → `lg:w-64`).

### Accessibility

- All buttons have `cursor-pointer`
- Interactive elements have `aria-label` where needed
- Focus states use primary color outline
- Respects `prefers-reduced-motion`

---

## Next Steps (When Continuing)

1. **Set up Next.js project** with Tailwind CSS and shadcn/ui.
2. **Convert each HTML prototype** into a Next.js page (under `/app`), reusing the Tailwind styles and component patterns.
3. **Set up Supabase project**:
   - Create PostgreSQL database.
   - Configure Auth (Email/Password, role-based: Admin, Entity, Viewer).
   - Create Storage buckets for uploads (e.g., `uploads` for raw Excel files, `reports` for generated reports).
4. **Implement Supabase client** in Next.js for authentication and data fetching.
5. **Build FastAPI microservice** for Excel processing:
   - Set up FastAPI with endpoints to receive file paths and user selections.
   - Use pandas and openpyxl to validate and extract data.
   - Connect to the same Supabase PostgreSQL database (via supabase-py or SQLAlchemy).
   - Implement background processing (FastAPI BackgroundTasks or Celery/Redis) to stay within 30-second benchmark.
6. **Set up webhooks** from Supabase Storage to trigger the FastAPI service on file upload.
7. **Implement interactive preview and visualization** in Next.js:
   - Use `xlsx` (SheetJS) to read the Excel file in the browser on drop.
   - Render the data in a grid (shadcn/ui table or react-data-grid).
   - Use state (useState or Zustand) to track column/row selections.
   - Pass selected data to Recharts for real-time line/bar/pie chart updates.
8. **On final submit**:
   - Upload the original Excel file to Supabase Storage.
   - Send a JSON payload (with file path and user selections) to the FastAPI endpoint.
   - FastAPI creates a pending upload record, processes the selection, writes to the statistics table, and updates the status to processed.
9. **Add real-time updates** (optional) using Supabase Realtime or polling to refresh dashboards after processing.
10. **Deploy**:
    - Next.js app to Vercel (or similar).
    - FastAPI service to a platform that supports background workers (Render, Fly.io, VPS, etc.).
    - Ensure environment variables are set for Supabase keys and database connection strings.

---

## Sample Data Context

### Entity Names (Pakistani Cities/Divisions)
- Karachi Corporation (KC)
- Lahore Division (LD)
- Peshawar Unit (PU)
- Islamabad HQ (IH)
- Quetta Center (QC)
- Faisalabad Unit (FU)
- Multan Center (MC)

### Reporting Periods
- `2025-H1` - First half 2025
- `2025-H2` - Second half 2025
- `2025-Q1` through `2025-Q4` - Quarterly

### Entity Types
- Industrial
- Commercial
- Services
- Administrative

---

## Contact

For questions about this project context or design decisions, refer to the PRD document or previous conversation history.
