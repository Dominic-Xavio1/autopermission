# ASYV PassFlow — School Permission Management System

**ASYV PassFlow** is a modern, full-stack school leave and campus gate-pass management platform built for **Agahozo-Shalom Youth Village (ASYV)**. It connects teachers, administrators, and principals in real time—streamlining permission requests, instant executive approvals, printable gate passes, and auditable campus logs backed by **PostgreSQL**.

Built strictly in **pure JavaScript / JSX** (zero TypeScript) using **Next.js 15 (App Router)**, **Tailwind CSS v4**, **Drizzle ORM**, and **Server-Sent Events (SSE)** for instant multi-role synchronization.

---

## Key Features

### 1. Dual-Theme Adaptive Interface (Dark Mode & White Mode)
- **Dark Mode (Obsidian & Mint-Emerald `#3ed598`)**: High-contrast dark workspace with subtle radial emerald atmosphere, capsule navigation, and crisp status indicators.
- **White Mode (Pure White & Vibrant Orange `#f97316`)**: Clean daylight interface where every primary CTA, active pill, live chart stroke, and accent highlight transitions seamlessly to warm ASYV orange.
- Instant header toggle (`White Mode` / `Dark Mode`) backed by Tailwind CSS v4 class-based `@custom-variant dark`.

### 2. Landing Overview & Live Campus Metrics
- Real-time PostgreSQL-backed summary metrics rendered via Next.js Server Components (`force-dynamic`).
- Interactive smartphone preview mockup and live SVG clearance-rate trend card with weekly/daily activity toggles.
- One-click persona routing directly into the Teacher or Admin/Principal workspace.

### 3. Teacher Workspace (4-Step Request Wizard & My Requests)
- **Guided 4-Step Permission Form**:
  1. **Profile & Category**: Pre-filled staff details, department selector, and request category (*Academic Field Trip*, *Official Duty*, *Professional Development*, *Medical & Health*, *Personal / Family Leave*).
  2. **Schedule & Duration**: Date picker and structured duration presets (*2 Hours*, *Half Day AM/PM*, *Full Day*, *2 Days*, *3+ Days*).
  3. **Justification**: Detailed reason entry with validation.
  4. **Live Summary Review**: Pre-submission pass summary card before dispatch.
- **My Requests Dashboard**: Filterable status cards (`Pending` with warm amber/orange indicator, `Approved` with emerald clearance and printable **Official Gate Pass**, and `Rejected` with reviewer feedback notes).

### 4. Admin & Principal Command Center
- **Unified Leadership View**: Shared command center for School Principals and Operations Administrators.
- **Real-Time Analytics Counters**: Total Requests, Active Pending Inbox, Approved Passes, and Declined Logs.
- **Active Pending Inbox**: Instant one-click **Approve** or structured **Deny** (with mandatory administrative review note via modal).
- **Sortable & Searchable Audit Logs**: Dynamic filtering by status, department, and keyword search across teacher name, department, category, and reason, plus **one-click CSV export**.

### 5. Real-Time Synchronization (`/api/events`)
- Server Actions emit domain events (`NEW_REQUEST`, `STATUS_CHANGED`, `REQUEST_DELETED`) onto an in-process event bus.
- Connected Teacher and Admin clients receive updates immediately over **Server-Sent Events** with toast notifications and automatic state synchronization.

### 6. Official Gate Pass & Database Inspector
- **Printable Campus Gate Pass**: Generates a formatted pass modal (`ASYV-PASS-XXXXX`) with authorization seal, QR verification reference, reviewer signature, and print CSS layout (`@media print`).
- **Built-in Schema Viewer**: Inspect the PostgreSQL DDL (`schema.sql`), Drizzle schema, and real-time architecture directly from the top navigation bar.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | Pure JavaScript (ES2022+) & JSX (No TypeScript) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`), `Plus Jakarta Sans` & `Playfair Display` |
| **Icons & Feedback** | `lucide-react`, `canvas-confetti` |
| **Database** | PostgreSQL / Google Cloud SQL (`pg` connection pool) |
| **ORM & Migrations** | Drizzle ORM (`drizzle-orm/node-postgres`) & `drizzle-kit` |
| **Real-Time Transport** | Native Server-Sent Events (`/api/events`) + Node `EventEmitter` |
| **Testing** | Node.js ESM regression test suite (`npm test`) |

---

## Project Structure

```text
├── app/
│   ├── api/events/route.js      # SSE real-time stream endpoint
│   ├── globals.css              # Tailwind v4 setup, @custom-variant dark, dual hero backdrops
│   ├── layout.jsx               # Root layout, Google Fonts, initial dark class & metadata
│   └── page.jsx                 # SSR entry fetching initial PostgreSQL permission requests
├── src/
│   ├── actions/permissions.js   # Next.js Server Actions for CRUD & analytics
│   ├── components/
│   │   ├── PassFlowApp.jsx      # Top-level state, SSE subscription, theme & persona routing
│   │   ├── Header.jsx           # Capsule navigation, persona switcher, White/Dark mode toggle
│   │   ├── LandingHero.jsx      # Hero section, live phone preview, interactive SVG analytics card
│   │   ├── TeacherDashboard.jsx # 4-step request wizard & teacher status card grid
│   │   ├── AdminDashboard.jsx   # KPI counters, pending inbox, sortable logs & CSV export
│   │   ├── GatePassModal.jsx    # Printable official ASYV security gate pass
│   │   ├── ReviewModal.jsx      # Admin/Principal decision & justification modal
│   │   └── SchemaViewerModal.jsx# Interactive PostgreSQL DDL & Drizzle schema viewer
│   ├── db/
│   │   ├── index.js             # Singleton pg.Pool & Drizzle ORM instance
│   │   ├── schema.js            # Drizzle table definitions & relations
│   │   └── drizzle.config.js    # Drizzle Kit configuration
│   ├── hooks/
│   │   └── useRealtimePermissions.js # Client SSE subscription & toast notification hook
│   └── lib/
│       └── events.js            # Shared server-side EventEmitter bus
├── scripts/
│   └── regression_test.mjs      # End-to-end PostgreSQL CRUD & search regression suite
├── docs/
│   └── ARCHITECTURE.md          # Detailed system architecture & data-flow documentation
├── schema.sql                   # Standalone PostgreSQL DDL script with indexes & constraints
├── jsconfig.json                # Path alias configuration (@/*)
└── next.config.mjs              # Next.js configuration (standalone build & proxy origins)
```

---

## Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`
- **PostgreSQL** `>= 14.x` (local instance or Google Cloud SQL)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/asyv-passflow.git
cd asyv-passflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (or `.env.local`) and fill in your PostgreSQL connection credentials:

```bash
cp .env.example .env
```

```env
SQL_HOST="127.0.0.1"
SQL_USER="postgres"
SQL_PASSWORD="your-secure-password"
SQL_DB_NAME="asyv_passflow"
APP_URL="http://localhost:3000"
```

### 4. Initialize the PostgreSQL Schema
Apply the schema using `psql` or Drizzle Kit:

```bash
# Option A: Apply standalone SQL DDL
psql -h "$SQL_HOST" -U "$SQL_USER" -d "$SQL_DB_NAME" -f schema.sql

# Option B: Push schema with Drizzle Kit
npx drizzle-kit push --config=src/db/drizzle.config.js
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Quality Checks

| Check | Command | Description |
| :--- | :--- | :--- |
| **Regression Tests** | `npm test` | Runs `scripts/regression_test.mjs` against live PostgreSQL (fetch, stats, create, teacher filter, approval update, dynamic search, cleanup) |
| **Linter** | `npm run lint` | Runs `eslint .` with `eslint-config-next` across all `.js` / `.jsx` files |
| **Production Build** | `npm run build` | Builds optimized standalone Next.js production bundle |
| **Start Production** | `npm start` | Launches production Next.js server |

---

## Database Schema Summary

- **`users`**: Stores ASYV staff profiles (`id`, `uid`, `name`, `email`, `role` [`teacher` | `admin` | `principal`], `department`, `avatar`, `created_at`).
- **`permission_requests`**: Stores leave requests & audit decisions (`id`, `teacher_name`, `teacher_email`, `department`, `request_date`, `duration`, `category`, `reason`, `status` [`pending` | `approved` | `rejected`], `reviewer_name`, `reviewer_role`, `reviewer_note`, `reviewed_at`, `created_at`) with indexes on `status`, `teacher_email`, `department`, and `created_at DESC`.

---

## License

Built for **Agahozo-Shalom Youth Village (ASYV)** campus operations. See `CONTRIBUTING.md` for contribution guidelines.
