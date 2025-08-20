# TaskPlanet Frontend

A React + TypeScript + Vite frontend.

**Principle:** the client only sends **neutral parameters** (`{ tagCodes, time, limit }`) to the backend. Ranking and validity are decided by the backend.

---

## Quick Start

**Requirements**

- Node 18+ (LTS recommended)
- pnpm (or npm / yarn)

**Install & run**

```bash
pnpm i
# Configure API base (project root)
echo "VITE_API_BASE=/api" > .env.development   # or a full URL, e.g. http://localhost:8080
pnpm dev
```

> If you use `/api` as base, make sure your dev server proxies to the backend; otherwise set a full URL.

---

## Environment Variables

> Only variables prefixed with `VITE_` are exposed to the client.

```
# .env.development / .env.production
VITE_API_BASE=/api      # or a full URL like http://localhost:8080
```

---

## Project Structure (Core)

```
src/
  app/
    layout.tsx               # Header + <Outlet />
    routes.tsx               # Routes (Home / Suggest)
  api/
    client.ts                # API client + tolerant normalizers for dev
  components/
    ActiveQueryBar.tsx       # Parameters panel (tags / time / limit)
    ui/Toast.tsx
  features/
    tags/
      useTags.ts             # GET /api/tags
      TagChips.tsx
    suggest/
      SuggestList.tsx        # POST /api/suggest + event reporting
    today/
      TodayTaskList.tsx      # Local "Today" list (dev/verification only)
  lib/
    fetcher.ts               # Fetch wrapper, tolerates non‑JSON error bodies
    storage.ts               # LocalStorage helpers for Today list
    prefs.ts                 # User defaults (tags/time/limit)
  pages/
    Home.tsx                 # Pick tags → /suggest; shows Today
    Suggest.tsx              # Param panel + suggestions list (no client filtering)
  styles/index.css
  types/index.ts             # Types: Tag / Suggestion / SuggestParams / Events
```

---

## Usage Flow (MVP)

1. **Home**

- Loads available tags (`GET /api/tags`).
- “Get suggestions” navigates to `/suggest?tags=...&time=...&limit=...`.

2. **Suggest**

- Top panel edits **tags / time / limit** (kept in the URL).
- Calls `POST /api/suggest` with the minimal body `{ tagCodes, time?, limit? }`.
- Renders suggestion cards (title, description, time, tag list).
- On first load: sends **one impression per item** → `POST /api/events { event, taskId, tagCodes }`.
- Buttons:
  - **Start** → `adopt` event
  - **Skip** → `skip` event

- On **Start**, the item is also stored in a local **Today** list (LocalStorage) for quick verification.

> The frontend does **no** filtering/reordering/fallback. The backend decides results.

---

## API (current usage)

### GET `/api/tags`

**Expected response**

```json
[{ "code": "context/desk", "name": "Desk" }, { "code": "focus/high" }]
```

### POST `/api/suggest`

**Request**

```json
{ "tagCodes": ["context/desk", "focus/high"], "time": 20, "limit": 10 }
```

**Suggested response shape**

```json
[
  {
    "taskId": 123,
    "title": "Deep work: 20 min focus",
    "description": "Close Slack and focus on the proposal.",
    "tagCodes": ["context/desk", "focus/high"],
    "suggestedTime": 20
  }
]
```

### POST `/api/events`

**Request**

```json
{ "event": "impression" | "adopt" | "skip", "taskId": 123, "tagCodes": ["..."] }
```

---

## Dev Commands

```bash
pnpm dev          # Run dev server
pnpm build        # Production build
pnpm preview      # Preview built assets
pnpm tsc --noEmit # Type check
```

---

## Troubleshooting (short)

- **Proxy error / ECONNREFUSED**: backend not listening on the proxy target. Start the backend or set `VITE_API_BASE` to a full URL.
- **500 / non‑JSON response**: `fetcher.ts` surfaces error bodies; check Network → Response and backend logs.
- **No suggestions**: verify the backend directly

  ```bash
  curl -i http://localhost:8080/api/tags
  curl -i -X POST http://localhost:8080/api/suggest \
    -H 'Content-Type: application/json' \
    -d '{"tagCodes":["context/desk"],"time":20,"limit":5}'
  ```
