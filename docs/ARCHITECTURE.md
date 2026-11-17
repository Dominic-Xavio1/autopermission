# System Architecture — ASYV PassFlow

This document describes the technical design, runtime boundaries, data persistence model, and real-time synchronization flow of **ASYV PassFlow**.

---

## 1. High-Level Request & Real-Time Flow

```text
+-----------------------+        Server Actions        +--------------------------+
|  Browser Client       | ---------------------------> |  Next.js App Server      |
|  (PassFlowApp.jsx)    |                              |  (src/actions/           |
|                       | <--------------------------- |   permissions.js)        |
|  - TeacherDashboard   |      SSE Stream (JSON)       +------------+-------------+
|  - AdminDashboard     |   GET /api/events                         |
|  - LandingHero        |                                           | Drizzle ORM
+-----------------------+                                           | (pg.Pool)
                                                                    v
                                                       +--------------------------+
                                                       |  PostgreSQL / Cloud SQL  |
                                                       |  - users                 |
                                                       |  - permission_requests   |
                                                       +--------------------------+
```

---

## 2. Core Architectural Layers

### A. Server-Side Entry & Hydration (`app/page.jsx`)
- `HomePage` is a dynamic Server Component (`export const dynamic = 'force-dynamic'`).
- On every page request, it queries `getPermissionRequests()` directly from PostgreSQL on the server and passes `initialRequests` and a deterministic `defaultRequestDate` down to `<PassFlowApp />`.
- This guarantees immediate SSR HTML output with live data and prevents client loading flashes or hydration mismatches.

### B. Data Access & Server Actions (`src/actions/permissions.js`, `src/db/`)
- **Connection Pooling (`src/db/index.js`)**: Instantiates a singleton `pg.Pool` stored on `global._postgresPool` to avoid connection exhaustion during Next.js hot reloads or concurrent requests.
- **Explicit Host/Credential Config**: Reads `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, and `SQL_DB_NAME` directly from `process.env`.
- **Safe Cache Revalidation**: `safeRevalidate()` checks `process.env.NEXT_RUNTIME` and dynamically invokes `revalidatePath('/')`, allowing the exact same Server Actions module to run inside standalone Node.js CLI regression scripts (`npm test`).

### C. Real-Time Multi-Role Sync (`src/lib/events.js`, `app/api/events/route.js`)
- Mutations (`createPermissionRequest`, `updateRequestStatus`, `deletePermissionRequest`) call `emitRealtimeEvent(type, payload)` onto a shared `global._realtimeBus` (`EventEmitter`).
- `GET /api/events` opens a `ReadableStream` SSE response with 25-second keep-alive heartbeats and cleans up listeners when the request aborts.
- `useRealtimePermissions` subscribes via `EventSource('/api/events')`, updates React state immediately without requiring a manual page reload, and triggers role-relevant toast notifications.

### D. Dual-Theme Styling System (`app/globals.css`)
- Uses Tailwind CSS v4 with `@custom-variant dark (&:where(.dark, .dark *));`.
- **Dark Mode** (`html.dark`): Obsidian canvas (`#060908`), mint-emerald highlights (`#3ed598`), and deep emerald radial hero glow.
- **White Mode** (`html` without `.dark`): Crisp white canvas (`#ffffff`), vibrant orange accents (`#f97316` / `#ea580c`), and soft orange atmospheric radial glow.
- Theme toggling updates `document.documentElement.classList` cleanly without CSS inversion hacks.

---

## 3. Security & Reliability Notes
- Environment credentials remain strictly server-side; `.env*` files are excluded via `.gitignore` while `.env.example` documents required keys without values.
- Database constraints (`CHECK (role IN ...)`, `CHECK (status IN ...)`) enforce state integrity at the PostgreSQL layer in addition to Server Action validation.
- Standalone build mode (`output: 'standalone'` in `next.config.mjs`) optimizes container deployments on Cloud Run or Node hosts.
