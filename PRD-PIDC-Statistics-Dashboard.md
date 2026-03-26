# Product Requirements Document (PRD)
## PIDC Consolidated Statistics Dashboard

**Version:** 1.0  
**Date:** March 12, 2026  
**Author:** Product Team  
**Status:** Draft  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Design System & UI Specifications](#8-design-system--ui-specifications)
9. [Information Architecture](#9-information-architecture)
10. [Wireframes & User Flows](#10-wireframes--user-flows)
11. [Security & Compliance](#11-security--compliance)
12. [Rollout Plan](#12-rollout-plan)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Appendix](#14-appendix)

---

## 1. Executive Summary

### 1.1 Product Overview

The **PIDC Consolidated Statistics Dashboard** is a centralized web application that enables Pakistan Industrial Development Corporation (PIDC) and its subsidiary entities to:

- Upload annual and bi-annual statistical reports in Excel format
- Automatically consolidate data from multiple entities into a master Excel file
- Visualize key performance indicators (KPIs) through interactive charts
- Track historical trends across reporting periods
- Generate downloadable consolidated reports

### 1.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend Framework** | Next.js (App Router) | Industry-standard React framework with excellent AI-generated code accuracy, built-in routing, and SEO capabilities. |
| **Styling** | Tailwind CSS | Utility-first framework; carries over the exact custom color palette from HTML prototypes (`bg-base: '#0A0A0A'`, `primary: '#A3B018'`, etc.). |
| **UI Components** | shadcn/ui | Pre-built, accessible, and customizable components (modals, tables, dropdowns) that match dark mode requirements and are highly amenable to AI generation. |
| **Data Visualization** | Recharts (via React) | Maintains PRD requirement for interactive line, area, and bar charts; excellent React integration. |
| **State Management** | React Context or Zustand | For global UI state (e.g., auth, filters); combined with `@supabase/supabase-js` for real-time data fetching. |
| **Backend – Core Infrastructure** | Supabase | Provides PostgreSQL database, Auth (including role-based access control), and Storage for Excel files — reducing boilerplate and fulfilling government-grade requirements. |
| **Backend – Processing Engine** | Python/FastAPI | Dedicated microservice for complex Excel operations (pandas, openpyxl) that are unsuitable for TypeScript/Edge Functions; ensures high-performance data validation and consolidation. |
| **Database ORM / Client** | SQLAlchemy or Supabase Python Client | Enables the Python worker to read/write processing status and statistical data directly to Supabase PostgreSQL. |
| **Task Execution** | FastAPI BackgroundTasks (or Celery/Redis for scaling) | Runs Excel parsing asynchronously to keep upload processing under the 30-second benchmark. |

### 1.3 Design Philosophy

Based on reference designs, the dashboard will feature:

- **Dark mode primary** with optional light mode toggle
- **Purple/violet accent colors** (#8B5CF6) with yellow/amber highlights (#F59E0B)
- **Gradient cards** with subtle glassmorphism
- **Clean typography** using Inter/Fira Sans
- **Smooth micro-interactions** (150-300ms transitions)
- **Data-dense layout** optimized for statistical viewing

---

## 2. Problem Statement

### 2.1 Current State

PIDC oversees multiple subsidiary entities across Pakistan. Currently:

1. Each entity manually compiles statistics in separate Excel files
2. Data is emailed to PIDC headquarters
3. PIDC staff manually copy-paste data into a master spreadsheet
4. Inconsistent formatting causes errors and delays
5. No centralized visualization or historical tracking
6. Report consolidation takes 2-3 weeks per cycle

### 2.2 Pain Points

| Stakeholder | Pain Point | Impact |
|-------------|------------|--------|
| PIDC Admin | Manual data aggregation | 40+ hours per reporting cycle |
| Entity Staff | No standardized template | Formatting inconsistencies |
| Decision Makers | Delayed insights | Reactive rather than proactive decisions |
| IT Department | No audit trail | Compliance risks |

### 2.3 Desired State

A unified platform where:
- Entities upload standardized Excel files through a web interface
- Data is automatically validated and consolidated
- Real-time dashboards display aggregated statistics
- Consolidated master files are generated on-demand
- Historical data is preserved and comparable

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Description | Timeline |
|------|-------------|----------|
| **G1** | Reduce report consolidation time by 80% | 6 months post-launch |
| **G2** | Achieve 100% entity adoption | 3 months post-launch |
| **G3** | Zero manual data entry errors | Immediate |
| **G4** | Enable real-time statistical visibility | Immediate |

### 3.2 Success Metrics (KPIs)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Consolidation time | 2-3 weeks | < 1 day | Time from last upload to report generation |
| Data accuracy | ~85% | 99.9% | Validation error rate |
| User adoption | 0% | 100% | % of entities using the platform |
| Report downloads | 0 | 50+/month | Monthly consolidated report downloads |
| System uptime | N/A | 99.5% | Monthly availability |

---

## 4. User Personas

### 4.1 Persona 1: PIDC Administrator (Primary)

**Name:** Fatima Ahmed  
**Role:** Senior Data Analyst, PIDC Headquarters  
**Age:** 35  
**Technical Skill:** Intermediate  

**Goals:**
- View consolidated statistics across all entities
- Generate master Excel reports for leadership
- Monitor entity submission compliance
- Identify trends and anomalies

**Frustrations:**
- Chasing entities for late submissions
- Manual data consolidation errors
- No historical comparison capability

**Needs:**
- Dashboard showing submission status
- One-click consolidated report generation
- Alert system for missing submissions

---

### 4.2 Persona 2: Entity Data Officer

**Name:** Hassan Malik  
**Role:** Statistics Officer, Regional Entity  
**Age:** 42  
**Technical Skill:** Basic  

**Goals:**
- Submit reports on time
- Confirm successful upload
- View own entity's historical data

**Frustrations:**
- Unclear submission requirements
- No confirmation of successful submission
- Cannot compare with previous periods

**Needs:**
- Simple upload interface
- Clear template with validation rules
- Submission history and status

---

### 4.3 Persona 3: Executive Leadership

**Name:** Dr. Khalid Mehmood  
**Role:** Director General, PIDC  
**Age:** 55  
**Technical Skill:** Basic  

**Goals:**
- High-level overview of all entities
- Quick access to key metrics
- Exportable reports for presentations

**Frustrations:**
- Waiting for manual reports
- Data not current
- No visual dashboards

**Needs:**
- Executive summary dashboard
- KPI cards with trends
- Print-ready reports

---

## 5. Functional Requirements

### 5.1 User Management

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-1.1 | Role-based access control (Admin, Entity, Viewer) | P0 | As an admin, I can assign roles to control data access |
| FR-1.2 | Entity-specific accounts | P0 | As an entity user, I can only see my organization's data |
| FR-1.3 | User activity logging | P1 | As an admin, I can audit who uploaded what and when |
| FR-1.4 | Password reset via email | P1 | As a user, I can reset my password securely |
| FR-1.5 | LDAP/SSO integration (future) | P2 | As a government employee, I can use my existing credentials |

---

### 5.2 File Upload & Processing

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-2.1 | Excel file upload (.xlsx, .xls) | P0 | As an entity user, I can upload my statistical report |
| FR-2.2 | Template validation on upload | P0 | As a user, I receive immediate feedback if my file format is incorrect |
| FR-2.3 | Drag-and-drop upload interface | P1 | As a user, I can drag files into the upload zone |
| FR-2.4 | Upload progress indicator | P1 | As a user, I can see the upload progress |
| FR-2.5 | File size limit (50MB) | P1 | As an admin, I can prevent oversized uploads |
| FR-2.6 | Upload history per entity | P0 | As a user, I can see my previous uploads |
| FR-2.7 | Replace/update previous submission | P1 | As a user, I can correct mistakes by re-uploading |
| FR-2.8 | Support for annual and bi-annual periods | P0 | As a user, I can specify the reporting period |

**File Processing Logic:**

```
1. User uploads Excel file
2. System validates:
   a. File format (.xlsx/.xls)
   b. File size (< 50MB)
   c. Template structure (required columns present)
   d. Data types (numbers, dates, text)
   e. Required fields populated
3. If valid:
   a. Parse data into database
   b. Mark upload as "Processed"
   c. Update entity's submission status
4. If invalid:
   a. Return detailed error messages
   b. Highlight problematic rows/columns
   c. Keep file in "Failed" status
```

---

### 5.3 Data Consolidation

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-3.1 | Automatic consolidation of all entity data | P0 | As an admin, I can generate a master file combining all entities |
| FR-3.2 | Selectable reporting period (annual/bi-annual) | P0 | As an admin, I can filter by time period |
| FR-3.3 | Entity selection for partial reports | P1 | As an admin, I can select specific entities to include |
| FR-3.4 | Master Excel file download | P0 | As an admin, I can download the consolidated report |
| FR-3.5 | PDF export option | P2 | As an executive, I can get a formatted PDF report |
| FR-3.6 | Scheduled auto-generation (weekly/monthly) | P2 | As an admin, I receive automated reports |

**Consolidated Report Structure:**

```
PIDC_Consolidated_Report_[YEAR]_[PERIOD].xlsx

Sheets:
1. Summary - Aggregated KPIs across all entities
2. Entity_001 - Individual entity data
3. Entity_002 - Individual entity data
...
N. Entity_N - Individual entity data
N+1. Trends - Year-over-year comparison
N+2. Metadata - Upload timestamps, file sources
```

---

### 5.4 Dashboard & Visualization

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-4.1 | KPI summary cards (4-6 metrics) | P0 | As a user, I can see key statistics at a glance |
| FR-4.2 | Interactive line/area charts for trends | P0 | As a user, I can visualize data over time |
| FR-4.3 | Bar charts for entity comparison | P1 | As an admin, I can compare entities side-by-side |
| FR-4.4 | Pie/donut charts for composition | P1 | As a user, I can see proportional breakdowns |
| FR-4.5 | Drill-down capability (click to filter) | P1 | As a user, I can click a chart to see details |
| FR-4.6 | Date range selector | P0 | As a user, I can filter data by custom date range |
| FR-4.7 | Entity filter dropdown | P0 | As a user, I can filter by specific entity |
| FR-4.8 | Real-time updates (WebSocket) | P2 | As a user, I see new data without refreshing |
| FR-4.9 | Export chart as image | P2 | As an executive, I can save charts for presentations |

---

### 5.5 Submission Tracking

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-5.1 | Submission status dashboard (per entity) | P0 | As an admin, I can see who has/hasn't submitted |
| FR-5.2 | Deadline configuration | P1 | As an admin, I can set submission deadlines |
| FR-5.3 | Email reminders for pending submissions | P1 | As an entity user, I receive deadline reminders |
| FR-5.4 | Overdue indicators (red/yellow/green) | P0 | As an admin, I can quickly identify late submissions |
| FR-5.5 | Submission completion percentage | P0 | As an admin, I can see overall compliance rate |

---

### 5.6 Notifications & Alerts

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR-6.1 | In-app notifications | P1 | As a user, I see alerts within the dashboard |
| FR-6.2 | Email notifications (upload success/failure) | P1 | As a user, I receive email confirmations |
| FR-6.3 | Admin alerts for new submissions | P1 | As an admin, I'm notified when entities submit |
| FR-6.4 | Configurable notification preferences | P2 | As a user, I can choose which notifications to receive |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Requirement | Specification |
|-------------|---------------|
| Page load time | < 2 seconds (first contentful paint) |
| Dashboard render | < 3 seconds (with 10,000 data points) |
| File upload processing | < 30 seconds for 10MB file |
| Concurrent users | Support 100+ simultaneous users |
| Report generation | < 60 seconds for consolidated Excel |

### 6.2 Scalability

| Requirement | Specification |
|-------------|---------------|
| Entities supported | 50+ with room to grow |
| Historical data | 10+ years of records |
| File storage | 100GB+ with expansion capability |
| Database scaling | Horizontal scaling ready |

### 6.3 Availability & Reliability

| Requirement | Specification |
|-------------|---------------|
| Uptime SLA | 99.5% (excludes scheduled maintenance) |
| Backup frequency | Daily automated backups |
| Disaster recovery | RTO < 4 hours, RPO < 1 hour |
| Maintenance window | Sundays 2:00 AM - 6:00 AM PKT |

### 6.4 Accessibility

| Requirement | Specification |
|-------------|---------------|
| WCAG compliance | Level AA minimum |
| Keyboard navigation | Full support |
| Screen reader | Compatible with NVDA, VoiceOver |
| Color contrast | 4.5:1 minimum (7:1 for critical text) |
| Text scaling | Support up to 200% zoom |

### 6.5 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Mobile Chrome | Android 10+ |

---

## 7. Technical Architecture

### 7.1 System Architecture

To implement the interactive preview and visualization without causing performance bottlenecks, the architecture shifts the initial file reading to the client side (browser) before passing the final data to the backend.

#### How It Will Work (Technical Flow)

1. **Client-Side Parsing (Next.js)**
   Instead of sending the file immediately to the FastAPI server, the Next.js frontend will use a library like `xlsx` (SheetJS) or `papaparse` to read the Excel file directly in the user's browser the moment it is dropped into the upload zone. This provides an instant data read without server latency.

2. **Data Grid Rendering (Next.js + UI Library)**
   The parsed JSON data will be rendered on the page using a data table component (such as those provided by shadcn/ui or a specialized grid like react-data-grid). This table will mirror the uploaded Excel sheet.

3. **Interactive Selection (State Management)**
   Next.js will use state (e.g., React `useState` or Zustand) to track user interactions. You will add checkbox columns or column-header toggles allowing the user to select specific data points (e.g., selecting the "Revenue" column and rows 1-10).

4. **Real-Time Visualization (Recharts)**
   As the user selects rows and columns, the Next.js state will dynamically pass the selected subset of data to Recharts. Recharts will instantly render and update the line, bar, or pie charts on the same page, fulfilling the interactive visualization requirement.

5. **Final Submission (FastAPI + Supabase)**
   Once the user is satisfied with the preview and selection:

       - The original Excel file is uploaded to Supabase Storage.
       - A payload containing the user's selected columns/rows is sent to the FastAPI endpoint.
       - FastAPI utilizes pandas to isolate the selected data, performs the mandatory template validation, runs the consolidation logic, and writes the final statistics to the Supabase PostgreSQL database.

#### Data Flow Layers

┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Frontend                          │   │
│  │  (App Router + Tailwind CSS + shadcn/ui)                    │   │
│  │  - Dark mode UI                                              │   │
│  │  - Recharts visualizations                                   │   │
│  │  - File upload components (to Supabase Storage)              │   │
│  │  - Auth via Supabase (email/password, role-based)            │   │
│  │  - State management (Context/Zustand + Supabase client)      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS + Supabase Realtime/Webhook
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER A (Supabase)                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Supabase Services                        │   │
│  │  - PostgreSQL Database (users, entities, statistics, etc.)   │   │
│  │  - Auth (sessions, password reset, role-based ACL)           │   │
│  │  - Storage (buckets for uploaded .xlsx/.xls files)           │   │
│  │  - Webhooks (trigger FastAPI on upload)                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS (REST API)
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER B (FastAPI)                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Python Microservice (FastAPI)                │   │
│  │  - Excel processing (pandas + openpyxl)                      │   │
│  │  - Validation & consolidation logic                          │   │
│  │  - Database write/read (SQLAlchemy or supabase-py)           │   │
│  │  - Background tasks (FastAPI BackgroundTasks)                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Database Schema (Simplified)

```sql
-- Core Tables

entities
├── id (PK)
├── name
├── code (unique identifier)
├── parent_id (FK -> entities, for hierarchy)
├── contact_email
├── created_at
└── is_active

users
├── id (PK)
├── email
├── password_hash
├── entity_id (FK -> entities, nullable for admins)
├── role (admin, entity_user, viewer)
├── last_login
└── created_at

uploads
├── id (PK)
├── entity_id (FK -> entities)
├── user_id (FK -> users)
├── filename
├── file_path
├── period_type (annual, biannual)
├── period_year
├── period_half (1, 2, null)
├── status (pending, processed, failed)
├── error_message
├── processed_at
└── created_at

statistics
├── id (PK)
├── upload_id (FK -> uploads)
├── entity_id (FK -> entities)
├── metric_name
├── metric_value
├── period_type
├── period_year
├── period_half
└── created_at

audit_logs
├── id (PK)
├── user_id (FK -> users)
├── action (login, upload, download, etc.)
├── details (JSON)
├── ip_address
└── created_at
```

### 7.3 Technology Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| Frontend Framework | Next.js (App Router) | Reflex, Remix, Create React App | Superior AI code generation accuracy, built-in routing, React 18 features, excellent ecosystem. |
| Styling | Tailwind CSS | Bootstrap, Material UI, CSS Modules | Utility-first, perfect match for existing prototype colors, great dark mode support. |
| UI Components | shadcn/ui | Ant Design, MUI, Headless UI | Highly accessible, easy to customize, AI-friendly, matches dark mode requirements. |
| Data Visualization | Recharts | Chart.js, D3, Victory, Visx | Best React integration for interactive, animated charts; aligns with PRD. |
| State Management | React Context or Zustand | Redux, Mobx, Recoil | Lightweight, sufficient for app complexity; pairs well with Supabase client. |
| Backend – Core Infrastructure | Supabase | Firebase, AWS Amplify, Self-hosted PostgreSQL + Auth | Provides PostgreSQL, Auth, Storage, and webhooks out-of-the-box; reduces backend boilerplate significantly. |
| Backend – Processing Engine | FastAPI (Python) | Node.js/Express, Django, Flask | Python is unmatched for Excel/data processing (pandas/openpyxl); FastAPI offers high performance and automatic documentation. |
| Database ORM / Client | SQLAlchemy or Supabase Python Client | Prisma, TypeORM, Raw SQL | SQLAlchemy is mature and powerful; supabase-py offers direct Supabase integration. |
| Task Execution | FastAPI BackgroundTasks | Celery/Redis, BullMQ, Sidekiq | For MVP, BackgroundTasks is simple and sufficient; can scale to Celery/RabbitMQ later if needed. |
| Deployment | Docker + Nginx (for FastAPI) / Vercel (for Next.js) | Bare metal, PaaS | Consistent environments, scalable; Next.js frontend deployable to Vercel, FastAPI to Docker-enabled platforms. |

---

## 8. Design System & UI Specifications

### 8.1 Color Palette (Dark Mode Primary)

Based on reference images, using a sophisticated dark theme with purple/amber accents:

```
Background Layers:
├── bg-base:        #0F0F12    (Deepest - main background)
├── bg-surface:     #18181B    (Cards, containers)
├── bg-elevated:    #27272A    (Hover states, dropdowns)
├── bg-overlay:     #3F3F46    (Modal overlays)

Primary Colors:
├── primary:        #8B5CF6    (Purple - main actions)
├── primary-hover:  #A78BFA    (Purple hover)
├── primary-muted:  #7C3AED    (Purple pressed)

Accent Colors:
├── accent:         #F59E0B    (Amber - highlights, alerts)
├── accent-hover:   #FBBF24    (Amber hover)
├── success:        #10B981    (Green - success states)
├── warning:        #F59E0B    (Amber - warning)
├── error:          #EF4444    (Red - errors)
├── info:           #3B82F6    (Blue - informational)

Text Colors:
├── text-primary:   #FAFAFA    (Main text)
├── text-secondary: #A1A1AA    (Secondary text)
├── text-muted:     #71717A    (Disabled, placeholders)

Border Colors:
├── border-default: #27272A    (Standard borders)
├── border-hover:   #3F3F46    (Hover borders)

Gradient Cards (from reference):
├── gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
├── gradient-blue:   linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)
├── gradient-amber:  linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)
├── gradient-teal:   linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)
```

### 8.2 Typography

```
Font Family:
├── Headings:  'Inter', sans-serif (or 'Fira Sans')
├── Body:      'Inter', sans-serif
├── Monospace: 'Fira Code', monospace (for numbers, code)

Font Sizes (rem):
├── xs:    0.75rem  (12px) - Captions, badges
├── sm:    0.875rem (14px) - Secondary text
├── base:  1rem     (16px) - Body text
├── lg:    1.125rem (18px) - Subheadings
├── xl:    1.25rem  (20px) - Section titles
├── 2xl:   1.5rem   (24px) - Page titles
├── 3xl:   1.875rem (30px) - Hero headings
├── 4xl:   2.25rem  (36px) - Dashboard KPIs

Font Weights:
├── normal:   400
├── medium:   500
├── semibold: 600
├── bold:     700

Line Heights:
├── tight:    1.25
├── normal:   1.5
├── relaxed:  1.75
```

### 8.3 Spacing System

```
4px base unit (0.25rem):

├── space-1:   4px   (0.25rem) - Tight gaps
├── space-2:   8px   (0.5rem)  - Icon padding
├── space-3:   12px  (0.75rem) - Small gaps
├── space-4:   16px  (1rem)    - Standard padding
├── space-5:   20px  (1.25rem) - Medium gaps
├── space-6:   24px  (1.5rem)  - Section padding
├── space-8:   32px  (2rem)    - Large sections
├── space-10:  40px  (2.5rem)  - Page margins
├── space-12:  48px  (3rem)    - Major sections
├── space-16:  64px  (4rem)    - Hero spacing
```

### 8.4 Border Radius

```
├── radius-sm:   4px  - Small buttons, badges
├── radius-md:   8px  - Cards, inputs
├── radius-lg:   12px - Large cards
├── radius-xl:   16px - Hero sections
├── radius-2xl:  24px - Modal containers
├── radius-full: 9999px - Pills, avatars
```

### 8.5 Shadows (Dark Mode)

```
Dark mode shadows use inset highlights + subtle outer shadows:

├── shadow-sm:   0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)
├── shadow-md:   0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)
├── shadow-lg:   0 10px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)
├── shadow-glow-purple: 0 0 20px rgba(139, 92, 246, 0.3)
├── shadow-glow-amber:  0 0 20px rgba(245, 158, 11, 0.3)
```

### 8.6 Component Specifications

#### KPI Card (Reference Image 1 style)

```
┌────────────────────────────────────────┐
│  [Icon]                    [Trend +5%] │  <- 48px height header
│                                        │
│  83%                                   │  <- 36px font, font-mono
│  Prioritized tasks                     │  <- 14px, text-secondary
│  ════════════════════════ (progress)   │  <- Optional progress bar
└────────────────────────────────────────┘

Specifications:
- Background: gradient (purple-to-pink or blue-to-purple)
- Border-radius: 16px
- Padding: 24px
- Min-height: 140px
- Hover: translateY(-2px) + shadow-lg
- Transition: 200ms ease
```

#### Data Table Row

```
┌─────────────────────────────────────────────────────────────┐
│ [Avatar] Entity Name    │ Status     │ Submitted    │ [→]  │
│         entity@gov.pk   │ ● Complete │ 2 hours ago  │      │
└─────────────────────────────────────────────────────────────┘

Specifications:
- Row height: 72px
- Hover background: bg-elevated (#27272A)
- Border-bottom: 1px solid border-default
- Avatar: 40px, rounded-full
- Status badge: colored dot + text
```

#### Chart Container (Reference Image 2 style)

```
┌────────────────────────────────────────────────────────────┐
│  Statistics              [Days] [Weeks] [Months]           │
│  ──────────────────────────────────────────────────────── │
│  [Calendar row: 01-13 with active day highlighted]         │
│                                                            │
│  4h ─┐                                                     │
│  3h ─┤        ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮                        │
│  2h ─┤  ╭╌╌╌╌╌╯                  ╰╌╌╌╌╌╮                  │
│  1h ─┴──╯                              ╰────              │
│      7am   9am   11am   1pm   3pm   5pm   7pm   9pm       │
└────────────────────────────────────────────────────────────┘

Specifications:
- Background: bg-surface (#18181B)
- Border-radius: 16px
- Padding: 24px
- Chart line: primary (#8B5CF6) with dotted/dashed style
- Grid lines: rgba(255,255,255,0.05)
- Axis text: text-muted (#71717A)
- Active day: primary background with glow
```

#### Sidebar Navigation (Reference Image 2 style)

```
┌────────────────────┐
│  [PIDC Logo]       │  <- 64px height
│                    │
│  ──────────────    │
│                    │
│  [icon] Dashboard  │  <- Active: bg-primary/20 + left border
│  [icon] Upload     │
│  [icon] Entities   │
│  [icon] Analytics  │
│  [icon] Reports    │
│                    │
│  ──────────────    │
│                    │
│  [icon] Users      │
│  [icon] Settings   │
│                    │
│  ──────────────    │
│                    │
│  [avatar] Profile  │
│  [icon] Logout     │
└────────────────────┘

Specifications:
- Width: 240px (expanded) / 72px (collapsed)
- Background: bg-surface (#18181B)
- Active item: left 3px border primary + bg-primary/10
- Icon size: 20px
- Item padding: 12px 16px
- Item gap: 4px
```

### 8.7 Animation Guidelines

```
Timing:
├── instant:    0ms     - Immediate feedback
├── fast:       100ms   - Button press
├── normal:     200ms   - Hover states
├── slow:       300ms   - Modal open/close
├── slower:     500ms   - Page transitions

Easing:
├── ease-out:   cubic-bezier(0, 0, 0.2, 1)    - Enter animations
├── ease-in:    cubic-bezier(0.4, 0, 1, 1)    - Exit animations
├── ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) - Movement

Reduced Motion:
@media (prefers-reduced-motion: reduce) {
  * { 
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.8 Iconography

```
Icon Library: Lucide Icons (https://lucide.dev)

Sizes:
├── icon-sm:  16px - Inline with text
├── icon-md:  20px - Buttons, navigation
├── icon-lg:  24px - Section headers
├── icon-xl:  32px - Feature highlights

Style:
├── Stroke width: 1.5px (consistent)
├── Color: currentColor (inherits text color)
├── Never use emojis as functional icons
```

---

## 9. Information Architecture

### 9.1 Sitemap

```
PIDC Dashboard
│
├── / (Landing/Login)
│   └── Login form
│
├── /dashboard (Main Dashboard)
│   ├── KPI Cards (4-6 metrics)
│   ├── Trend Charts
│   ├── Submission Status Table
│   └── Quick Actions
│
├── /upload (File Upload)
│   ├── Upload Zone (drag & drop)
│   ├── Template Download
│   ├── Upload History
│   └── Validation Results
│
├── /entities (Entity Management) [Admin only]
│   ├── Entity List
│   ├── Entity Details
│   ├── Submission History
│   └── Add/Edit Entity
│
├── /reports (Report Generation)
│   ├── Consolidated Report Builder
│   ├── Report History
│   ├── Download Center
│   └── Scheduled Reports
│
├── /analytics (Detailed Analytics)
│   ├── Comparison Charts
│   ├── Trend Analysis
│   ├── Export Options
│   └── Custom Filters
│
├── /users (User Management) [Admin only]
│   ├── User List
│   ├── Role Assignment
│   ├── Activity Logs
│   └── Add/Edit User
│
└── /settings
    ├── Profile
    ├── Notifications
    ├── Deadlines [Admin]
    └── System Config [Admin]
```

### 9.2 Navigation Structure

**Sidebar Navigation:**

| Icon | Label | Route | Access |
|------|-------|-------|--------|
| LayoutDashboard | Dashboard | /dashboard | All |
| Upload | Upload | /upload | Entity, Admin |
| Building2 | Entities | /entities | Admin |
| BarChart3 | Analytics | /analytics | All |
| FileText | Reports | /reports | Admin |
| Users | Users | /users | Admin |
| Settings | Settings | /settings | All |

---

## 10. Wireframes & User Flows

### 10.1 Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  PIDC Statistics Dashboard               🔍 Search   [👤 Admin ▼]   │
├────────┬────────────────────────────────────────────────────────────────────┤
│        │                                                                    │
│  NAV   │   Welcome back, Fatima                                            │
│        │   Your dashboard overview                          March 12, 2026  │
│  ────  │                                                                    │
│        │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  [📊]  │   │ ░░░░░░░░ │ │ ░░░░░░░░ │ │ ░░░░░░░░ │ │ ░░░░░░░░ │            │
│  [📤]  │   │ Total    │ │ Pending  │ │ Completed│ │ Overdue  │            │
│  [🏢]  │   │ Entities │ │ Uploads  │ │ Rate     │ │ Entities │            │
│  [📈]  │   │   47     │ │   12     │ │   74%    │ │    3     │            │
│  [📁]  │   │ +2 new ▲ │ │ -5 ▼    │ │ +8% ▲   │ │ +1 ▲    │            │
│        │   └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ────  │   (gradient)   (gradient)   (gradient)   (gradient)              │
│        │                                                                    │
│  [👥]  │   ┌────────────────────────────────────┐ ┌─────────────────────┐ │
│  [⚙️]  │   │  Submissions Over Time             │ │ Entity Distribution │ │
│        │   │  ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮                 │ │                     │ │
│        │   │  ╭╯              ╰╌╌╌╮             │ │    [Pie Chart]      │ │
│        │   │ ╌╯                   ╰╌╌           │ │                     │ │
│        │   │  Jan  Feb  Mar  Apr  May  Jun     │ │   ● Type A: 45%     │ │
│        │   │                                    │ │   ● Type B: 32%     │ │
│        │   └────────────────────────────────────┘ │   ● Type C: 23%     │ │
│        │                                          └─────────────────────┘ │
│  ────  │                                                                    │
│        │   Recent Submissions                           [View All →]       │
│ [User] │   ┌────────────────────────────────────────────────────────────┐ │
│ Logout │   │ [A] Karachi Corp   │ 2025-H2   │ ● Done    │ 2 hours ago  │ │
│        │   │ [L] Lahore Div     │ 2025-H2   │ ● Done    │ 5 hours ago  │ │
│        │   │ [P] Peshawar Unit  │ 2025-H2   │ ◐ Pending │ --           │ │
│        │   │ [I] Islamabad HQ   │ 2025-H2   │ ● Done    │ 1 day ago    │ │
└────────┴────────────────────────────────────────────────────────────────────┘

Color Key:
- Background: #0F0F12
- Cards: #18181B with gradient overlays
- Active nav: #8B5CF6 left border + bg-purple/10
- Success dot: #10B981
- Pending dot: #F59E0B
- Trend up: #10B981
- Trend down: #EF4444
```

### 10.2 Upload Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Upload Statistics                       🔍 Search   [👤 User ▼]    │
├────────┬────────────────────────────────────────────────────────────────────┤
│        │                                                                    │
│  NAV   │   Upload Your Report                                              │
│        │   Submit your annual or bi-annual statistics                       │
│        │                                                                    │
│        │   ┌────────────────────────────────────────────────────────────┐ │
│        │   │  ┌─────────────────────────────────────────────────────┐  │ │
│        │   │  │                                                     │  │ │
│        │   │  │              ┌──────────────┐                       │  │ │
│        │   │  │              │  [FileUp]    │                       │  │ │
│        │   │  │              │   64x64      │                       │  │ │
│        │   │  │              └──────────────┘                       │  │ │
│        │   │  │                                                     │  │ │
│        │   │  │     Drag & drop your Excel file here                │  │ │
│        │   │  │     or click to browse                              │  │ │
│        │   │  │                                                     │  │ │
│        │   │  │     ─────────────────────────────────               │  │ │
│        │   │  │     Supported: .xlsx, .xls (max 50MB)               │  │ │
│        │   │  └─────────────────────────────────────────────────────┘  │ │
│        │   │                                                            │ │
│        │   │   Reporting Period                                         │ │
│        │   │   ┌────────────────┐  ┌────────────────┐                  │ │
│        │   │   │ Year: 2025  ▼  │  │ Period: H2  ▼  │                  │ │
│        │   │   └────────────────┘  └────────────────┘                  │ │
│        │   │                                                            │ │
│        │   │   ┌─────────────────────┐  ┌─────────────────────┐        │ │
│        │   │   │ 📥 Download Template │  │ ⬆️ Upload Report    │        │ │
│        │   │   └─────────────────────┘  └─────────────────────┘        │ │
│        │   └────────────────────────────────────────────────────────────┘ │
│        │                                                                    │
│        │   Previous Uploads                                                 │
│        │   ┌────────────────────────────────────────────────────────────┐ │
│        │   │ stats_2024_H2.xlsx │ 2024-H2  │ ✓ Processed │ Dec 15, 2024│ │
│        │   │ stats_2024_H1.xlsx │ 2024-H1  │ ✓ Processed │ Jun 30, 2024│ │
│        │   │ stats_2023.xlsx    │ 2023-Ann │ ✓ Processed │ Jan 15, 2024│ │
└────────┴────────────────────────────────────────────────────────────────────┘
```

### 10.3 User Flow: Entity Upload

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Dashboard  │────▶│   Upload    │────▶│  Select     │
│   Page      │     │   (Home)    │     │   Page      │     │  Period     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                    ┌─────────────────────────────────────────────┘
                    ▼
              ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
              │  Drag/Drop  │────▶│  Validate   │────▶│  Success    │
              │  Excel File │     │  File       │     │  Message    │
              └─────────────┘     └─────────────┘     └─────────────┘
                                         │
                                         ▼ (if errors)
                                  ┌─────────────┐
                                  │  Show Error │
                                  │  Details    │────▶ (user fixes & retries)
                                  └─────────────┘
```

### 10.4 User Flow: Admin Report Generation

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Dashboard  │────▶│  Reports    │
│   (Admin)   │     │   (Home)    │     │  Page       │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
              ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
              │  Select     │────▶│  Select     │────▶│  Generate   │
              │  Period     │     │  Entities   │     │  Report     │
              └─────────────┘     └─────────────┘     └─────────────┘
                                                             │
                                                             ▼
                                                      ┌─────────────┐
                                                      │  Download   │
                                                      │  Excel/PDF  │
                                                      └─────────────┘
```

---

## 11. Security & Compliance

### 11.1 Authentication & Authorization

| Requirement | Implementation |
|-------------|----------------|
| Password hashing | bcrypt with salt (min 12 rounds) |
| Session management | JWT with 24-hour expiry, refresh tokens |
| Multi-factor auth | TOTP (optional, recommended for admins) |
| Password policy | Min 12 chars, mixed case, number, special char |
| Account lockout | 5 failed attempts = 15-minute lockout |
| Role-based access | Admin, Entity User, Viewer roles |

### 11.2 Data Protection

| Requirement | Implementation |
|-------------|----------------|
| Data at rest | AES-256 encryption |
| Data in transit | TLS 1.3 mandatory |
| File uploads | Virus scanning before processing |
| PII handling | Minimal collection, encrypted storage |
| Data retention | 10 years (government requirement) |
| Right to deletion | Admin-controlled data purging |

### 11.3 Audit & Compliance

| Requirement | Implementation |
|-------------|----------------|
| Activity logging | All user actions logged with timestamp, IP |
| Log retention | 7 years (compliance requirement) |
| Access logs | Who accessed what data, when |
| Change tracking | All data modifications versioned |
| Report generation | Audit trail for generated reports |

### 11.4 Government Compliance

| Standard | Requirement | Status |
|----------|-------------|--------|
| Pakistan Data Protection | Personal data handling guidelines | Required |
| ISO 27001 | Information security management | Recommended |
| WCAG 2.1 AA | Accessibility compliance | Required |

---

## 12. Rollout Plan

### 12.1 Development Phases

| Phase | Duration | Deliverables | Dependencies |
|-------|----------|--------------|--------------|
| **Phase 1: Foundation** | 4 weeks | Auth, DB schema, basic UI shell | Design approval |
| **Phase 2: Core Features** | 6 weeks | Upload, validation, dashboard | Phase 1 |
| **Phase 3: Reporting** | 4 weeks | Consolidation, Excel generation | Phase 2 |
| **Phase 4: Polish** | 3 weeks | Analytics, notifications, testing | Phase 3 |
| **Phase 5: Deployment** | 2 weeks | Production setup, training | Phase 4 |

**Total: ~19 weeks to production**

### 12.2 Milestones

| Milestone | Target Date | Criteria |
|-----------|-------------|----------|
| M1: Design Complete | Week 2 | UI mockups approved |
| M2: Alpha Release | Week 8 | Core upload + dashboard functional |
| M3: Beta Release | Week 14 | All features, internal testing |
| M4: UAT Complete | Week 17 | User acceptance testing passed |
| M5: Production Launch | Week 19 | Go-live with 5 pilot entities |
| M6: Full Rollout | Week 24 | All entities onboarded |

### 12.3 Training Plan

| Audience | Training Type | Duration | Content |
|----------|---------------|----------|---------|
| PIDC Admins | In-person workshop | 1 day | Full system administration |
| Entity Users | Video tutorials | 2 hours | Upload process, template usage |
| Executives | Demo session | 30 min | Dashboard overview, report access |

---

## 13. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Entity adoption resistance | Medium | High | Training, helpdesk support, gradual rollout |
| Excel format inconsistencies | High | Medium | Strict validation, downloadable templates |
| Large file upload failures | Medium | Medium | Chunked uploads, resume capability |
| Data security breach | Low | Critical | Encryption, audit logs, penetration testing |
| Performance degradation | Medium | Medium | Load testing, caching, CDN |
| Reflex framework limitations | Low | Medium | Fallback to custom React components |

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|------|------------|
| PIDC | Pakistan Industrial Development Corporation |
| Entity | A subsidiary organization under PIDC |
| Annual Report | Yearly statistical submission |
| Bi-annual Report | Half-yearly statistical submission (H1/H2) |
| Consolidated Report | Master Excel combining all entity data |
| KPI | Key Performance Indicator |

### 14.2 Excel Template Structure

```
Standard Template Columns:
├── Column A: Metric ID (auto-generated)
├── Column B: Metric Name (required)
├── Column C: Category (dropdown: Financial, Operational, HR, etc.)
├── Column D: Value (required, numeric)
├── Column E: Unit (PKR, %, Count, etc.)
├── Column F: Previous Period Value (optional)
├── Column G: Notes (optional)

Required Sheets:
├── Sheet 1: "Summary" - High-level KPIs
├── Sheet 2: "Financial" - Revenue, expenses, budget
├── Sheet 3: "Operational" - Production, efficiency
├── Sheet 4: "Human Resources" - Headcount, training
├── Sheet 5: "Metadata" - Entity info, submission date (auto-filled)
```

### 14.3 API Endpoints (Reference)

With the new architecture, the API endpoints are distributed between the Next.js app (using Supabase client directly) and the FastAPI microservice:

#### Next.js Frontend (uses @supabase/supabase-js directly)
Authentication is handled via Supabase client methods:
- `supabase.auth.signIn({ email, password })`
- `supabase.auth.signOut()`
- `supabase.auth.session()` for session management

Data fetching is done via Supabase client:
- `supabase.from('entities').select()` for entity lists
- `supabase.from('uploads').select()` for upload history
- `supabase.from('statistics').select()` for dashboard data
- `supabase.storage.from('uploads').getPublicUrl()` for file access

#### FastAPI Microservice Endpoints
The FastAPI service handles Excel processing and receives webhooks from Supabase:

```
Processing:
POST   /process-upload          (Triggered by Supabase Storage webhook)
GET    /upload-status/{upload_id}  (Check processing status)
POST   /validate-template       (Optional: validate Excel template structure)
```

#### Webhook Payload from Supabase Storage to FastAPI
When an upload completes in Supabase Storage, it sends a webhook to `/process-upload` with payload:
```json
{
  "eventType": "OBJECT_WRITE",
  "bucketId": "uploads",
  "objectId": "filename.xlsx",
  "userId": "supabase-user-id",
  "metadata": {
    "entityId": "entity-uuid",
    "periodType": "annual",
    "periodYear": 2025
  }
}
```

#### Next.js to FastAPI Communication (User Selection Payload)
After client-side preview, Next.js sends this payload to FastAPI:
```json
{
  "filePath": "storageBucket/uploads/filename.xlsx",
  "selections": {
    "columns": ["Revenue", "Expenses", "Profit"],
    "rows": [1, 2, 3, 4, 5], // or range objects
    "sheetName": "Financial"
  },
  "metadata": {
    "entityId": "entity-uuid",
    "periodType": "annual",
    "periodYear": 2025,
    "uploadedBy": "user-id"
  }
}
```

### 14.4 Design Principles from Reference Images

The UI draws inspiration from the provided reference designs:

| Principle | Implementation |
|-----------|----------------|
| **Gradient KPI cards** | Purple-pink, blue-purple, teal-blue gradients |
| **Dotted chart lines** | Softer visual feel than solid lines |
| **Dark background** | #0F0F12 base with #18181B cards |
| **Purple accent** | #8B5CF6 for active states, buttons |
| **Amber highlights** | #F59E0B for alerts, badges, trends |
| **Avatar groupings** | User avatars in submission lists |
| **Generous spacing** | No cramped layouts, 24px card padding |
| **Subtle shadows** | Inset highlights + soft outer glow |
| **Status pills** | Colored dots + text labels |
| **Calendar row** | Date selector with active day highlight |
| **Sidebar icons** | Minimal icon sidebar with tooltips |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 12, 2026 | Product Team | Initial draft |

---

**Approval Signatures:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| PIDC Stakeholder | | | |
